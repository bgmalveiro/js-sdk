
export type Configuration = typeof Configuration
export const Configuration = {
    url: process.env['TEST_MAPIFY_URL'] || 'https://authentication.api.mapify.ai',
    publicKey: process.env['TEST_MAPIFY_PUBLIC_KEY'] || __dirname + '/keys',
}