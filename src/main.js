import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import routers from "./router";
Vue.config.productionTip = false
Vue.use(VueRouter);
import "babel-polyfill";
const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: routers
});
new Vue({
  el: "#app",
  router,
  render: h => h(App)
}).$mount("#app");