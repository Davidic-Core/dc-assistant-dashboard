import { NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'Davidic-Core'
const GITHUB_API = 'https://api.github.com'

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3776ab',
  Rust: '#ce422b',
  Go: '#00add8',
  'C++': '#00599c',
  'C#': '#239120',
  C: '#555555',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Scala: '#c22d40',
  Haskell: '#5e5086',
}

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

    const res = await fetch(
      `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=owner`,
      { headers, next: { revalidate: 60 } }
    )

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `GitHub API error: ${res.status}`, detail: err }, { status: res.status })
    }

    const data = await res.json()

    const repos = (data as any[]).map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description || '',
      language: repo.language || 'Unknown',
      languageColor: LANGUAGE_COLORS[repo.language] || '#8b949e',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      isPrivate: repo.private,
      defaultBranch: repo.default_branch,
      htmlUrl: repo.html_url,
      topics: repo.topics || [],
      lastUpdated: new Date(repo.updated_at).toISOString(),
      pushedAt: repo.pushed_at ? new Date(repo.pushed_at).toISOString() : null,
      openIssues: repo.open_issues_count,
      size: repo.size,
      archived: repo.archived,
      fork: repo.fork,
    }))

    return NextResponse.json({ repos, total: repos.length, username: GITHUB_USERNAME })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
