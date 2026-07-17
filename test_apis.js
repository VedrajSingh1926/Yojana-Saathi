import dotenv from 'dotenv';
dotenv.config();

async function testGemini() {
  console.log('--- Testing Gemini API ---');
  const apiKey = process.env.GEMINI_API_KEY;
  const isBearer = !apiKey.startsWith('AIza');
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

async function testMem0() {
  console.log('\n--- Testing Mem0 API ---');
  const apiKey = process.env.MEM0_API_KEY;
  try {
    const res = await fetch('https://api.mem0.ai/v1/memories', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 'test_user', messages: [{ role: 'user', content: 'Test memory' }] })
    });
    console.log('Mem0 POST Status:', res.status);
    const data = await res.json();
    if (!res.ok) console.log('Mem0 Error:', JSON.stringify(data));
    else console.log('Mem0 POST Success!');
  } catch (e) {
    console.log('Mem0 Fetch Error:', e.message);
  }
}

async function testGnani() {
  console.log('\n--- Testing Gnani API ---');
  const apiKey = process.env.GNANI_API_KEY;
  // Let's just do a basic GET or empty POST to see if auth works, or at least check the response
  try {
    const res = await fetch('https://api.vachana.ai/stt/v3', {
      method: 'POST',
      headers: { 'token': apiKey }
    });
    console.log('Gnani Status:', res.status); // 400 or something if auth passes but no file
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
