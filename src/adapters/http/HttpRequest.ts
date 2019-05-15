import axios, { AxiosResponse } from 'axios';
import { HttpMethods } from './HttpMethods';
import { HttpRequestError } from './HttpRequestError';
import { HttpResponse } from './HttpResponse';
import { Link } from './Link';

export class HttpRequest {

    public static maxRedirects = 5;

    private static async Get<T>(link: Link, maxRedirects?: number): Promise<HttpResponse<T>> {
        return axios.get(link.href, { headers: link.headers, maxRedirects: maxRedirects })
            .then((result: AxiosResponse) => {
                return {
                    code: result.status,
                    data: result.data as T,
                    headers: result.headers
                }
            });
    }

    private static Post<T>(link: Link, data: any): Promise<HttpResponse<T>> {
        return axios.post(link.href, data, { headers: link.headers })
            .then((result: AxiosResponse) => {
                return {
                    code: result.status,
                    data: result.data as T,
                    headers: result.headers
                }
            });
    }

    public static async fetch<T>(link: Link, data?: any): Promise<HttpResponse<T>> {
        try {
            switch (link.method) {
                case HttpMethods.GET: return await HttpRequest.Get<T>(link, HttpRequest.maxRedirects);
                case HttpMethods.POST: return await HttpRequest.Post<T>(link, data);
                default: throw new Error(`Request method not supported: ${link.method}`);
            }
        } catch (error) {
            if (error.response) {
                throw new HttpRequestError(error.response.status, error.response.data)
            }

            throw error
        }
    }
}
