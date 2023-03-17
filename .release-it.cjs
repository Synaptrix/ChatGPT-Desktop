module.exports = {
  git: {
    commitMessage: 'v${version}',
    tagName: 'v${version}'
  },
  github: {
    release: false,
    releaseName: 'v${version}'
  },
  npm: {
    publish: false
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'angular',
      infile: 'CHANGELOG.md',
      ignoreRecommendedBump: true
    }
  }
}
