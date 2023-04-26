import DefaultTheme from 'vitepress/theme'
// import PrimeVue from 'primevue/config'
// import DemoContainer from '../components/DemoContainer.vue'
import VueContextualTransition from 'vue-contextual-transition'

// import 'primevue/resources/themes/saga-blue/theme.css'       //theme
// import 'primevue/resources/primevue.min.css'                 //core css
// import 'primeicons/primeicons.css'
// import 'primeflex/primeflex.css'

import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(VueContextualTransition)
    // app.component('DemoContainer', DemoContainer)
  }
}

// nrl you are here
// 5:09:45 PM [vitepress] Internal server error: EISDIR: illegal operation on a
// directory, read
// 