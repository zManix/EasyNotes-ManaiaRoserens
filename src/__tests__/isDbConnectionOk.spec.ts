import { db } from '../lib/db';

describe('DB Tests', () => {
  test('Is DB Connection OK?', async () => {
    const mockError = jest.spyOn(console, 'error').mockImplementation(() => {});

    try {
      const connection = await db.connectDB('127.0.0.1', '3307', 'easynotes', 'easynotes', 'easynotes');

      connection.end();

      expect(mockError).not.toBeCalled();
    } catch (error) {
      throw error;
    } finally {
      mockError.mockRestore();
    }
  });
});
