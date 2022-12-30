<template>
  <div class="Wall">
    <!-- tab项目进行切换。 -->
    <van-tabs background="transparent" color="#2b5aed" @click="toChangeTab">
      <van-tab v-for="item in label[0]" :key="item" :title="item">
        <!-- 留言卡片数据。-->
        <div class="msg">
          <p>留言墙</p>
          <div>很多事情值得记录，当然也值得回味。</div>
        </div>
        <!-- 绘制一个卡片。 -->
        <div class="card">
          <!-- 卡片头部分 -->
          <div class="card-title">
            <span>2022/08/23 17:00</span>
            <span>留言</span>
          </div>
          <!-- 卡片信息。 -->
          <div class="card-message">
            <p>是一段暖心的话， 这是一段暖心的话 大萨达撒 大萨达</p>
          </div>
          <!-- 卡片尾部。 -->
          <div class="card-footer">
            <div class="like">
              <span><i class="iconfont icon-aixin1 isLike"></i>&nbsp;&nbsp;9</span>
              <span><i class="iconfont icon-liuyan"></i>&nbsp;&nbsp;1</span>
            </div>
            <span>我是宋大人</span>
          </div>
        </div>
        <div class="card">
          <!-- 卡片头部分 -->
          <div class="card-title">
            <span>2022/08/23 17:00</span>
            <span>留言</span>
          </div>
          <!-- 卡片信息。 -->
          <div class="card-message">
            <p>是一段暖心的话， 这是一段暖心的话 大萨达撒 大萨达</p>
          </div>
          <!-- 卡片尾部。 -->
          <div class="card-footer">
            <div class="like">
              <span><i class="iconfont icon-aixin1 isLike"></i>&nbsp;&nbsp;9</span>
              <span><i class="iconfont icon-liuyan"></i>&nbsp;&nbsp;1</span>
            </div>
            <span>我是宋大人</span>
          </div>
        </div>
        <div class="card">
          <!-- 卡片头部分 -->
          <div class="card-title">
            <span>2022/08/23 17:00</span>
            <span>留言</span>
          </div>
          <!-- 卡片信息。 -->
          <div class="card-message">
            <p>是一段暖心的话， 这是一段暖心的话 大萨达撒 大萨达</p>
          </div>
          <!-- 卡片尾部。 -->
          <div class="card-footer">
            <div class="like">
              <span><i class="iconfont icon-aixin1 isLike"></i>&nbsp;&nbsp;9</span>
              <span><i class="iconfont icon-liuyan"></i>&nbsp;&nbsp;1</span>
            </div>
            <span>我是宋大人</span>
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <!-- 右下角的添加留言按钮。 -->
    <div class="addbtn" @click="addWall">
      <i class="iconfont icon-tianjia"></i>
    </div>
    <!-- 弹出层 -->
    <van-popup v-model="isShow" position="right" :style="{ height: '100%', width: '100%' }" closeable close-icon-position="top-right">
      <div class="popup">
        <!-- 在弹出层里面新建留言。 -->
        <div class="title">写留言</div>
        <!-- 颜色选择列表。 -->
        <div class="color-list">
          <div class="color-item" v-for="(item, index) in cardListColor" :style="{ background: item }" :key="item" @click="selectColor(index)" :class="isColor == index ? 'isColorSelect' : ''"></div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { label, cardListColor } from "@/utils/data";
export default {
  name: "Wall",
  data() {
    return {
      label, //当前的标签
      cardListColor, //新建卡片选择颜色列表。
      isShow: true, //添加留言的弹出层是否显示
      isColor: 0, //当前选中的颜色值列表的索引。
    };
  },
  methods: {
    // 切换tab栏的方法。
    toChangeTab(name, title) {
      console.log(name, title); //1 '留言'
    },
    // 打开弹出层
    addWall() {
      this.isShow = true;
    },
    // 选择颜色值。
    selectColor(index) {
      this.isColor = index;
    },
  },
};
</script>

<style lang="less" scoped>
.Wall {
  /deep/.van-popup__close-icon {
    color: #5b5b5b;
  }
  .isLike {
    color: #f67770;
  }
  .isColorSelect {
    border: 0.02rem solid rgba(59, 115, 240, 1) !important;
  }
  .msg {
    padding: 0 0.3rem;
    p {
      font-family: PingFangSC-Semibold;
      font-size: 0.64rem;
      color: #202020;
      font-weight: 600;
      margin-bottom: 0.16rem;
      margin-top: 0.4rem;
    }
    div {
      font-family: PingFangSC-Regular;
      font-size: 0.28rem;
      color: #7e7e7e;
      font-weight: 400;
      margin-bottom: 0.4rem;
    }
  }
  .card {
    width: 7rem;
    height: 4.8rem;
    background: rgba(146, 230, 245, 0.3);
    font-family: xp;
    margin: 0 auto 0.24rem;
    padding: 0.2rem 0.4rem;
    .card-title {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #949494;
    }
    .card-message {
      height: 2.8rem;
      margin-top: 0.38rem;
      font-size: 0.32rem;
      color: #202020;
      letter-spacing: 0;
      margin-bottom: 0.36rem;
      overflow-y: scroll;
      white-space: pre-wrap;
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      .like {
        span {
          margin-right: 0.2rem;
          color: #7e7e7e;
        }
      }
    }
  }
  // 添加按钮。
  .addbtn {
    width: 1.12rem;
    height: 1.12rem;
    background: #202020;
    box-shadow: 0px 0.08rem 0.16rem 0px rgba(0, 0, 0, 0.08);
    border-radius: 0.56rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    right: 0.6rem;
    bottom: 0.6rem;
    i {
      color: #fff;
      font-size: 0.48rem;
    }
  }
  .popup {
    padding: 0 0.4rem;

    .title {
      margin-top: 0.3rem;
      font-size: 0.32rem;
      color: #202020;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }
    // 颜色列表。
    .color-list {
      display: flex;
      .color-item {
        width: 0.48rem;
        height: 0.48rem;
        background: #fcafa2;
        margin-right: 0.16rem;
        border: 0.02rem solid transparent;
      }
    }
  }
}
</style>
