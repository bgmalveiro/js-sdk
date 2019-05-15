import jwt from 'jsonwebtoken';
import { AuthenticationClient } from 'src/AuthenticationClient';
import { Authorization } from 'src/contracts';
import { RequestMock } from './RequestMock';
import { Configuration } from './Configuration';
import { DecodedToken, Token } from 'src/Token';

describe('AuthenticationClient', () => {
    jest.mock('jsonwebtoken')
    describe('sign', () => {
        it('should return a jwt signed when apikey is valid', async () => {
            const expectedResponse = {
                authorizationToken: '<ACCESS_TOKEN>',
                refreshToken: '<REFRESH_TOKEN>',
                expires: 3600
            }

            const nock = RequestMock.successSign(expectedResponse)

            const authenticationClient = new AuthenticationClient({
                baseURI: Configuration.url,
                publicKey: Configuration.publicKey
            })

            const token: Authorization = await authenticationClient.sign('apikey')

            expect(token).toEqual(expectedResponse)
            nock.done()
        })


        it('should return a jwt signed when refresh token is valid', async () => {
            const expectedResponse = {
                authorizationToken: '<ACCESS_TOKEN>',
                refreshToken: '<REFRESH_TOKEN>',
                expires: 3600
            }

            const nock = RequestMock.successRefresh(expectedResponse)

            const authenticationClient = new AuthenticationClient({
                baseURI: Configuration.url,
                publicKey: Configuration.publicKey
            })

            const token: Authorization = await authenticationClient.refresh('refreshToken')

            expect(token).toEqual(expectedResponse)
            nock.done()
        })

        it('should return a jwt signed with payload when apikey is valid', async () => {
            const expectedResponse = {
                authorizationToken: '<ACCESS_TOKEN>',
                refreshToken: '<REFRESH_TOKEN>',
                expires: 3600
            }

            const customPayload = { test: "test" }
            const nock = RequestMock.successSign(expectedResponse, customPayload)

            const authenticationClient = new AuthenticationClient({
                baseURI: Configuration.url
            })

            const token: Authorization = await authenticationClient.sign('apikey', customPayload)

            expect(token).toEqual(expectedResponse)
            nock.done()
        })

        it('should return a jwt signed with payload from handler when apikey is valid', async () => {
            const expectedResponse = {
                authorizationToken: '<ACCESS_TOKEN>',
                refreshToken: '<REFRESH_TOKEN>',
                expires: 3600
            }

            const handlerPayload = { "t": 1 }
            const handler = {
                execute: jest.fn((payload: object) => Promise.resolve({ ...handlerPayload, ...payload }))
            }

            const customPayload = { test: "test" }
            const nock = RequestMock.successSign(expectedResponse, { ...handlerPayload, ...customPayload })

            const authenticationClient = new AuthenticationClient({
                baseURI: Configuration.url
            }).withHandler(handler)

            const token: Authorization = await authenticationClient.sign('apikey', customPayload)

            expect(handler.execute).toBeCalledWith(customPayload)
            expect(token).toEqual(expectedResponse)
            nock.done()
        })

        it('should throw an error when apikey is invalid', async () => {
            const nock = RequestMock.unsuccessSign(Configuration.url)

            const authenticationClient = new AuthenticationClient()
            await expect(authenticationClient.sign('apikey')).rejects.toThrowError('Unauthorized API Key')
            nock.done()
        })

        it('should throw an error no reply from mapify', async () => {
            const nock = RequestMock.errorSign(Configuration.url)

            const authenticationClient = new AuthenticationClient()

            await expect(authenticationClient.sign('apikey')).rejects.toThrowError()
            nock.done()
        })
    })

    describe('verify', () => {
        it('valid jwt', () => {
            (jwt.verify as jest.Mock).mockImplementationOnce(() => true)

            const authenticationClient = new AuthenticationClient({
                baseURI: Configuration.url,
                publicKey: Configuration.publicKey
            })

            expect(authenticationClient.verify('token')).toBeTruthy()
        })

        it('with no public key', () => {
            const authenticationClient = new AuthenticationClient()
            expect(() => authenticationClient.verify('token')).toThrowError()
        })

        it('expired jwt', () => {
            (jwt.verify as jest.Mock).mockImplementationOnce(() => { throw new jwt.TokenExpiredError('Expired JWT', new Date()) })
            expect(() =>  AuthenticationClient.verify('token', Configuration.publicKey)).toThrowError()
        })

        it('invalid jwt', () => {
            (jwt.verify as jest.Mock).mockImplementationOnce(() => { throw new Error('Invalid JWT') })

            const authenticationClient = new AuthenticationClient({
                baseURI: Configuration.url,
                publicKey: Configuration.publicKey
            })

            expect(() => authenticationClient.verify('token')).toThrowError()
        })
    })

    describe('decode', () => {
        it('valid jwt', () => {
            (jwt.decode as jest.Mock).mockImplementationOnce(() => ({
                payload: {
                    email: 'email'
                }
            }))

            const expectedToken = {
                payload: {
                    email: 'email'
                }
            }

            const authenticationClient = new AuthenticationClient({
                baseURI: Configuration.url,
                publicKey: Configuration.publicKey
            })

            expect(authenticationClient.decode('token')).toEqual(expectedToken)
        })

        it('invalid jwt', () => {
            (jwt.decode as jest.Mock).mockImplementationOnce(() => { throw new Error('Invalid JWT') })

            const authenticationClient = new AuthenticationClient({
                baseURI: Configuration.url,
                publicKey: Configuration.publicKey
            })

            expect(authenticationClient.decode.bind(authenticationClient)).toThrowError()
        })
    })

    describe('token', () => {
        const token = new Token({
            apis: [{
                name: "api",
                claims: [{
                    name: "claim"
                }]
            },
            {
                name: "api_test",
                claims: [{
                    name: "claim2_test"
                }]
            }]
        } as DecodedToken)

        it('get claims', () => {
            expect(token.getClaimsByApi('api')).toEqual([{
                name: "claim"
            }])
            expect(token.getClaimsByApi('api_test')).toEqual([{
                name: "claim2_test"
            }])
        })
    })

    describe('health', () => {
        it('is healthy', async () => {
            const nock = RequestMock.healthy()

            const authenticationClient = new AuthenticationClient({
                baseURI: Configuration.url
            })

            expect(await authenticationClient.health()).toBeTruthy()
            nock.done()
        })

        it('is not healthy', async () => {
            const nock = RequestMock.unhealthy()

            const authenticationClient = new AuthenticationClient({
                baseURI: Configuration.url
            })

            expect(await authenticationClient.health()).toBeFalsy()
            nock.done()
        })
    })
})
