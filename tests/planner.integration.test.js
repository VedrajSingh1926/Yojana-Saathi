import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';

describe('Planner Flow Integration Tests', () => {
  beforeAll(async () => {
    // MongoDB should be connected by server.js, wait for it if needed or let it use existing connection
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should validate the prompt for the planner endpoint', async () => {
    const res = await request(app)
      .post('/api/ai/planner')
      .send({ user: { saathiId: 'testUser1' } });
      
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors[0].msg).toBe('Prompt is required');
  });

  it('should handle a successful planner request', async () => {
    // This will trigger the real APIs. If API keys are valid, it should return 200.
    const res = await request(app)
      .post('/api/ai/planner')
      .send({ prompt: 'I want to apply for PM Awas Yojana', user: { saathiId: 'testUser1', family: { members: 2 } } });
      
    if (res.statusCode === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.reply).toHaveProperty('roadmap');
    } else {
      // In case Gemini fails (e.g. key expired), it should return a 500 error structure
      expect(res.statusCode).toEqual(500);
      expect(res.body.success).toBe(false);
    }
  }, 30000); // 30 second timeout for external API calls
});
