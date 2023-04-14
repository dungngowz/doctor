/**
 * @type {import('next').NextConfig}
 */
const path = require('path')
const intercept = require('intercept-stdout')

// safely ignore recoil warning messages in dev (triggered by HMR)
function interceptStdout(text) {
  if (text.includes('Duplicate atom key')) {
    return ''
  }
  return text
}

if (process.env.NODE_ENV === 'development') {
  intercept(interceptStdout)
}

const nextConfig = {
  eslint: {
    dirs: ['pages', 'utils', 'layout', 'hooks', 'app-redux', 'types'],
  },
  devIndicators: {
    buildActivity: false,
  },
  images: {
    domains: [process.env.API_URL, 'api-sictradingco.ng-app.store'],
    unoptimized: true,
  },
  swcMinify: true,
  reactStrictMode: false,
  env: {
    CURRENT_ENV: process.env.CURRENT_ENV,
    API_URL: process.env.API_URL,
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
    PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,
    PUSHER_APP_AUTH_URL: process.env.PUSHER_APP_AUTH_URL,
  },
  compiler: {
    removeConsole: {
      exclude: ['log'],
    },
  },

  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "abstracts/mixins.scss";`,
  },
  trailingSlash: true,
}

module.exports = nextConfig
