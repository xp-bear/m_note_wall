import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userIp: "", //登录用户的IP地址。
  },
  getters: {},
  mutations: {
    getIp: (state, value) => {
      //保存获取用户IP地址的方法
      state.userIp = value;
    },
  },
  actions: {},
  modules: {},
});
