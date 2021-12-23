module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer:{
    proxy: {
      '/api/googleapis': {
        target: 'https://www.googleapis.com',
        changeOrigin: true,
        pathRewrite: { '/api/googleapis': '' },
        logLevel: 'debug',
        secure: true,
      },

      '/api/accounts': {
        target: 'https://accounts.google.com',
      },
    }
  }
}
