<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2 class="title">起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2 class="title">商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2 class="title">平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favourite" @click="togglefavourite">
          <span  class="icon-favourite icon" :class="{'active':favourite}">❤</span>
          <span class="text">{{favouriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper"> <!-- 这里必须使用驼峰格式 -->
          <ul class="pic-list" ref="picList">
            <li v-for="(pic,index) in seller.pics" :key="index" class="pic-item">
              <img width="120" height="90" :src="pic" alt="">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="infos">
        <h1 class="title">商家信息</h1>
        <div class="info-wrapper">
          <ul class="info-list">
            <li v-for="(info,index) in seller.infos" :key="index" class="info-item">
              {{info}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {saveToLocal, loadFromLocal} from '@/common/js/store'
import star from '@/components/star/star'
import split from '@/components/split/split'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      // 从本地缓存里去读
      // 一个立即执行函数
      favourite: (() => {
        return loadFromLocal(this.seller.id, 'favourite', false)
      })()
      // favourite: false 写死
    }
  },
  computed: {
    favouriteText () {
      return this.favourite ? '已收藏' : '收藏'
    }
  },
  components: {
    star,
    split
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  mounted () {
    if (!this.scroll) {
      this.scroll = new BScroll(this.$refs.seller, {
        click: true
      })
    } else {
      this.scroll.refresh()
    }
    if (this.seller.pics) {
      // 求ul的宽度
      let picWidth = 120 // 每个图片的宽度
      let margin = 6
      let Width = (picWidth + margin) * this.seller.pics.length - margin
      // 设置ul的宽度
      this.$refs.picList.style.width = Width + 'px'
      this.picScroll = new BScroll(this.$refs.picWrapper, {
        scrollX: true,
        click: true,
        eventPassthrough: 'vertical'
      })
    }
  },
  methods: {
    togglefavourite () {
      this.favourite = !this.favourite
      saveToLocal(this.seller.id, 'favourite', this.favourite)
    }
  }
}
</script>

<style>
.seller {
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
}
.seller .seller-content .overview {
  position: relative;
  padding: 18px;
}
.seller .seller-content .overview .title {
  margin-bottom: 8px;
  line-height: 14px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}
.seller .seller-content .overview .desc {
  padding-bottom: 18px;
  font-size: 0;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.seller .seller-content .overview .desc .star {
  display: inline-block;
  margin-right: 8px;
  vertical-align: top;
}
.seller .seller-content .overview .desc .text {
  display: inline-block;
  margin-right: 12px;
  vertical-align: top;
  line-height: 18px;
  font-size: 10px;
  color: rgb(70, 80, 93);
}
.seller .seller-content .overview .remark {
  display: flex;
  padding-top: 18px;
}
.seller .seller-content .overview .remark .block {
  flex: 1;
  text-align: center;
  border-right: 1px solid rgba(7, 17, 27, 0.1);
}
.seller .seller-content .overview .remark .block:last-child {
  border-right: none;
}
.seller .seller-content .overview .remark .block .title {
  margin-bottom: 4px;
  line-height: 10px;
  font-size: 10px;
  color: rgb(147, 153, 159)
}
.seller .seller-content .overview .remark .block .content {
  line-height: 24px;
  font-size: 10px;
  color: rgb(7, 17, 27);
}
.seller .seller-content .overview .remark .block .content .stress {
  font-size: 20px;
}
.seller .seller-content .overview .favourite {
  position: absolute;
  width: 50px; /* 宽度设置了才能使心位置不变 */
  right: 11px;
  top: 18px;
  text-align: center;
}
.seller .seller-content .overview .favourite .icon {
  display: block;
  margin-bottom: 4px;
  line-height: 24px;
  font-size: 24px;
  color: #d4d6d9;
}
.seller .seller-content .overview .favourite .text {
  line-height: 10px;
  font-size: 10px;
  color: rgb(77, 85, 93);
}
.seller .seller-content .overview .favourite .active {
  color: rgb(240, 20, 20);
}
.seller .seller-content .bulletin {
  padding: 18px 18px 0 18px;
}
.seller .seller-content .bulletin .title {
  margin-bottom: 8px;
  line-height: 14px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}
.seller .seller-content .bulletin .content-wrapper {
  padding: 0 12px 16px 12px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.seller .seller-content .bulletin .content-wrapper .content {
  line-height: 24px;
  font-size: 12px;
  color: rgb(240, 20, 20);
}
.seller .seller-content .bulletin .supports {
  width: 100%;
  margin: 0 auto;
}
.seller .seller-content .bulletin .supports .support-item {
  padding: 16px 12px;
  font-size: 0; /*  */
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.seller .seller-content .bulletin .supports .support-item:last-child {
  margin-bottom: 0; /*  */
  border-bottom: none;
}
.seller .seller-content .bulletin .supports .support-item .icon { /* 可复用,做成小组件 */
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: top; /* 对齐 */
  margin-right: 6px;
  background-size: 16px 16px;
  background-repeat: no-repeat;
}
.seller .seller-content .bulletin .supports .decrease {
  background-image: url(decrease_4@2x.png);
}
.seller .seller-content .bulletin .supports .discount {
  background-image: url(discount_4@2x.png);
}
.seller .seller-content .bulletin .supports .guarantee {
  background-image: url(guarantee_4@2x.png);
}
.seller .seller-content .bulletin .supports .invoice {
  background-image: url(invoice_4@2x.png);
}
.seller .seller-content .bulletin .supports .special {
  background-image: url(special_4@2x.png);
}
.seller .seller-content .bulletin .supports .support-item .text {/* 可复用,到这里 */
  line-height: 16px;
  font-size: 12px;
  font-weight: 200;
  color: rgb(7, 17, 27);
}
.seller .seller-content .pics {
  padding: 18px;
}
.seller .seller-content .pics .title {
  margin-bottom: 12px;
  line-height: 14px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}
.seller .seller-content .pics .pic-wrapper {
  /* 因为要被横向滚动，所以需要一个wrapper来规定视口的宽度，超出这个宽度隐藏 */
  width: 100%;
  overflow: hidden;
  white-space: nowrap; /* 当图片横向宽度超过屏幕时不会被折行 */
}
.seller .seller-content .pics .pic-wrapper .pic-list {
  font-size: 0;
}
.seller .seller-content .pics .pic-wrapper .pic-list .pic-item {
  display: inline-block;
  margin-right: 6px;
  width: 120px;
  height: 90px;
}
.seller .seller-content .pics .pic-wrapper .pic-list .pic-item:last-child {
  margin-right: 0;
}
.seller .seller-content .infos {
  padding: 18px 18px 0 18px;
}
.seller .seller-content .infos .title {
  margin-bottom: 12px;
  line-height: 14px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}
.seller .seller-content .infos .info-wrapper .info-list .info-item {
  padding: 16px 12px;
  line-height: 16px;
  font-size: 12px;
  font-weight: 200;
  border-top: 1px solid rgba(7, 17, 27, 0.1);
  color: rgb(7, 17, 27);
}
</style>
