import jwt from 'jsonwebtoken';
import { AuthenticationOptions } from './AuthenticationOptions';
import { Authorization, Credentials, AuthorizationType } from './contracts';
import { DecodedToken } from './Token';
import { Handler } from './Handler';
import { HttpRequest } from './adapters/http/HttpRequest';
import { HttpMethods } from './adapters/http/HttpMethods';

export class InvalidPublicKey extends Error { }
export const InvalidToken = jwt.JsonWebTokenError
export const TokenExpiredError = jwt.TokenExpiredError

const defaultOptions: AuthenticationOptions = {
    baseURI: 'https://authentication.api.mapify.ai'
}

export class AuthenticationClient {
    private handlers: Array<Handler> = []
    private options: AuthenticationOptions

    constructor(options?: AuthenticationOptions) {
        this.options = { ...defaultOptions, ...options }
    }

    public static verify = (token: string, key: string | Buffer) => !!jwt.verify(token, key)

    public withHandler = (handler: Handler) => (this.handlers.push(handler), this)

    public async sign<T>(apiKey: string, customPayload?: T) {
        for (const handler of this.handlers) {
            customPayload = await handler.execute(customPayload) || customPayload
        }

        return this.requestSign({
            token: apiKey,
            type: AuthorizationType.API_KEY,
            customPayload
        } as Credentials<T>)
    }

    public refresh = async <T>(token: string)  => (await this.requestSign({
            token: token,
            type: AuthorizationType.REFRESH,
    } as Credentials<T>))

    private requestSign = async <T>(credentials: Credentials<T>) => (await HttpRequest.fetch<Authorization>({ href: `${this.options.baseURI}/sign`, method: HttpMethods.POST }, credentials)).data

    public verify(token: string) {
        if (!this.options.publicKey) {
            throw new InvalidPublicKey(`No Public Key available`)
        }

        return AuthenticationClient.verify(token, this.options.publicKey)
    }

    public decode = <T>(token: string) => jwt.decode(token) as DecodedToken<T>

    public health = async () => !!(await HttpRequest.fetch({ href: `${this.options.baseURI}/health`, method: HttpMethods.GET }).catch((_) => (false)))
}
