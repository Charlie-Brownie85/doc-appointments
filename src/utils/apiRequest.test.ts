import apiRequest from './apiRequest';
import type { ApiRequestOptions } from './apiRequest';

import { apiURL } from '@/config';

const mocks = vi.hoisted(() => ({
  mockedHttpClient: {
    request: vi.fn(),
  },
}));

vi.mock('@/composables/useHttpClient', () => ({
  useHttpClient: vi.fn().mockReturnValue(mocks.mockedHttpClient),
}));

describe('apiRequest', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should make a GET request with the correct URL and options', () => {
    const url = '/example';
    const requestOptions: ApiRequestOptions = {
      requestMethod: 'get',
      params: { id: 1 },
    };

    apiRequest(url, requestOptions);

    expect(mocks.mockedHttpClient.request).toHaveBeenCalledWith({
      url,
      method: requestOptions.requestMethod,
      baseURL: apiURL.base,
      params: { id: 1 },
      data: undefined,
    });
  });

  it('should make a POST request with the correct URL and options', () => {
    const url = '/example';
    const requestOptions: ApiRequestOptions = {
      requestMethod: 'post',
      data: { id: 1 },
    };

    apiRequest(url, requestOptions);

    expect(mocks.mockedHttpClient.request).toHaveBeenCalledWith({
      url,
      method: requestOptions.requestMethod,
      baseURL: apiURL.base,
      data: { id: 1 },
      params: undefined,
    });
  });

  it('should make a GET request with the proper parameters when no other config is passed', () => {
    const url = '/example';

    apiRequest(url);

    expect(mocks.mockedHttpClient.request).toHaveBeenCalledWith({
      url,
      method: 'get',
      baseURL: apiURL.base,
      params: undefined,
      data: undefined,
    });
  });
});
