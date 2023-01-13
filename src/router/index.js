import Vue from 'vue'
import VueRouter from 'vue-router'
import AllResturant from '../views/AllResturant.vue'
import UserProfile from '../views/UserProfile.vue'
import LoginView from '../views/LoginView.vue'
import ErorView from '../views/ErorView.vue'
import UpdateLocation from '../views/UpdateLocation.vue'
import ResturatCatygory from '../views/ResturatCatygory.vue'
import UpdateCatygory from '../views/UpdateCatygory.vue'
import ItemsCategory from '../views/ItemsCategory.vue'
import UpdateItem from '../views/UpdateItem.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Resturants',
    component: AllResturant
  },
  {
    path: '/profile',
    name: 'Profile Page',
    component: UserProfile
  },

  {
    path: '/login',
    name: 'Login Page',
    component: LoginView
  },
  {
    path: '/updateLocation/:LocationId',
    name: 'Update-Location',
    component: UpdateLocation
  },

  {
    path: '/ResturatCatygory/:locationID',
    name: 'Resturant-Category',
    component: ResturatCatygory
  },
  {
    path: '/UpdateCatygory/:locationId/:categoryId',
    name: 'UpdateCatygory',
    component: UpdateCatygory
  },
  {
    path: '/ItemsCategory/:locationId/:categoryId',
    name: 'ItemsCategory',
    component: ItemsCategory
  },
  {
    path: '/UpdateItem/:locationId/:categoryId/:itemId',
    name: 'UpdateItem',
    component: UpdateItem
  },
  {
    path: '/:catchAll(.*)',
    name: 'Error Page',
    component: ErorView
  },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  document.title = to.name
  next()
})

export default router
