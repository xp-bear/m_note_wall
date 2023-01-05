<template>
  <div class="Wall">
    <!-- tab项目进行切换。 -->
    <van-tabs background="transparent" color="#2b5aed" @click="toChangeTab">
      <van-tab v-for="item in label[0]" :key="item" :title="item">
        <!-- 留言墙头部-->
        <div class="msg">
          <p>留言墙</p>
          <div>很多事情值得记录，当然也值得回味。</div>
        </div>
        <!-- 绘制一个卡片。 -->
        <div class="card" v-for="(item, index) in 5" :key="index" @click="toCardDetail">
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
    <!-- 新建卡片的弹出层 -->
    <van-popup v-model="isAddShow" position="right" :style="{ height: '100%', width: '100%' }" closeable close-icon-position="top-right">
      <div class="popup">
        <!-- 在弹出层里面新建留言。 -->
        <div class="title">写留言</div>
        <!-- 颜色选择列表。 -->
        <div class="color-list">
          <div class="color-item" v-for="(item, index) in cardListColor" :style="{ background: item }" :key="item" @click="selectColor(index)" :class="isColor == index ? 'isColorSelect' : ''"></div>
        </div>
        <!-- 新建卡片 -->
        <div class="newcard" :style="{ background: cardColor[isColor] }">
          <!-- 新建卡片信息。 -->
          <textarea class="textarea" placeholder="留言..."></textarea>
          <input type="text" class="signature" placeholder="签名..." />
        </div>

        <!-- 选择标签 -->
        <div class="select-label">选择标签</div>
        <div class="labels">
          <span v-for="(item, index) in label[0]" :key="item" @click="selectLabel(index)" :class="isLabelSelect == index ? 'isLabelSelect' : ''">{{ item }}</span>
        </div>
        <!-- 免责声明。 -->
        <div class="select-label liability">免责声明</div>
        <div class="responibility">
          <p>熊仔留言墙是本人独自开发的，为便于与用户交流的留言平台。请遵守如下内容：</p>
          <p>
            1、凡本网站转载的所有的文章、图片、音频视频文件等资料的版权归版权所有人所有，本站采用的非本站原创文章及图片等内容无法一一和版权者联系。<br />
            2、如果本网所选内容的文章作者及编辑认为其作品不宜上网供大家浏览，或不应无偿使用，请及时用电子邮件或电话通知我们，以迅速采取适当措施，避免给双方造成不必要的经济损失。
          </p>
        </div>

        <!-- 底部按钮 -->
        <div class="btn-bottom">
          <button class="discard" @click="giveUp">丢弃</button>
          <button class="confirm" @click="submit">确定</button>
        </div>
      </div>
    </van-popup>

    <!-- 点击卡片展示细节的弹出层 -->
    <van-popup v-model="isCardShow" position="right" :style="{ height: '100%', width: '100%' }" closeable close-icon="arrow-left" close-icon-position="top-left">
      <div class="card-detail">
        <div class="title">
          <span>联系墙主撕掉该便签</span>
          <span>举报</span>
        </div>
        <!-- 卡片细节 -->
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
        <!-- 评论。 -->
        <div class="comment">评论 666</div>
        <!-- 评论信息。 -->
        <div class="comment-detail" v-for="item in 5">
          <div class="avatar"><img src="http://cdn.xxoutman.cn/logo.jpg" alt="" style="width: 100%" /></div>
          <div class="info">
            <div class="msg-title">
              <div class="name">匿名</div>
              <span class="time">2022.08.24 14:32</span>
            </div>
            <p class="msg-comment">顾名思义,方便粘贴在书本墙上以及家中办公室等地方,上面可以记录一些备忘录文字,主要就是提示(警示鼓舞)作用,</p>
          </div>
        </div>

        <!-- 发表评论。 -->
        <div class="ipt-msg">
          <input type="text" placeholder="发表评论" />
          <i class="iconfont icon-fasong"></i>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { label, cardListColor, cardColor } from "@/utils/data";
export default {
  name: "Wall",
  data() {
    return {
      label, //当前的标签
      cardListColor, //新建卡片选择颜色列表。
      cardColor, //透明卡片颜色选择列表
      isAddShow: false, //添加留言的弹出层是否显示
      isColor: 0, //当前选中的颜色值列表的索引。
      isLabelSelect: 0, //选择标签的索引值
      isCardShow: false, //点击卡片的弹出层。
    };
  },
  mounted() {
    console.log(this.$route.path); // 路径地址: /wall
  },
  methods: {
    // 切换tab栏的方法。
    toChangeTab(name, title) {
      console.log(name, title); //1 '留言'
    },
    // 打开弹出层
    addWall() {
      this.isAddShow = true;
    },
    // 新建卡片选择颜色值。
    selectColor(index) {
      this.isColor = index;
    },
    //新建卡片选择标签
    selectLabel(index) {
      this.isLabelSelect = index;
    },
    // 丢弃按钮
    giveUp() {
      this.isAddShow = false;
    },
    // 确定按钮
    submit() {
      this.isAddShow = false;
    },
    //点击卡片展示卡片细节。
    toCardDetail() {
      this.isCardShow = true;
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
  // 选择颜色列表索引。
  .isColorSelect {
    border: 0.02rem solid rgba(59, 115, 240, 1) !important;
  }
  // 选择标签。
  .isLabelSelect {
    background: #ebebeb;
    font-weight: 600;
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
    background: #3b73f0;

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
    position: relative;
    height: 100%;
    padding: 0 0.4rem;

    .title {
      margin-top: 0.34rem;
      font-size: 0.32rem;
      color: #202020;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }
    // 颜色列表。
    .color-list {
      display: flex;
      margin-bottom: 0.24rem;
      .color-item {
        width: 0.48rem;
        height: 0.48rem;
        background: #fcafa2;
        margin-right: 0.16rem;
        border: 0.02rem solid transparent;
      }
    }
    .newcard {
      width: 100%;
      height: 4.8rem;
      background: rgba(146, 230, 245, 0.3);
      font-family: xp;
      margin: 0 auto 0.36rem;
      padding: 0.4rem;
      .textarea {
        width: 100%;
        height: 3.3rem;
        background-color: transparent;
        border: 0;
      }
      .signature {
        width: 6.22rem;
        height: 0.72rem;
        margin-left: -0.16rem;
        border: 1px solid rgba(255, 255, 255, 1);
        background-color: transparent;
        padding-left: 0.16rem;
      }
    }
    .select-label {
      font-size: 0.28rem;
      color: #202020;
      font-weight: 600;
    }
    .labels {
      display: flex;
      flex-wrap: wrap;
      span {
        width: 0.96rem;
        height: 0.48rem;
        font-size: 0.28rem;
        color: #202020;
        text-align: center;
        line-height: 0.48rem;
        border-radius: 0.24rem;
        margin: 0.36rem 0.15rem 0 0;
      }
    }
    .liability {
      margin-top: 0.3rem;
      margin-bottom: 0.24rem;
    }
    .btn-bottom {
      width: 100%;
      height: 1.44rem;
      // position: fixed;
      // left: 0;
      // bottom: -1.5rem;
      display: flex;
      justify-content: center;
      padding-top: 0.24rem;
      padding-bottom: 0.24rem;
      background-color: #fff;
      .discard {
        width: 2rem;
        height: 0.96rem;
        margin-right: 0.4rem;
        border-radius: 0.48rem;
        border: 1px solid rgba(32, 32, 32, 1);
        background: #ffffff;
        color: #202020;
      }
      .confirm {
        width: 4.6rem;
        height: 0.96rem;
        border-radius: 0.48rem;
        background: #202020;
        border: 1px solid rgba(32, 32, 32, 1);
        color: #ffffff;
      }
    }
    .responibility {
      font-size: 0.24rem;
      color: #949494;
      line-height: 0.36rem;
    }
  }
  //卡片细节弹出层
  .card-detail {
    .title {
      display: flex;
      justify-content: end;
      margin-top: 0.34rem;
      font-size: 0.32rem;
      margin-bottom: 0.34rem;
      font-family: xp;
      & > span:nth-child(1) {
        color: #3b73f0;
        margin-right: 0.6rem;
      }
      & > span:nth-child(2) {
        color: #f67770;
        margin-right: 0.4rem;
      }
    }
    .comment {
      width: 7rem;
      margin: 0 auto;
      font-size: 0.28rem;
      color: #202020;
      font-weight: 600;
      margin-bottom: 0.24rem;
    }
    .comment-detail {
      display: flex;
      justify-content: space-between;
      width: 7rem;
      margin: 0 auto;
      margin-bottom: 0.3rem;

      .avatar {
        width: 0.56rem;
        height: 0.56rem;
        margin-right: 0.16rem;
        img {
          border-radius: 50%;
        }
      }
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        .msg-title {
          display: flex;
          align-items: center;
          .name {
            font-size: 0.28rem;
            color: #202020;
            font-weight: 600;
            margin-right: 0.08rem;
          }
          .time {
            font-size: 0.24rem;
            color: #949494;
            font-weight: 400;
          }
        }
        .msg-comment {
          font-size: 0.28rem;
          color: #202020;
          line-height: 0.44rem;
          font-weight: 400;
          font-family: xp;
          margin-top: 0.1rem;
        }
      }
    }
    .ipt-msg {
      width: 7rem;
      margin: 0 auto;
      padding-bottom: 0.2rem;
      display: flex;
      align-items: center;
      font-family: xp;
      input {
        width: 6.2rem;
        height: 0.8rem;
        background: #f4f4f4;
        border: 0;
        padding-left: 0.24rem;
        font-size: 0.28rem;
        &::placeholder {
          color: rgba(30, 32, 37, 0.5);
        }
      }
      i {
        font-size: 0.6rem;
        margin-left: 0.1rem;
        color: #3b73f0;
      }
    }
  }
}
</style>
