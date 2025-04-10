module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  output: 'export'
}

/*module.exports = {
  turbo(config) {
    config.module.rules.push({
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    })
    return config
  },
  output: 'export'
}*/

  