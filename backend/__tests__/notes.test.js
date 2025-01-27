const request = require('supertest');
const { app, pool } = require('../index');

describe('Notes API', () => {
  let createdNoteId;

  afterAll(async () => {
    if (pool) {
      try {
        await pool.end();
        console.log('PostgreSQL pool closed.');
      } catch (error) {
        console.error('Error closing PostgreSQL pool:', error);
      }
    }
  });

  it('should fetch all notes', async () => {
    const res = await request(app).get('/notes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should create a new note', async () => {
    const newNote = { title: 'Test Note', content: 'Testing content', status: true };
    const res = await request(app).post('/notes').send(newNote);
    createdNoteId = res.body.id;
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(newNote.title);
  });

  it('should update a note', async () => {
    const updatedNote = { title: 'Updated Note', content: 'Updated content', status: false };
    const res = await request(app).put(`/notes/${createdNoteId}`).send(updatedNote);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updatedNote.title);
  });

  it('should delete a note', async () => {
    const res = await request(app).delete(`/notes/${createdNoteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });
});

