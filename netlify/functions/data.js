import { getStore } from '@netlify/blobs'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers })
  }
  try {
    const store = getStore('edifix')

    if (req.method === 'GET') {
      const data = await store.get('projects', { type: 'text' })
      return new Response(data ?? 'null', { headers })
    }

    if (req.method === 'POST') {
      const body = await req.text()
      await store.set('projects', body)
      return new Response('"saved"', { headers })
    }

    return new Response('"Method not allowed"', { status: 405, headers })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers })
  }
}
