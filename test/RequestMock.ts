
import nock from 'nock';
import { Authorization } from 'src/contracts';
import { Configuration } from 'test/Configuration';

const successSign = <T>(expectedResponse: Authorization, customPayload?: T) => (
     nock(Configuration.url)
        .post('/sign', {
            token: 'apikey',
            type: 'apikey',
            ...(customPayload && { customPayload })
        })
        .reply(200, expectedResponse)
)

const successRefresh = (expectedResponse: Authorization) => (
     nock(Configuration.url)
        .post('/sign', {
            token: 'refreshToken',
            type: 'refresh'
        })
        .reply(200, expectedResponse)
)

const unsuccessSign = (baseURL?: string) => (
    nock(baseURL || Configuration.url)
        .post('/sign')
        .reply(401, 'Unauthorized API Key')
)

const errorSign = (baseURL?: string) => (
    nock(baseURL || Configuration.url)
        .post('/sign')
        .replyWithError('something awful happened')
)

const healthy = () => (
    nock(Configuration.url)
        .get('/health')
        .reply(200)
)

const unhealthy = () => (
    nock(Configuration.url)
        .get('/health')
        .reply(500)
)

export const RequestMock = {
    successSign,
    unsuccessSign,
    successRefresh,
    errorSign,
    healthy,
    unhealthy
}
