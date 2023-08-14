
export default {
  // mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'MECS Business App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'SolidGold business web application.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  env: {
    apiUrl: process.env.API_URL,
    serverIP: process.env.HOST,
    serverPort: process.env.PORT,
    mode: process.env.MODE,
    singleBranchPurchase: process.env.SINGLE_BRANCH_PURCHASE,
    purchasingBranchName: process.env.PURCHASING_BRANCH_NAME,
    purchasingBranchCode: process.env.PURCHASING_BRANCH_CODE
  },

  publicRuntimeConfig: {
    pmsServiceUrl: process.env.PMS_SERVICE_URL
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/app.scss',
    //main aplication css
    '@/assets/css/styles.css',
    //tailwind
    '@/assets/css/tailwind.css',

    '@/assets/css/print.css',

    'simplebar/dist/simplebar.min.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/check-directive.client.js',
    '@/plugins/notifications.js',
    '@/plugins/helpers.js',
    '@/plugins/axios',
    { src: '@/plugins/virtual-list.js', ssr: false },
    { src: '@/plugins/vue-apexchart.js', ssr: false },
    { src: '@/plugins/vue-select.js', ssr: false },
    { ssr: true, src: '@/plugins/icons.js' },
    "@/plugins/vee-validate",
    '@/plugins/vue-modal.js',
    { src: '@/plugins/vue-cool-lightbox.js', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    // 'nuxt-buefy',
    ['nuxt-buefy', {
      defaultIconPack: 'mdi',
      materialDesignIcons: false,
      defaultProgrammaticPromise: true
    }],

    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'cookie-universal-nuxt',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.apiUrl,
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },

  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },

  router: {
    middleware: ['auth', 'permchecker']
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/login', method: 'post', propertyName: 'token' },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/auth/me', method: 'post', propertyName: false }
        },
        // tokenRequired: true,
        // tokenType: 'bearer',
        // globalToken: true,
        autoFetchUser: false
      }
    },

    // redirect: false
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      callback: '/auth/login',
      home: '/'
    }
  }
}
