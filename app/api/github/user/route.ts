import { NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'Davidic-Core'
const GITHUB_API = 'https://api.github.com'

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 })
  }

  try {
    const headers = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, { headers, next: { revalidate: 300 } }),
      fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&type=owner`, {
        headers,
        next: { revalidate: 300 },
      }),
    ])

    if (!userRes.ok) {
      const err = await userRes.text()
      return NextResponse.json({ error: `GitHub API error: ${userRes.status}`, detail: err }, { status: userRes.status })
    }

    const user = await userRes.json()
    let totalStars = 0

    if (reposRes.ok) {
      const repos = await reposRes.json()
      totalStars = (repos as any[]).reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)
    }

    return NextResponse.json({
      login: user.login,
      name: user.name || user.login,
      avatarUrl: user.avatar_url,
      bio: user.bio || '',
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars,
      location: user.location || '',
      blog: user.blog || '',
      company: user.company || '',
      createdAt: user.created_at,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
