import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, CancelTokenSource } from 'axios';
import { getUnixTime } from 'date-fns';

interface HttpClientOptions {
  excludedUrls?: string[];
  global: AxiosRequestConfig;
}

interface AuthState {
  token: string;
  expire: number;
  isAuthenticated: boolean;
}

interface AuthModule {
  getAuthToken: () => Promise<void>;
  authState: AuthState;
}

export const httpClientCancelTokens = new Map<string, CancelTokenSource>();

let axiosInstance: AxiosInstance;

export const useHttpClient = (options?: HttpClientOptions, authModule?: AuthModule): AxiosInstance => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      ...options?.global,
    });
  }

  // If an AuthModule is provided we can add token to the request headers
  // and also handle token expiration
  if (authModule) {
    axiosInstance.interceptors.request.use(request => {
      if (authModule.authState?.token) {
        // @ts-ignore
        request.headers.common.Authorization = `Bearer ${authModule.authState.token}`;
      } else {
        // @ts-ignore
        delete request.headers.common.Authorization;
      }

      // Add cancelToken to request and register it
      const source = axios.CancelToken.source();
      if (request.url) {
        httpClientCancelTokens.set(request.url, source);
      }

      return {
        ...request,
        cancelToken: source.token,
      };
    });

    axiosInstance.interceptors.response.use(
      (response) => {
        if (response?.config?.url) {
          httpClientCancelTokens.delete(response.config.url);
        }
        return response;
      },
      async responseError => {
        const { response, config: request } = responseError;

        if (request?.url) {
          httpClientCancelTokens.delete(request.url);
        }
        // Apply only if is an unauthorized error (token expired)
        if (response?.status === 401) {
          const nowDateUnix = getUnixTime(new Date());
          const isTokenExpired = authModule.authState.expire && nowDateUnix > authModule.authState.expire;
          if (
            isTokenExpired
            && !options?.excludedUrls?.includes(request.url)
          ) {
            authModule.authState.isAuthenticated = false;
            await authModule.getAuthToken();
            request.headers.Authorization = `Bearer ${authModule.authState.token}`;

            return axiosInstance.request(request);
          }
        }

        throw responseError;
      },
    );
  }

  return axiosInstance;
};
