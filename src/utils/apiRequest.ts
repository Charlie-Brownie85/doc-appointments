import type { AxiosPromise } from 'axios';
// import qs from 'qs';

import { apiURL } from '@/config';

import { useHttpClient } from '@/composables/useHttpClient';

export type ApiRequestOptions = {
  requestMethod?: 'put' | 'post' | 'get' | 'patch' | 'delete';
  params?: any;
  data?: any;
};

const httpClient = useHttpClient();

export default function apiRequest<T>(
  url: string,
  requestOptions?: ApiRequestOptions,
  whichApi = 'base',
): AxiosPromise<T> {
  const {
    requestMethod = 'get', params, data,
  } = requestOptions || {};
  return httpClient.request({
    url,
    method: requestMethod,
    baseURL: apiURL[whichApi as keyof typeof apiURL],
    data,
    params,
  });
}
