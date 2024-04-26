import getApiRoute from './getApiRoute';

describe('getApiRoute', () => {
  test('"getApiRoute" should return the correct API route', () => {
    const apiUrl = 'https://api.example.com/:user/posts/:postId';
    const params = {
      user: 'carlos',
      postId: 'post123',
    };

    const expectedRoute = 'https://api.example.com/carlos/posts/post123';
    const actualRoute = getApiRoute(apiUrl, params);

    expect(actualRoute).toBe(expectedRoute);
  });
});
