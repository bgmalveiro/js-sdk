interface JWTMock {
    verify: () => {}
    decode: (token: string) => any
}
const mock = jest.genMockFromModule<JWTMock>('jsonwebtoken')

mock.verify = jest.fn()
mock.decode = jest.fn(() => ({
    payload: {
        email: 'email',
        id: 'id',
        name: 'name',
        profilePhotoUrl: 'photo',
        username: 'username',
        roles: { 'ADMINISTRATOR': '0' }
    }
}))

export default mock
