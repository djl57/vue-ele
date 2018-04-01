<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar" alt="">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!-- 通过v-if取supports的第一行 -->
        <!-- 为什么要判断v-if="seller.supports"，如果没有这个会报错。 -->
        <!-- Error in render: "TypeError: Cannot read property '0' of undefined" -->
        <!-- 为什么？ -->
        <!-- 因为一开始就把seller传递给head组件，但是我们获取数据的过程是一个异步过程，一开始在 -->
        <!-- 初始化seller的时候是一个空对象，把这个空对象传递给header的时候这个supports就是一 -->
        <!-- 个undefined，在undefined下面取它的第一个元素显然就会报错 -->
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports"  class="support-count" @click="showDetail()">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail()">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" alt="" width="100%" height="100%">
    </div>
    <div v-show="detailShow" class="detail">
      <!-- detail-wrapper就是内容容器，clearfix是用来清除浮动的样式 -->
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="48" :score="seller.score"></star>
          </div>
          <v-title text="优惠信息"></v-title>
          <!-- <div class="title">
             用div而不用span是因为有的安卓浏览器下它的宽度样式会有兼容性问题，所以用block元素去写他的布局
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div> -->
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
          <v-title text="商家公告"></v-title>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <!-- 定在底部的层，跟detali-wrapper是一个层级的 -->
      <div class="detail-close" @click="hideDetail">
        <i class="icon-close">×</i>
      </div>
    </div>
  </div>
</template>

<script>
// 出现导入方面的问题时这个@一般是万能的
import star from '@/components/star/star'
import title from '@/components/title/title'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      detailShow: false
    }
  },
  methods: {
    showDetail () {
      this.detailShow = true
    },
    hideDetail () {
      this.detailShow = false
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  components: {
    star,
    'v-title': title
  }
}
</script>

<style>
  /* @import "../../common/css/style.css"; */

  .header {
    position: relative;
    overflow: hidden;
    color: #fff;
    background: rgba(7, 17, 27, 0.5);
  }
  .header .content-wrapper {
    position: relative;
    padding: 24px 12px 18px 24px;
    font-size: 0; /* 1 */
  }
  .header .content-wrapper .avatar {
    vertical-align: top;
    display: inline-block;
  }
  .header .content-wrapper .avatar img {
    border-radius: 2px;
  }
  /* 这两个之间有一些空白字符，为了消除空白字符设置了样式（1->2） */
  .header .content-wrapper .content {
    display: inline-block;
    /* font-size: 16px; */
    margin-left: 16px;
  }
  .header .content-wrapper .content .title {
    margin: 2px 0 8px 0;
  }
  .header .content-wrapper .content .title .brand {
    display: inline-block; /* 因为是span元素，给它设置宽高不起作用，所以把它变成行内元素，呈快对象显示 */
    vertical-align: top;
    width: 30px;
    height: 18px;
    /* bg-image('brand'); */
    background-image: url(brand@2x.png);
    background-size: 30px 18px;
    background-repeat: no-repeat;
  }
  .header .content-wrapper .content .title .name {
    margin-left: 6px;
    font-size: 16px;
    line-height: 18px;
    font-weight: bold;
  }
  .header .content-wrapper .content .description {
    margin-bottom: 10px;
    line-height: 12px;
    font-size: 12px;
  }
  .header .content-wrapper .content .support .icon {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    height: 12px;
    margin-right: 4px;
    background-size: 12px;
    background-repeat: no-repeat;
  }
  .support .decrease {
    background-image: url(decrease_1@2x.png);
  }
  .support .discount {
    background-image: url(discount_1@2x.png);
  }
  .support .guarantee {
    background-image: url(guarantee_1@2x.png);
  }
  .support .invoice {
    background-image: url(invoice_1@2x.png);
  }
  .support .special {
    background-image: url(special_1@2x.png);
  }
  .header .content-wrapper .content .support .text {
    line-height: 12px;
    font-size: 10px;
  }
  .header .support-count {
    position: absolute;
    right: 12px;
    bottom: 14px;
    padding: 0 8px;
    height: 24px;
    line-height: 24px;
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.2);
    text-align: center;
  }
  .count {
    font-size: 10px;
  }
  /* .icon-keyboard_arrow_right {
    font-size: 10px;
  } */
  .header .bulletin-wrapper {
    position: relative;
    height: 28px;
    line-height: 28px;
    padding: 0 22px 0 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: rgba(7, 17, 27, 0.2)
  }
  .header .bulletin-wrapper .bulletin-title {
    display: inline-block;
    vertical-align: top;
    margin-top: 8px;
    width: 22px;
    height: 12px;
    background-image: url(bulletin@2x.png);
    background-size: 22px 12px;
    background-repeat: no-repeat;
  }
  .header .bulletin-wrapper .bulletin-text {
    vertical-align: top;
    margin: 0 4px;
    font-size: 10px
  }
  .header .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(10px);
  }
  .header .detail {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    /* transition: all 0.5s; */
    background: rgba(7, 17, 27, 0.8);
    /* -webkit-backdrop-filter: blur(10px); */
  }
  /* .header .fade-transition {
    opacity: 1;
    background: rgba(7, 17, 27, 0.8);
  }
  .header .fade-enter, .fade-leave {
    opacity: 0;
    background: rgba(7, 17, 27, 0);
  } */
  .header .detail .clearfix {
    display: inline-block;
  }
  .header .detail .clearfix:after {
    display: block;
    content: ".";
    height: 0;
    line-height: 0;
    clear: both;/* 图像的左侧和右侧均不允许出现浮动元素 */
    visibility: hidden; /* 使元素不可见 */
  }
  .header .detail .detail-wrapper {
    min-height: 100%;
    width: 100%;
  }
  .header .detail .detail-wrapper .detail-main {
    margin-top: 64px;
    padding-bottom: 64px;/* 给close按钮留的空间，当内容超过页面时使其不至于遮挡住文字 */
  }
  .header .detail .detail-wrapper .detail-main .name {
    line-height: 16px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
  }
  .header .detail .detail-wrapper .detail-main .star-wrapper {
    margin-top: 18px;
    padding: 2px 0;
    text-align: center;
  }
  /* .header .detail .detail-wrapper .detail-main .title {
    display: flex;
    width: 80%;
    margin: 28px auto 24px auto;
  }
  .header .detail .detail-wrapper .detail-main .title .line {
    不用担心flex的兼容性问题，因为vue自带的一个postcss工具会给那个不兼容的代码自动添加一些兼容性的代码
    flex: 1;
    position: relative;
    top: -6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  .header .detail .detail-wrapper .detail-main .title .text {
    不需要设置flex，因为它会因为它的内容自动铺开
    padding: 0 12px;
    font-size: 14px;
    font-weight: 700;
  } */
  .header .detail .detail-wrapper .detail-main .supports {
    width: 80%;
    margin: 0 auto;
  }
  .header .detail .detail-wrapper .detail-main .supports .support-item {
    padding: 0 12px;
    margin-bottom: 12px;
    font-size: 0; /*  */
  }
  .header .detail .detail-wrapper .detail-main .supports .support-item:last-child {
    margin-bottom: 0; /*  */
  }
  .header .detail .detail-wrapper .detail-main .supports .support-item .icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: top; /* 对齐 */
    margin-right: 6px;
    background-size: 16px 16px;
    background-repeat: no-repeat;
  }
  .header .detail .detail-wrapper .detail-main .supports .decrease {
    background-image: url(decrease_2@2x.png);
  }
  .header .detail .detail-wrapper .detail-main .supports .discount {
    background-image: url(discount_2@2x.png);
  }
  .header .detail .detail-wrapper .detail-main .supports .guarantee {
    background-image: url(guarantee_2@2x.png);
  }
  .header .detail .detail-wrapper .detail-main .supports .invoice {
    background-image: url(invoice_2@2x.png);
  }
  .header .detail .detail-wrapper .detail-main .supports .special {
    background-image: url(special_2@2x.png);
  }
  .header .detail .detail-wrapper .detail-main .supports .support-item .text {
    line-height: 16px;
    font-size: 12px;
  }
  .header .detail .detail-wrapper .detail-main .bulletin {
    width: 80%;
    margin: 0 auto;
  }
  .header .detail .detail-wrapper .detail-main .bulletin .content {
    padding: 0 12px;
    line-height: 24px;
    font-size: 12px;
  }
  .header .detail .detail-close {
    position: relative;
    width: 32px;
    height: 32px;
    margin: -64px auto 0 auto;/* 左右auto居中，margin-top走到上面预留的地方 */
    clear: both;
    font-size: 32px;
  }
  /* .icon-keyboard_arrow_right {
    position: absolute;
    font-size: 10px;
    right: 12px;
    top: 8px;
  } */

</style>
