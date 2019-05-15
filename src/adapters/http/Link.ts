import { HttpMethods } from './HttpMethods';

export interface Link {
    href: string
    name?: string
    method?: HttpMethods
    headers?: {[key: string]: string}
    templated?: boolean
}
