const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463
   */
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  /*
  pages: {
    index: {
      entry: 'src/main.js',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  */
  configureWebpack: {},

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          /*
          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
          */
        },
        javascriptEnabled: true,
      }
    }
  },

  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        // target: 'http://172.16.24.250:9999',//光武后台地址
        //  target: 'http://172.16.24.220:9999',//老房后台地
        //  target: 'http://172.16.24.96:9999',//雨辰后台地址
        //  target: 'http://127.0.0.1:9999',//本地打包地址
        target: 'https://qas-hrms.worfu.com/', // 人力云测试环境   8.17更改
        // target: 'http://192.168.1.115:8999/', // 才麟
        // target: 'http://36.7.147.30:9999/', // 科恩生产环境
        // target: 'http://hrms.worfu.com:9999/', // 人力云生产环境
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  lintOnSave: undefined
}