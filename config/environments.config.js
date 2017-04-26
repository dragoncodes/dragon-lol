// Here is where you can define configuration overrides based on the execution environment.
// Supply a key to the default export matching the NODE_ENV that you wish to target, and
// the base configuration will apply your overrides before exporting itself.

var basePublicPath = 'reactive-league'

module.exports = {
    // ======================================================
    // Overrides when NODE_ENV === 'development'
    // ======================================================
    // NOTE: In development, we use an explicit public path when the assets
    // are served webpack by to fix this issue:
    // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
    development: (config) => ({
        api_url: 'http://localhost:3001/riot-api',
        base_public_path: ``,
        compiler_public_path: `http://${config.server_host}:${config.server_port}/`
    }),

    // ======================================================
    // Overrides when NODE_ENV === 'production'
    // ======================================================
    production: (config) => ({
        api_url: 'http://ec2-54-93-105-54.eu-central-1.compute.amazonaws.com/riot-api',
        base_public_path: `${basePublicPath}`,
        compiler_public_path: `/${basePublicPath}/`,
        compiler_fail_on_warning: false,
        compiler_hash_type: 'chunkhash',
        compiler_devtool: null,
        compiler_stats: {
            chunks: true,
            chunkModules: true,
            colors: true
        }
    })
}
