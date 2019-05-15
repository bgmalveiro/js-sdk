export interface Authorization {
    authorizationToken: string
    refreshToken: string
    expires: number
}

export enum AuthorizationType {
    API_KEY = 'apikey',
    REFRESH = 'refresh'
}

export interface Claim {
    name: string;
}

export interface API {
    name: string;
    claims: Array<Claim>;
}

export interface Credentials<T> {
    token: string
    type: AuthorizationType
    customPayload?: T
}
