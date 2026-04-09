import {documentEventHandler} from '@sanity/functions'

interface StarshipData {
  _id: string
  name: string
  registry?: string
}

export const handler = documentEventHandler<StarshipData>(async ({context, event}) => {
  const {data} = event
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO // e.g. "username/repo-name"

  if (!token || !repo) {
    console.warn('GITHUB_TOKEN or GITHUB_REPO not set — skipping rebuild')
    return
  }

  if (context.local) {
    console.log(`[dry run] Would trigger rebuild for: ${data.name} (${data.registry || 'no registry'})`)
    return
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'sanity-rebuild',
        client_payload: {
          ship: data.name,
          registry: data.registry || '',
        },
      }),
    })

    if (!res.ok) {
      throw new Error(`GitHub API returned ${res.status}: ${await res.text()}`)
    }

    console.log(`🖖 Rebuild triggered for: ${data.name} (${data.registry || 'no registry'})`)
  } catch (err) {
    console.error('Failed to trigger rebuild:', err)
  }
})
