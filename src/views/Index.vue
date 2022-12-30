<template>
  <div class="Index">
    <!-- 遮罩背景。 -->
    <!-- <video src="@/assets/bg.mp4" class="mark"></video> -->
    <!-- 顶部tabbar栏 -->
    <div class="topbar">
      <div class="title1" @click="changeWall(0)"><router-link to="/wall">留言墙</router-link><span :class="isActive == 0 ? 'active' : ''"></span></div>
      <div class="title2" @click="changePhoto(1)"><router-link to="/photo">照片墙</router-link><span :class="isActive == 1 ? 'active' : ''"></span></div>
    </div>
    <!-- 路由占位服务。 -->
    <router-view></router-view>

    <!-- 脚部信息展示。 -->
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      isActive: 0, //初始状态是留言墙。
    };
  },
  methods: {
    changeWall(value) {
      this.isActive = value;
    },
    changePhoto(value) {
      this.isActive = value;
    },
  },
};
</script>

<style lang="less" scoped>
.Index {
  // 切换照片墙与留言墙的class。
  .active {
    background: #2b5aed;
  }
  //   视频遮罩层。
  .mark {
    position: fixed;
    height: 100vh;
    z-index: -999;
  }
  .topbar {
    width: 7.5rem;
    height: 0.88rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .title1,
    .title2 {
      font-family: PingFangSC-Semibold;
      font-size: 0.34rem;
      font-weight: 600;
      margin: 0 0.3rem 0.06rem; //15px  1rem == 75px
      display: flex;
      flex-direction: column;
      align-items: center;
      a {
        color: #202020;
        font-weight: 600;
      }
      span {
        width: 0.4rem;
        height: 0.08rem;
        border-radius: 2px;
        margin-top: 0.06rem;
      }
    }
  }
}
</style>
