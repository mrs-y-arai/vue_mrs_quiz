import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import Carousel3d from 'vue-carousel-3d'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  Carousel3d,
  render: h => h(App)
}).$mount('#app')

Vue.config.errorHandler = function (error) {
  if (error.message === 'NavigationDuplicated') {
    return
  }
}
