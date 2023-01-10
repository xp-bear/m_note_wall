<template>
  <div class="Photo">
    <!-- tab项目进行切换。 -->
    <van-tabs background="transparent" color="#2b5aed" @click="toChangeTab">
      <van-tab v-for="item in label[2]" :key="item" :title="item">
        <!-- 照片墙头部 -->
        <div class="msg">
          <p>照片墙</p>
          <div>照片挂在墙上，笑声还留在空气里。</div>
        </div>
        <!-- 绘制照片。 -->
        <div class="photo-card">
          <div class="photo-item" v-for="(item, index) in photoArr" :key="item.id" @click="changePhotoShow(index)">
            <video preload="metadata" v-if="item.imgUrl.includes('.mp4' || '.wmv' || '.avi' || '.MOV')" style="width: 100%" :src="item.imgUrl + '#t=0.1'"></video>
            <img v-else :src="item.imgUrl" alt="http://cdn.xxoutman.cn/no_img.png" />

            <div class="message">
              <div class="top-message" @click.stop="toLike(index)">
                <i class="iconfont icon-aixin1" :class="item.islike[0].count > 0 ? 'isLike' : ''"></i>
                &nbsp;
                <span>{{ item.like[0].count }}</span>
              </div>
              <div class="top-message">
                <i class="iconfont icon-liuyan"></i>
                &nbsp;
                <span>{{ item.comcount[0].count }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <!-- 右下角的添加留言按钮。 -->
    <div class="addbtn" @click="addWall">
      <i class="iconfont icon-tianjia"></i>
    </div>

    <!-- 分页插件 -->
    <van-pagination v-if="this.photoArr.length > 0" v-model="page" :items-per-page="pageSize" :total-items="totalNumber" :show-page-size="10" @change="changePage">
      <template #prev-text>
        <!-- <van-icon class-prefix="" name="" /> -->
        <i class="iconfont icon-zuojiantou1" style="font-size: 0.64rem"></i>
      </template>
      <template #next-text>
        <!-- <van-icon name="arrow" /> -->
        <i class="iconfont icon-youjiantou1" style="font-size: 0.64rem"></i>
      </template>
      <template #page="{ text }">{{ text }}</template>
    </van-pagination>

    <!-- 加载状态 -->
    <van-loading v-if="isLoading == -1" vertical color="#7e7e7e" type="spinner" size="1rem">疯狂加载中...</van-loading>
    <!-- 空状态。 -->
    <van-empty v-if="this.photoArr.length == 0 && isLoading == 1" image="http://cdn.xxoutman.cn/photo2.png" description="还没有照片,快贴上第一张吧！" />

    <!-- 新建卡片的弹出层 -->
    <van-popup v-model="isAddShow" position="right" :style="{ height: '100%', width: '100%' }" closeable close-icon-position="top-right">
      <div class="popup">
        <!-- 在弹出层里面新建留言。 -->
        <div class="title">贴照片</div>
        <!-- 新建照片输入框。 -->
        <div class="add-photo">
          <input type="file" id="file" multiple="multiple" @change="showPhoto" />
          <!-- 没有选择图片 -->
          <div class="add-bt" v-if="url == ''">
            <i class="iconfont icon-tianjia"></i>
          </div>
          <!-- 选择图片之后 -->
          <div class="change-bt" v-else>
            <i class="iconfont icon-xiugai"></i>
          </div>

          <!-- 显示选择的图片 -->
          <div class="photo-div">
            <img :src="this.url" alt="" />
          </div>
        </div>

        <!-- 新建卡片 -->
        <div class="newcard">
          <!-- 新建卡片信息。 -->
          <textarea class="textarea" placeholder="留言..." v-model="photoMsg"></textarea>
          <input type="text" class="signature" placeholder="签名..." v-model="photoName" />
        </div>

        <!-- 选择标签 -->
        <div class="select-label">选择标签</div>
        <div class="labels">
          <span v-for="(item, index) in label[3]" @click="selectLabel(index)" :class="isLabelSelect == index ? 'isLabelSelect' : ''">{{ item }}</span>
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
          <button class="discard" @click="giveup">丢弃</button>
          <button class="confirm" @click="confirm">确定</button>
        </div>
      </div>
    </van-popup>

    <!-- 照片详细细节弹出层 -->
    <van-popup v-model="isPhotoShow" position="right" :style="{ height: '100%', width: '100%' }" closeable close-icon="arrow-left" close-icon-position="top-left" @closed="photoClose">
      <div class="card-detail">
        <div class="title">
          <span>举报</span>
          <span>联系墙主撕掉该便签</span>
        </div>
        <!-- 显示照片墙的照片。 -->
        <div class="pic">
          <!-- <img :src="photoObj.imgUrl" alt="" /> -->
          <video v-if="photoObj.imgUrl ? photoObj.imgUrl.includes('.mp4' || '.wmv' || '.avi' || '.MOV') : ''" :src="photoObj.imgUrl" style="width: 100%" autoplay loop controls></video>
          <img v-else :src="photoObj.imgUrl" alt="" />
        </div>
        <!-- 卡片细节 -->
        <div class="card">
          <!-- 卡片头部分 -->
          <div class="card-title">
            <span>{{ dateOne(photoObj.moment) }}</span>
            <span>{{ label[3][photoObj.label] }}</span>
          </div>
          <!-- 卡片信息。 -->
          <div class="card-message">
            <p>{{ photoObj.message }}</p>
          </div>
          <!-- 卡片尾部。 -->
          <div class="card-footer">
            <div class="like">
              <span @click="toLikeDetail">
                <i class="iconfont icon-aixin1" :class="photoObj.islike ? (photoObj.islike[0].count > 0 ? 'isLike' : '') : ''"></i>
                &nbsp;&nbsp;{{ photoObj.like ? photoObj.like[0].count : "" }}
              </span>
              <span> <i class="iconfont icon-liuyan"></i>&nbsp;&nbsp;{{ photoObj.comcount ? photoObj.comcount[0].count : "" }} </span>
            </div>
            <span>{{ photoObj.name }}</span>
          </div>
        </div>
        <!-- 评论。 -->
        <div class="comment">评论 6</div>
        <!-- 评论信息。 -->
        <div class="comment-detail">
          <div class="avatar">
            <img src="http://cdn.xxoutman.cn/logo.jpg" alt="" style="width: 100%" />
          </div>
          <div class="info">
            <div class="msg-title">
              <div class="name">匿名</div>
              <span class="time">15:34</span>
            </div>
            <p class="msg-comment" style="white-space: pre-wrap">哈哈哈</p>
          </div>
        </div>
        <!-- <span class="more">加载更多</span> -->
        <!-- 发表评论。 -->
        <div class="ipt-msg">
          <textarea type="text" placeholder="发表评论"></textarea>
          <i class="iconfont icon-fasong"></i>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { label, cardListColor, cardColor, portrait } from "@/utils/data";
import { getObjectURL } from "@/utils/upload";
import { dateOne } from "@/utils/time_format";
// import { profileApi, insertWallApi, findWallPageApi, findWallPhotoTotalApi } from "@/api/index";
import { findWallPageApi, findWallPhotoTotalApi, findCommentPageApi, insertFeedBackApi, likeCountApi, insertCommentApi, insertWallApi, deleteWallApi } from "@/api/index";

export default {
  name: "Photo",
  data() {
    return {
      isAddShow: false, //点击添加按钮展示。
      isPhotoShow: false, //照片详细页面弹出层。
      label, //照片墙tab栏标签。
      isLabelSelect: 0, //新建照片标签的选择。
      url: "", //图片显示的临时链接。
      photoName: "", //添加照片签名。
      photoMsg: "", //添加照片留言。
      page: 1, //照片页码
      pageSize: 10, //照片每页显示多少条
      photoArr: [], //照片数组
      photoObj: {}, //照片对象
      isVideoUrl: false, //是否是视频链接
      totalNumber: 0, //当前标签页视频总条数。
      isLabelindex: 0, //tab 标签页索引
      isLoading: -1, //加载状态 -1 加载 0 1
    };
  },
  mounted() {
    setTimeout(() => {
      this.getPhotoData();
    }, 150);
    this.getPhotoCount();
  },
  methods: {
    dateOne, //时间格式，处理方法。
    //获取照片墙数据。
    getPhotoData() {
      let data = {
        page: this.page,
        pageSize: this.pageSize,
        type: 1, //代表是留言墙
        label: this.isLabelindex - 1,
        userID: this.$store.state.userIp, //当前登录用户的IP。
      };
      findWallPageApi(data).then((res) => {
        this.photoArr = res.message;
        if (this.photoArr.length >= 0) {
          this.isLoading = 1;
        }
      });
    },
    //获取照片总条数。
    getPhotoCount() {
      // 查询留言墙或照片墙的总条数。
      findWallPhotoTotalApi({ type: 1, label: this.isLabelindex - 1 }).then((res) => {
        this.totalNumber = res.message[0].totalNumber;
        console.log("每页总数:", this.totalNumber);
      });
    },
    // 切换tab栏的方法。
    toChangeTab(value, title) {
      this.isLabelindex = value;
      // 请求分类数据
      this.photoArr = [];
      this.isLoading = -1;
      this.page = 1;
      this.getPhotoData();
      this.getPhotoCount();
    },
    // 打开弹出层
    addWall() {
      this.isAddShow = true;
    },
    // 切换照片详细细节弹出层的状态。
    changePhotoShow(index) {
      this.photoObj = this.photoArr[index];
      this.isPhotoShow = true;
    },
    //新建卡片选择标签
    selectLabel(index) {
      this.isLabelSelect = index;
      console.log(this.isLabelSelect);
    },
    //选择照片之后的回调函数。
    showPhoto() {
      // let type = document.getElementById("file").files[0].type;
      // console.log(type); //上传文件类型
      // if (type.includes("mp4") || type.includes("avi") || type.includes("wmv") || type.includes("mov")) {
      //   this.isVideoUrl = true;
      // }
      let temporary = getObjectURL(document.getElementById("file").files[0]);

      if (temporary.includes("mp4") || temporary.includes("avi") || temporary.includes("wmv") || temporary.includes("mov")) {
        this.isVideoUrl = true;
      }

      this.url = temporary;

      console.log("临时链接: ", this.url);
    },
    //确认按钮
    confirm() {
      // 创建提交给后端的数据项
      let data = {
        type: 1, // 1 代表的是照片墙。
        message: this.photoMsg,
        name: this.photoName,
        userId: this.$store.state.userIp,
        moment: new Date(),
        label: this.isLabelSelect, //选择到对应标签的索引
        color: -1, //留言背景颜色索引
        imgUrl: this.url,
      };
      let file = document.getElementById("file");

      // if (file.files.length > 0) {
      //   let fromData = new FormData();
      //   fromData.append("file", file.files[0]);
      //   // 提交后端
      //   profileApi(fromData).then((res) => {
      //     this.url = res.imgUrl;
      //     // -----------
      //     data.imgUrl = this.url;
      //     insertWallApi(data).then((res) => {
      //       // 自己造一张卡片
      //       let cradD = {
      //         type: 1,
      //         message: this.photoMsg,
      //         name: this.photoName,
      //         userId: this.$store.state.userIp,
      //         moment: new Date(),
      //         label: this.isLabelSelect, //选择到对应标签的索引
      //         color: -1, //留言背景颜色索引
      //         imgUrl: this.url, //图片地址
      //         id: res.message.insertId,
      //         islike: [{ count: 0 }],
      //         like: [{ count: 0 }],
      //         comcount: [{ count: 0 }],
      //         report: [{ count: 0 }],
      //         revoke: [{ count: 0 }],
      //       };

      //       this.photoName = "";
      //       this.photoMsg = "";
      //       this.url = "";
      //     });
      //   });
      // }
      this.isAddShow = false;
    },
    // 放弃按钮
    giveup() {
      // console.log(22);
      this.isAddShow = false;
    },
    // 关闭详情遮罩层按钮。
    photoClose() {
      // console.log(22);
      this.photoObj = ""; //关闭照片详细页面，展示清空数据。
    },
    //页码改变函数。
    changePage() {
      this.photoArr = [];
      this.isLoading = -1;
      document.documentElement.scrollTop = 0;
      this.getPhotoData();
    },
    //点击红心按钮。
    toLike(index) {
      // 判断是否点击过
      let likeData = {
        wid: this.photoArr[index].id, //当前卡片的id
        uid: this.$store.state.userIp, //当前登录的ip用户 150.12.16.18
      };
      // 判断当前ip地址有没有点击过爱心
      likeCountApi(likeData).then((res) => {
        console.log("是否点击爱心。", res.message[0].count);
        if (res.message[0].count == 0) {
          let data = {
            wallId: this.photoArr[index].id, //当前卡片的id
            userId: this.$store.state.userIp, //当前登录的ip用户
            type: 0, //喜欢
            moment: new Date(), //时间
          };
          insertFeedBackApi(data).then((res) => {
            this.photoArr[index].like[0].count++;
            this.photoArr[index].islike[0].count = 1;
          });
        } else {
          this.photoArr[index].islike[0].count = 1;
        }
      });
    },
    // 详细照片点击红心。
    toLikeDetail() {
      // 判断是否点击过
      let likeData = {
        wid: this.photoObj.id, //当前卡片的id
        uid: this.$store.state.userIp, //当前登录的ip用户 150.12.16.18
      };
      // 判断当前ip地址有没有点击过爱心
      likeCountApi(likeData).then((res) => {
        console.log("是否点击爱心。", res.message[0].count);
        if (res.message[0].count == 0) {
          let data = {
            wallId: this.photoObj.id, //当前卡片的id
            userId: this.$store.state.userIp, //当前登录的ip用户
            type: 0, //喜欢
            moment: new Date(), //时间
          };
          insertFeedBackApi(data).then((res) => {
            this.photoObj.like[0].count++;
            this.photoObj.islike[0].count = 1;
          });
        } else {
          this.photoObj.islike[0].count = 1;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.Photo {
  // 爱心选中样式。
  .isLike {
    color: #f67770;
  }
  // 选择标签。
  .isLabelSelect {
    background: #ebebeb;
    font-weight: 600;
  }
  // -----------------------------
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
  .photo-card {
    width: 7rem;
    margin: 0 auto;
    column-count: 2; //显示的列数（几列显示）
    column-gap: 0.08rem; //每列之间的间隔距离
    .photo-item {
      position: relative;
      // background-color: rebeccapurple;
      img {
        width: 100%;
      }
      .message {
        position: absolute;
        width: 1.74rem;
        height: 0.48rem;
        background-color: rgba(0, 0, 0, 0.6);
        left: 0.16rem;
        bottom: 0.24rem;
        border-radius: 0.24rem;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        font-family: "xp";
        color: #ccc;
        .top-message {
          display: flex;
          align-items: center;
          font-size: 0.32rem;
          i {
            margin-right: 0.08rem;
          }
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
  //卡片细节弹出层
  .card-detail {
    .pic {
      width: 7rem;
      margin: 0 auto 0.24rem;
      img {
        width: 100%;
        vertical-align: middle;
      }
    }
    .card {
      width: 7rem;
      height: 4.8rem;
      background: rgba(212, 212, 212, 0.3);
      font-family: xp;
      margin: 0 auto 0.24rem;
      padding: 0.2rem 0.4rem;
      .card-title {
        display: flex;
        justify-content: space-between;
        font-size: 0.28rem;
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
    .title {
      display: flex;
      flex-direction: row-reverse;
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
    .more {
      display: flex;
      justify-content: center;
      color: #646566;
      font-size: 0.28rem;
      margin-bottom: 0.3rem;
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
  // 新建照片。
  .popup {
    position: relative;
    height: 100%;
    padding: 0 0.4rem;

    .add-photo {
      margin: 0.4rem 0;
      position: relative;
      input {
        position: absolute;
        z-index: 2;
        width: 1.28rem;
        height: 1.28rem;
        border-radius: 50%;
        opacity: 0;
      }
      .add-bt {
        width: 1.28rem;
        height: 1.28rem;
        border-radius: 50%;
        border: 1px solid #949494;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          color: #202020;
          font-size: 0.52rem;
        }
      }
      .change-bt {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 0.64rem;
        height: 0.64rem;
        top: 0.32rem;
        left: 0.32rem;
        border-radius: 50%;
        background-color: #ffffff80;
        i {
          color: #202020;
          font-weight: 600;
        }
      }
      .photo-div {
        img {
          width: 100%;
          vertical-align: middle;
        }
      }
    }
    .title {
      margin-top: 0.34rem;
      font-size: 0.32rem;
      color: #202020;
      font-weight: 600;
      margin-bottom: 0.34rem;
    }

    .newcard {
      width: 100%;
      height: 4.8rem;
      background: rgba(212, 212, 212, 0.3);
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
      margin-bottom: 0.36rem;
    }
    .labels {
      // display: flex;
      // flex-wrap: wrap;
      span {
        display: inline-block;
        // width: 0.96rem;
        height: 0.48rem;
        font-size: 0.28rem;
        color: #202020;
        text-align: center;
        line-height: 0.28rem;
        border-radius: 0.24rem;
        margin: 0 0.15rem 0.12rem 0;
        padding: 0.1rem 0.2rem;
      }
    }
    .liability {
      margin-top: 0.12rem;
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
}
</style>
