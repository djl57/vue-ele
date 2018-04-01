<template>
  <div class="food" v-show="showFlag" ref="food">
    <div class="food-content">
      <div class="image-header">
        <img :src="food.image" alt="">
        <div class="back" @click="hide">
          <span class="icon-arrow_lift">返回</span>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
        </div>
        <div class="cartcontrol-wrapper">
          <cartcontrol :food="food"></cartcontrol>
        </div>
        <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst">
          加入购物车
        </div>
      </div>
      <split v-show="food.info"></split>
      <div class="info" v-show="food.info">
        <h1 class="title">商品介绍</h1>
        <p class="text">{{food.info}}</p>
      </div>
      <split></split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <ratingselect :select-type="selectType"
        :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType, rating.text)" v-for="(rating,index) in food.ratings" :key="index" class="rating-item">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
              </div>
              <!-- 转换时间戳 -->
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span class="icon" :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}">
                赞</span>{{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import Vue from 'vue'
// 不带花括号的一般是export default出来的，带花括号的是export function出来的
// import {formatDate} from '@/common/js/date.js'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
import split from '@/components/split/split'
import ratingselect from '@/components/ratingselect/ratingselect'

// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2

export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return { // 需要一个data去观测showFlag的变化
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  methods: {
    show () { // 方法命名规范：如果是组件私有的，就给它加一个下划线，如果是被父组件调用 的，
      // 就这样命名，如show，被父组件goods调用
      this.showFlag = true // food详情显示
      this.selectType = ALL // 真实传到ratingselect组件的值
      this.onlyContent = false // 真实传到ratingselect组件的值
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFlag = false
    },
    addFirst () {
      Vue.set(this.food, 'count', 1)
    },
    needShow (type, text) {
      if (this.onlyContent && !text) { // 这个判断不是很理解
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    }
  },
  // events: {
  //   'ratingtype.select' (type) {
  //     this.selectType = type
  //     this.$nextTick(() => {
  //       this.scroll.refresh()
  //     })
  //   },
  //   'content.toggle' (onlyContent) {
  //     this.onlyContent = onlyContent
  //     this.$nextTick(() => {
  //       this.scroll.refresh()
  //     })
  //   }
  // },
  // filters: {
  //   // 用一个js模块去实现这个函数（js模块化编程的思想）
  //   formatDate (time) {
  //     let date = new Date(time)
  //     return formatDate(date, 'yyyy-MM-dd hh:mm')
  //   }
  // },
  components: {
    cartcontrol,
    split,
    ratingselect
  }
}
</script>
<style>
.food {
  position: fixed; /* 覆盖了整个屏幕 */
  top: 0;
  left: 0;
  bottom: 48px;
  z-index: 30;
  width: 100%;
  background: #fff;
}
.food .image-header {
  position: relative;
  width: 100%;
  height: 0; /* 为了优化图片的加载 */
  padding-top: 100%; /* 为了优化图片的加载 这个百分比是相对于这个盒子去计算的，就会等于宽度 */
}
.food .image-header img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.food .image-header .back {
  position: absolute;
  top: 10px;
  left: 0;
}
.food .image-header .back .icon-arrow_lift {
  display: block;
  font-size: 20px;
  color: #fff;
}
.food .content {
  padding: 18px;
  position: relative;
}
.food .content .title {
  line-height: 14px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(7, 17, 27)
}
.food .content .detail {
  margin-bottom: 18px;
  line-height: 10px;
  height: 10px;
  font-size: 0; /* 两个span */
}
.food .content .detail .sell-count{
  font-size: 10px;
  color: rgb(147, 153, 159);
  margin-right: 12px;
}
.food .content .detail .rating {
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.food .content .price {
  font-weight: 700;
  line-height: 24px;
}
.food .content .price .now {
  margin-right: 8px;
  font-size: 14px;
  color: rgb(240, 20, 20);
}
.food .content .price .old {
  text-decoration: line-through;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.food .content .cartcontrol-wrapper {
  position: absolute;
  right: 12px;
  bottom: 12px;
}
.food .content .buy {
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 10;
  height: 24px;
  line-height: 24px;
  padding: 0 12px;
  box-sizing: border-box;
  font-size: 10px;
  border-radius: 12px;
  color: #fff;
  background: rgb(0, 160, 220)
}
.food .info {
  padding: 18px;
}
.food .info .title {
  line-height: 14px;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(7, 17, 27);
}
.food .info .text {
  line-height: 24px;
  padding: 0 8px;
  font-size: 12px;
  color: rgb(77, 85, 93);
}
.food .rating {
  padding-top: 18px; /* 不设置全padding的原因：有一条线 */
}
.food .rating .title {
  line-height: 14px;
  margin-left: 18px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(7, 17, 27);
}
.food .rating .rating-wrapper {
  padding: 0 18px;
}
.food .rating .rating-wrapper .rating-item {
  position: relative;
  padding: 16px 0;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.food .rating .rating-wrapper .rating-item .user {
  position: absolute;
  right: 0;
  top: 16px; /* 虽然有上面padding，但是padding不会影响到绝对定位 */
  line-height: 12px;
  font-size: 0;
}
.food .rating .rating-wrapper .rating-item .user .name {
  display: inline-block;
  vertical-align: top;
  margin-right: 6px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.food .rating .rating-wrapper .rating-item .user .avatar {
  border-radius: 50%;
}
.food .rating .rating-wrapper .rating-item .time {
  margin-bottom: 6px;
  line-height: 12px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.food .rating .rating-wrapper .rating-item .text {
  line-height: 12px;
  font-size: 12px;
  color: rgb(7, 17, 27);
}
.food .rating .rating-wrapper .rating-item .text .icon {
  margin-right: 4px;
  line-height: 24px;
  font-size: 12px;
}
.food .rating .rating-wrapper .rating-item .text .icon-thumb_up {
  color: rgb(0, 160, 220);
}
.food .rating .rating-wrapper .rating-item .text .icon-thumb_down {
  color: rgb(147, 153, 159);
}
.food .rating .rating-wrapper .no-rating {
  padding: 16px 0;
  font-size: 12px;
  color: rgb(147, 153, 159);
}
</style>
