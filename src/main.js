import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "vant/lib/index.css";

import Button from "vant/lib/button";
import { Tab, Tabs } from "vant";
import { Popup } from "vant";

Vue.use(Popup);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Button);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
