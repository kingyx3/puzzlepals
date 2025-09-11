// Basic test to verify the project setup is working
describe('Project Setup', () => {
  it('should have a working test environment', () => {
    expect(true).toBe(true);
  });

  it('should support basic TypeScript', () => {
    const greeting: string = 'Hello PuzzlePals!';
    expect(greeting).toBe('Hello PuzzlePals!');
  });
});
