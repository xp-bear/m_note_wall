<template>
  <div id="App">
    <!-- 路由占位符  -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },

  methods: {
    toWall() {
      console.log(11);
    },
    toPhoto() {
      console.log(22);
    },
  },
};
</script>
<style lang="less">
@import url("./assets/fonts/icon/iconfont.css"); //引入全局字体图标
@font-face {
  font-family: xp;
  // src: url("@/assets/fonts/two.ttf");
  src: url("http://cdn.xxoutman.cn/two.ttf");
}
#App {
  position: relative;
  width: 7.5rem;
  margin: 0 auto;
  font-size: 0.32rem;
}
</style>
