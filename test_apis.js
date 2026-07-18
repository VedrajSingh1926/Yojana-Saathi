import dotenv from 'dotenv';
dotenv.config();

async function testGemini() {
  console.log('--- Testing Gemini API ---');
  const apiKey = process.env.GEMINI_API_KEY;
  const isBearer = apiKey.startsWith('ya29.');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent${isBearer ? '' : `?key=${apiKey}`}`;
  
  const headers = { 'Content-Type': 'application/json' };
  if (isBearer) headers['Authorization'] = `Bearer ${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello, just testing." }] }]
      })
    });
    console.log('Gemini Status:', res.status);
    const data = await res.json();
    if (!res.ok) console.log('Gemini Error:', JSON.stringify(data));
    else console.log('Gemini Success! Response:', data.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 50));
  } catch (e) {
    console.log('Gemini Fetch Error:', e.message);
  }
}

import { MemoryClient } from 'mem0ai';

async function testMem0() {
  console.log('\n--- Testing Mem0 API ---');
  const apiKey = process.env.MEM0_API_KEY;
  const client = new MemoryClient({ apiKey });
  try {
    const results = await client.add(
      [{ role: 'user', content: 'Test memory' }],
      { user_id: 'test_user' }
    );
    console.log('Mem0 SDK Add Success! Result:', results);
  } catch (e) {
    console.log('Mem0 SDK Error:', e.message);
  }
}

async function testGnani() {
  console.log('\n--- Testing Gnani API ---');
  const apiKey = process.env.GNANI_API_KEY;
  try {
    const res = await fetch('https://api.vachana.ai/stt/v3', {
      method: 'POST',
      headers: { 'X-API-Key-ID': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ language_code: 'en-IN' })
    });
    console.log('Gnani Status:', res.status);
    const data = await res.json();
    if (!res.ok && res.status !== 400 && res.status !== 422) console.log('Gnani Auth Error (not just missing file):', data);
    else console.log('Gnani Auth Success (got expected validation error instead of 401)! Status:', res.status);
  } catch (e) {
    console.log('Gnani Fetch Error:', e.message);
  }
}

async function runAll() {
  await testGemini();
  await testMem0();
  await testGnani();
}

runAll();
