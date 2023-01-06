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
        <div class="card" v-for="(item, index) in notes" :key="item.id" @click="toCardDetail(notes[index])" :style="`background:${cardColor[item.color]}`">
          <!-- 卡片头部分 -->
          <div class="card-title">
            <span>{{ dateOne(item.moment) }}</span>
            <span>{{ label[0][[item.label + 1]] }}</span>
          </div>
          <!-- 卡片信息。 -->
          <div class="card-message">
            <p>{{ item.message }}</p>
          </div>
          <!-- 卡片尾部。 -->
          <div class="card-footer">
            <div class="like">
              <span @click.stop="toLike(index)"><i class="iconfont icon-aixin1" :class="item.islike[0].count > 0 ? 'isLike' : ''"></i>&nbsp;&nbsp;{{ item.like[0].count }}</span>
              <span v-show="item.comcount[0].count > 0"><i class="iconfont icon-liuyan"></i>&nbsp;&nbsp;{{ item.comcount[0].count }}</span>
            </div>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <!-- 右下角的添加留言按钮。 -->
    <div class="addbtn" @click="addWall">
      <i class="iconfont icon-tianjia"></i>
    </div>

    <!-- 底部分页操作。 -->
    <van-pagination v-if="this.notes.length > 0" v-model="page" :items-per-page="pageSize" :total-items="totalNumber" :show-page-size="5" @change="changePage">
      <template #prev-text>
        <van-icon name="arrow-left" />
      </template>
      <template #next-text>
        <van-icon name="arrow" />
      </template>
      <template #page="{ text }">{{ text }}</template>
    </van-pagination>

    <!-- 空状态。 -->
    <van-empty v-else image="http://cdn.xxoutman.cn/note2.png" description="还没有留言,快写上第一条吧!" />

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
          <textarea class="textarea" placeholder="留言..." v-model="message"></textarea>
          <input type="text" class="signature" placeholder="签名..." v-model="name" />
        </div>

        <!-- 选择标签 -->
        <div class="select-label">选择标签</div>
        <div class="labels">
          <span v-for="(item, index) in label[1]" :key="item" @click="selectLabel(index)" :class="isLabelSelect == index ? 'isLabelSelect' : ''">{{ item }}</span>
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
        <div class="card" :style="`background:${cardColor[cardDetail.color]}`">
          <!-- 卡片头部分 -->
          <div class="card-title">
            <span>{{ dateOne(cardDetail.moment) }}</span>
            <span>{{ label[0][[cardDetail.label + 1]] }}</span>
          </div>
          <!-- 卡片信息。 -->
          <div class="card-message">
            <p>{{ cardDetail.message }}</p>
          </div>
          <!-- 卡片尾部。 -->
          <div class="card-footer">
            <div class="like">
              <span @click="toLikeDetail">
                <i class="iconfont icon-aixin1" :class="cardDetail.islike && cardDetail.islike[0].count > 0 ? 'isLike' : ''"></i>
                &nbsp;&nbsp;{{ cardDetail.like && cardDetail.like[0].count }}
              </span>
              <span v-show="cardDetail.comcount && cardDetail.comcount[0].count > 0"> <i class="iconfont icon-liuyan"></i>&nbsp;&nbsp;{{ cardDetail.comcount && cardDetail.comcount[0].count }} </span>
            </div>
            <span>{{ cardDetail.name }}</span>
          </div>
        </div>
        <!-- 评论。 -->
        <div class="comment">评论 {{ cardDetail.comcount && cardDetail.comcount[0].count }}</div>
        <!-- 评论信息。 -->
        <div class="comment-detail" v-for="item in noteMsg" :key="item.id">
          <div class="avatar" :style="`background:${portrait[item.imgUrl]}`">
            <!-- <img src="http://cdn.xxoutman.cn/logo.jpg" alt="" style="width: 100%" /> -->
          </div>
          <div class="info">
            <div class="msg-title">
              <div class="name">{{ item.name }}</div>
              <span class="time">{{ dateOne(item.moment) }}</span>
            </div>
            <p class="msg-comment" style="white-space: pre-wrap">{{ item.comment }}</p>
          </div>
        </div>
        <span
          v-show="cardDetail.comcount && cardDetail.comcount[0].count != noteMsg.length && noteMsg.length >= 10"
          style="display: flex; justify-content: center; color: #646566; font-size: 0.28rem; margin-bottom: 0.3rem"
          @click="getMoreComment"
          >加载更多</span
        >
        <!-- 发表评论。 -->
        <div class="ipt-msg">
          <textarea type="text" placeholder="发表评论" v-model="iptMsg"></textarea>
          <i class="iconfont icon-fasong" @click="sendMsg"></i>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { label, cardListColor, cardColor, portrait } from "@/utils/data";
import { dateOne } from "@/utils/time_format";
import { findWallPageApi, findWallPhotoTotalApi, findCommentPageApi, insertFeedBackApi, likeCountApi, insertCommentApi, insertWallApi } from "@/api/index";
export default {
  name: "Wall",
  data() {
    return {
      label, //当前的标签[[],[]]
      portrait, //头像颜色数据。
      isLabelindex: 0, //留言墙标签选择的索引。
      cardListColor, //新建卡片选择颜色列表。
      cardColor, //透明卡片颜色选择列表
      isAddShow: false, //添加留言的弹出层是否显示
      isColor: 0, //当前选中的颜色值列表的索引。
      isLabelSelect: 0, //选择标签的索引值
      isCardShow: false, //点击卡片的弹出层。
      page: 1, //留言页码。
      pageSize: 5, //每页多少条留言
      commentPage: 1,
      commentSize: 10, //每页评论有多少
      totalNumber: 0, //总共的留言有多少条
      notes: [], //留言墙卡片数组。
      cardDetail: {}, //卡片细节
      noteMsg: [], //留言评论数据。
      iptMsg: "", //评论框评论信息。
      message: "", //添加卡片时留言信息。
      name: "", //添加卡片的签名信息。
    };
  },
  computed: {},
  mounted() {

    setTimeout(() => {
      this.getWallData();
    }, 100);
    this.getWallCount();
  },
  methods: {
    //获取留言墙数据。
    getWallData() {
      let data = {
        page: this.page,
        pageSize: this.pageSize,
        type: 0, //代表是留言墙
        label: this.isLabelindex - 1,
        userID: this.$store.state.userIp, //当前登录用户的IP。
      };
      findWallPageApi(data).then((res) => {
        this.notes = res.message;
      });
    },
    //获取留言总条数。
    getWallCount() {
      // 查询留言墙或照片墙的总条数。
      findWallPhotoTotalApi({ type: 0, label: this.isLabelindex - 1 }).then((res) => {
        this.totalNumber = res.message[0].totalNumber;
      });
    },

    dateOne, //时间格式，处理方法。
    // 切换tab栏的方法。
    toChangeTab(value, title) {
      console.log(value, title); //1 '留言'
      this.isLabelindex = value;
      // 请求分类数据
      this.page = 1;
      this.getWallData();
      this.getWallCount();
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
      console.log(this.isLabelSelect);
    },
    // 丢弃按钮
    giveUp() {
      this.isAddShow = false;
    },
    // 确定按钮
    submit() {
      this.isAddShow = false;
      // 添加留言数据。  // 创建提交给后端的数据项
      if (this.name == "") {
        this.name = "匿名";
      }
      let data = {
        type: 0, //留言
        message: this.message,
        name: this.name,
        userId: this.$store.state.userIp,
        moment: new Date(),
        label: this.isLabelSelect, //选择到对应标签的索引
        color: this.isColor, //留言背景颜色索引
        imgUrl: "", //留言没有图片路径。
      };
      // 新建留言数据
      insertWallApi(data).then((res) => {
        // 自己造一张卡片
        let cradD = {
          type: 0,
          message: this.message,
          name: this.name,
          userId: this.$store.state.userIp,
          moment: new Date(),
          label: this.isLabelSelect, //选择到对应标签的索引
          color: this.isColor, //留言背景颜色索引
          imgUrl: "",
          id: res.message.insertId,
          islike: [{ count: 0 }],
          like: [{ count: 0 }],
          comcount: [{ count: 0 }],
          report: [{ count: 0 }],
          revoke: [{ count: 0 }],
        };
        this.notes.unshift(cradD);
        this.isLabelindex = 0; //让卡片重新回到全部标签。

        // 清空卡片数据。
        this.message = "";
        this.name = "";
      });
    },
    //点击卡片展示卡片细节。
    toCardDetail(cardValue) {
      this.isCardShow = true;
      this.cardDetail = cardValue;
      console.log(this.cardDetail);

      this.commentPage = 1;
      // 请求评论数据。
      let data = {
        page: this.commentPage,
        pageSize: this.commentSize,
        id: this.cardDetail.id,
      };
      findCommentPageApi(data).then((res) => {
        this.noteMsg = res.message;
        // console.log(this.noteMsg);
      });
    },
    // 加载更多评论。
    getMoreComment() {
      this.commentPage++;
      // 请求评论数据。
      let data = {
        page: this.commentPage,
        pageSize: this.commentSize,
        id: this.cardDetail.id,
      };
      findCommentPageApi(data).then((res) => {
        this.noteMsg = this.noteMsg.concat(res.message);
      });
    },
    //页码改变函数。
    changePage() {
      // console.log(value);
      this.getWallData();
    },
    //点击喜欢按钮。
    toLike(index) {
      // 判断是否点击过
      let likeData = {
        wid: this.notes[index].id, //当前卡片的id
        uid: this.$store.state.userIp, //当前登录的ip用户 150.12.16.18
      };
      // 判断当前ip地址有没有点击过爱心
      likeCountApi(likeData).then((res) => {
        console.log("是否点击爱心。", res.message[0].count);
        if (res.message[0].count == 0) {
          let data = {
            wallId: this.notes[index].id, //当前卡片的id
            userId: this.$store.state.userIp, //当前登录的ip用户
            type: 0, //喜欢
            moment: new Date(), //时间
          };
          insertFeedBackApi(data).then((res) => {
            this.notes[index].like[0].count++;
            this.notes[index].islike[0].count = 1;
          });
        } else {
          this.notes[index].islike[0].count = 1;
        }
      });
    },
    //点击爱心详细详细留言。
    toLikeDetail() {
      // 判断是否点击过
      let likeData = {
        wid: this.cardDetail.id, //当前卡片的id
        uid: this.$store.state.userIp, //当前登录的ip用户 150.12.16.18
      };
      // 判断当前ip地址有没有点击过爱心
      likeCountApi(likeData).then((res) => {
        console.log("是否点击爱心。", res.message[0].count);
        if (res.message[0].count == 0) {
          let data = {
            wallId: this.cardDetail.id, //当前卡片的id
            userId: this.$store.state.userIp, //当前登录的ip用户
            type: 0, //喜欢
            moment: new Date(), //时间
          };
          insertFeedBackApi(data).then((res) => {
            this.cardDetail.like[0].count++;
            this.cardDetail.islike[0].count = 1;
          });
        } else {
          this.cardDetail.islike[0].count = 1;
        }
      });
    },
    //发送评论信息。
    sendMsg() {
      console.log(this.iptMsg);

      //如果有用户就用头像，没有就用随机头像
      let img = Math.floor(Math.random() * 14);
      let data = {
        wallId: this.cardDetail.id,
        userId: this.$store.state.userIp,
        imgUrl: img,
        comment: this.iptMsg, //评论
        name: "匿名",
        moment: new Date(),
      };
      // console.log(data);
      insertCommentApi(data).then((res) => {
        this.noteMsg.unshift(data);
        this.cardDetail.comcount[0].count++;
      });
      // 清空评论框
      this.iptMsg = "";
      // this.name = "";
      // this.$message({ type: "success", message: "发送成功!" });
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
    z-index: 999;
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
        border-radius: 50%;
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
      textarea {
        width: 6.2rem;
        height: 0.8rem;
        background: #f4f4f4;
        border: 0;
        padding-left: 0.24rem;
        font-size: 0.28rem;
        line-height: 0.8rem;
        resize: none;
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
