import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server.js';
import SmartPrompt from '../models/SmartPrompt.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { jest, describe, it, beforeAll, afterAll, expect } from '@jest/globals';

describe('Smart Prompts API', () => {
  let authToken;
  let userId;
  let testPromptId;

  beforeAll(async () => {
    // Create a test user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    userId = user._id;
    authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await SmartPrompt.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/smart-prompts', () => {
    it('should create a new prompt when authenticated', async () => {
      const promptData = {
        title: 'Test Prompt',
        content: 'Test content with {{variable}}',
        description: 'Test description',
        category: 'Technical',
        tags: ['test', 'api'],
        visibility: 'public'
      };

      const response = await request(app)
        .post('/api/smart-prompts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(promptData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe(promptData.title);
      testPromptId = response.body._id;
    });

    it('should reject prompt creation without authentication', async () => {
      const response = await request(app)
        .post('/api/smart-prompts')
        .send({
          title: 'Test Prompt',
          content: 'Content'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/smart-prompts', () => {
    it('should get public prompts without authentication', async () => {
      const response = await request(app)
        .get('/api/smart-prompts')
        .query({ visibility: 'public' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.prompts)).toBe(true);
    });

    it('should get filtered prompts', async () => {
      const response = await request(app)
        .get('/api/smart-prompts')
        .query({
          category: 'Technical',
          search: 'Test'
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.prompts)).toBe(true);
    });
  });

  describe('GET /api/smart-prompts/:id', () => {
    it('should get a public prompt by id', async () => {
      const response = await request(app)
        .get(`/api/smart-prompts/${testPromptId}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(testPromptId);
    });

    it('should not get a private prompt without authentication', async () => {
      // Create a private prompt first
      const privatePrompt = await SmartPrompt.create({
        title: 'Private Prompt',
        content: 'Private content',
        description: 'Private description',
        category: 'Technical',
        creator: userId,
        visibility: 'private'
      });

      const response = await request(app)
        .get(`/api/smart-prompts/${privatePrompt._id}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/smart-prompts/:id', () => {
    it('should update a prompt when authenticated as creator', async () => {
      const updateData = {
        title: 'Updated Test Prompt',
        content: 'Updated content'
      };

      const response = await request(app)
        .put(`/api/smart-prompts/${testPromptId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
    });

    it('should reject update without authentication', async () => {
      const response = await request(app)
        .put(`/api/smart-prompts/${testPromptId}`)
        .send({ title: 'Unauthorized Update' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/smart-prompts/:id/rate', () => {
    it('should add rating when authenticated', async () => {
      const response = await request(app)
        .post(`/api/smart-prompts/${testPromptId}/rate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ rating: 5 });

      expect(response.status).toBe(200);
      expect(response.body.ratings).toBeDefined();
    });

    it('should reject invalid rating values', async () => {
      const response = await request(app)
        .post(`/api/smart-prompts/${testPromptId}/rate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ rating: 6 });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/smart-prompts/:id', () => {
    it('should delete a prompt when authenticated as creator', async () => {
      const response = await request(app)
        .delete(`/api/smart-prompts/${testPromptId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      
      // Verify prompt is deleted
      const checkPrompt = await SmartPrompt.findById(testPromptId);
      expect(checkPrompt).toBeNull();
    });

    it('should reject deletion without authentication', async () => {
      const response = await request(app)
        .delete(`/api/smart-prompts/${testPromptId}`);

      expect(response.status).toBe(401);
    });
  });
});
