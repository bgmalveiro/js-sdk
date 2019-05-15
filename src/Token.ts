import { API, Claim } from './contracts';

export interface DecodedToken<T = undefined> {
    apis?: Array<API>
    payload?: T
}

export class Token<T = undefined> {
    constructor(private readonly decodedToken: DecodedToken<T>) { }

    public getClaimsByApi(apiName: string): Array<Claim> {
        const selectedAPI = this.decodedToken.apis && this.decodedToken.apis.find(api => api.name.toLowerCase() === apiName.toLowerCase())
        return selectedAPI && selectedAPI.claims
    }
}
