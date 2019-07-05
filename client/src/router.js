import Vue from 'vue'
import Router from 'vue-router'
import AnagramComponents from './components/AnagramComponent'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'anagram',
      component: AnagramComponents
    },
  ]
})
