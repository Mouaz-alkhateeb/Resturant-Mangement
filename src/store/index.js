import router from '@/router'
import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedInUser: "",
    isLoggedInUserId: "",
    loggedInUserNumberCatygory: "",
    listOfCatygory: [],
    listOfLocations: [],
    listOfitems: []
  },
  getters: {
  },
  mutations: {
    redirectTo(state, payload) {
      router.push({ name: payload })
    },
    isLoggedInUserFun(state) {
      let user = localStorage.getItem("users")
      if (user) {
        state.isLoggedInUser = true
        state.isLoggedInUserId = JSON.parse(user).id
      } else {
        state.isLoggedInUser = false
      }
    },
    async allCategories(state, payload) {
      let result = await axios.get(`http://localhost:3000/categories?userId=${payload.userIds}&locationId=${payload.locationIds}`)
      if (result.status == 200) {
        state.listOfCatygory = result.data
        state.loggedInUserNumberCatygory = state.listOfCatygory.length
      }
    },
    async CanUserAccess(state, payload) {
      let result = await axios.get(`http://localhost:3000/locations?userId=${payload.userIds}&id=${payload.locationIds}`)
      if (result.status == 200) {
        state.listOfLocations = result.data
        if (state.listOfLocations.length !== 1) {
          this.commit('redirectTo', payload.redirectToPage)

        }
      }
    },
    async CanUserAccessToCategory(state, payload) {
      let result = await axios.get(`http://localhost:3000/categories?userId=${payload.userIds}&locationId=${payload.locationIds}&id=${payload.categoryIds}`)
      if (result.status == 200) {
        state.listOfCatygory = result.data
        if (state.listOfCatygory.length !== 1) {
          this.commit('redirectTo', payload.redirectToPage)

        }
      }
    },
    async CanUserAccessToItem(state, payload) {
      let result = await axios.get(`http://localhost:3000/items?userId=${payload.userIds}&locationId=${payload.locationIds}&id=${payload.itemIds}`)
      if (result.status == 200) {
        state.listOfitems = result.data
        if (state.listOfitems.length !== 1) {
          this.commit('redirectTo', payload.redirectToPage)

        }
      }
    },
  },
  actions: {
    redirectTo({ commit }, payload) {
      commit('redirectTo', payload.val)
    }
  },
  modules: {
  }
})
