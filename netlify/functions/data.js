const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const store = getStore({ name: 'edifix', consistency: 'strong' });

    if (event.httpMethod === 'GET') {
      const data = await store.get('projects', { type: 'text' });
      return { statusCode: 200, headers, body: data || 'null' };
    }

    if (event.httpMethod === 'POST') {
      const body = event.body;
      if (!body) return { statusCode: 400, headers, body: '"Missing body"' };
      await store.set('projects', body);
      return { statusCode: 200, headers, body: '"saved"' };
    }

    return { statusCode: 405, headers, body: '"Method not allowed"' };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
