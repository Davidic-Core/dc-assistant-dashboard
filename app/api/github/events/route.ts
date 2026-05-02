import { NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'Davidic-Core'
const GITHUB_API = 'https://api.github.com'

function formatEventType(event: any): 'commit' | 'pull_request' | 'branch' | 'push' | 'issue' | 'release' | 'fork' | 'star' {
  switch (event.type) {
    case 'PushEvent': return 'push'
    case 'PullRequestEvent': return 'pull_request'
    case 'CreateEvent':
      return event.payload?.ref_type === 'branch' ? 'branch' : 'commit'
    case 'CommitCommentEvent': return 'commit'
    case 'IssuesEvent': return 'issue'
    case 'ReleaseEvent': return 'release'
    case 'ForkEvent': return 'fork'
    case 'WatchEvent': return 'star'
    default: return 'commit'
  }
}

function formatEventTitle(event: any): string {
  const repo = event.repo?.name?.split('/')[1] || event.repo?.name || 'unknown'
  switch (event.type) {
    case 'PushEvent': {
      const count = event.payload?.commits?.length || 0
      const branch = event.payload?.ref?.replace('refs/heads/', '') || 'main'
      return `Pushed ${count} commit${count !== 1 ? 's' : ''} to ${branch}`
    }
    case 'PullRequestEvent': {
      const action = event.payload?.action || 'opened'
      const num = event.payload?.pull_request?.number
      const title = event.payload?.pull_request?.title || 'Pull request'
      return `${action.charAt(0).toUpperCase() + action.slice(1)} PR #${num}: ${title}`
    }
    case 'CreateEvent': {
      const refType = event.payload?.ref_type
      const ref = event.payload?.ref
      if (refType === 'branch') return `Created branch: ${ref}`
      if (refType === 'tag') return `Created tag: ${ref}`
      return `Created ${refType}`
    }
    case 'IssuesEvent': {
      const action = event.payload?.action || 'opened'
      const num = event.payload?.issue?.number
      const title = event.payload?.issue?.title || 'Issue'
      return `${action.charAt(0).toUpperCase() + action.slice(1)} issue #${num}: ${title}`
    }
    case 'ReleaseEvent': {
      const tag = event.payload?.release?.tag_name || ''
      return `Released ${tag}`
    }
    case 'ForkEvent': {
      return `Forked ${repo}`
    }
    case 'WatchEvent': {
      return `Starred ${repo}`
    }
    default:
      return event.type?.replace('Event', '') || 'Activity'
  }
}

function formatEventDescription(event: any): string {
  switch (event.type) {
    case 'PushEvent': {
      const commits = event.payload?.commits || []
      if (commits.length === 0) return 'No commits in this push'
      const first = commits[0]?.message || ''
      const msg = first.split('\n')[0]
      return commits.length > 1 ? `${msg} (+${commits.length - 1} more)` : msg
    }
    case 'PullRequestEvent': {
      return event.payload?.pull_request?.body?.split('\n')[0]?.slice(0, 120) || 'No description'
    }
    case 'CreateEvent': {
      return event.payload?.description || `New ${event.payload?.ref_type} created in repository`
    }
    case 'IssuesEvent': {
      return event.payload?.issue?.body?.split('\n')[0]?.slice(0, 120) || 'No description'
    }
    case 'ReleaseEvent': {
      return event.payload?.release?.body?.split('\n')[0]?.slice(0, 120) || 'New release published'
    }
    case 'ForkEvent': {
      return `Forked to ${event.payload?.forkee?.full_name || 'unknown'}`
    }
    default:
      return ''
  }
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
      `${GITHUB_API}/users/${GITHUB_USERNAME}/events?per_page=30`,
      { headers, cache: 'no-store' }
    )

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `GitHub API error: ${res.status}`, detail: err }, { status: res.status })
    }

    const data = await res.json()

    const activities = (data as any[]).map((event: any) => ({
      id: event.id,
      type: formatEventType(event),
      title: formatEventTitle(event),
      description: formatEventDescription(event),
      repo: event.repo?.name?.split('/')[1] || event.repo?.name || 'unknown',
      repoUrl: `https://github.com/${event.repo?.name}`,
      timestamp: event.created_at,
      author: event.actor?.login || GITHUB_USERNAME,
      avatarUrl: event.actor?.avatar_url || '',
    }))

    return NextResponse.json({ activities, username: GITHUB_USERNAME })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
