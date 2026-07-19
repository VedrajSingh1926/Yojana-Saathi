import { fork } from 'child_process';
import fetch from 'node-fetch';

const server = fork('server.js', [], { env: { ...process.env, PORT: '5001', NODE_ENV: 'development' } });

setTimeout(async () => {
  try {
    const res = await fetch('http://localhost:5001/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: '+911234567890', otp: '123456' })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (e) {
    console.error('Fetch error:', e);
  } finally {
    server.kill();
  }
}, 3000);
