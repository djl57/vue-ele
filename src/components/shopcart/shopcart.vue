<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
              <!-- 注意这个：class的格式，特别是{} -->
            <div class="logo" :class="{'highlight':totalCount>0}">
              <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}">购</span>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="{'enough':totalPrice>=20}">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="(food,index) in selectFoods" :key="index">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price * food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="list-mask" @click="hideList" v-show="listShow"></div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'// better-scroll
import cartcontrol from '@/components/cartcontrol/cartcontrol'

export default {
  props: {
    selectFoods: {
      type: Array,
      default () { // 这里的default需要是一个函数
        return [
          {
            price: 10,
            count: 0
          }
        ]
      }
    },
    deliveryPrice: {
      type: Number
    //   default: 0 // 默认值
    },
    minPrice: {
      type: Number
    //   default: 0 // 默认值
    }
  },
  data () {
    return {
      fold: true
    }
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () { // 所选商品的总数
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () { // 跟totalPrice有关
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送` // 相当于'￥'+this.minPrice+'元起送',es6的一个新语法
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    listShow () {
      if (!this.totalCount) {
        /* eslint-disable */
        this.fold = true
        return false
      }
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) { // 防止每次scroll修改都new一下
            this.scroll = new BScroll(this.$refs.listContent,{
              click: true
            })
          } else {
            this.scroll.refresh() // refresh接口重新渲染视口和listContent的高度差来决定是否滚动
          }
        })
      } 
      return show
    }
  },
  components: {
    cartcontrol
  },
  methods: {
    toggleList () {
      if (!this.totalCount) {
        return // 说明点击无效
      }
      this.fold = !this.fold
    },
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0
      }) 
    },
    hideList () {
      this.fold = true
    },
    pay () {
      if (this.totalPrice<this.minPrice) {
        return
      } else {
        window.alert(`支付￥${this.totalPrice}元`)
      }
    }
  }
}
</script>
<style>
.shopcart {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
}
.shopcart .content {
    position: relative;
    display: flex;
    background: #141d27;
    color: rgba(255, 255, 255, 0.4);
}
.shopcart .content .content-left {
    flex: 1;
    font-size: 0; /* 空白 */
}
.shopcart .content .content-left .logo-wrapper {
    display: inline-block;
    position: relative;
    top: -10px;
    margin: 0 12px;
    padding: 6px;
    width: 56px;
    height: 56px;
    box-sizing: border-box;
    vertical-align: top;
    border-radius: 50%;
    background: #141d27;
}
.shopcart .content .content-left .logo-wrapper .logo {
    width: 100%; /* 宽高设为百分百是撑满父元素 */
    height: 100%;
    border-radius: 50%;
    background: #2b343c
}
.shopcart .content .content-left .logo-wrapper .highlight {
    background: rgb(0, 160, 220);
    border-radius: 50%;
}
.shopcart .content .content-left .logo-wrapper .logo .icon-shopping_cart {
    display: block; /* 没有设置这个下面的垂直居中和水平居中是不会生效的，因为行内元素没有宽高 */
    line-height: 44px; /* 垂直居中 跟父元素行高一样*/
    font-size: 24px;
    text-align: center; /* 水平居中 */
    color: #80858a;
}
.shopcart .content .content-left .logo-wrapper .logo .highlight {
    color: #fff;
}
.shopcart .content .content-left .logo-wrapper .num {
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 16px;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    background: rgb(240, 20, 20);
    box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.4)
}
.shopcart .content .content-left .price {
    display: inline-block;
    vertical-align: top;
    margin-top: 12px; /* 使其垂直居中 */
    line-height: 24px;
    padding-right: 12px;
    box-sizing: border-box;
    border-right: 1px solid rgba(255, 255, 255, 0.1); /* 因为有这个线，所以不设置line-height：48；来使他垂直居中 */
    font-size: 16px; /* 因为父元素设置为0了 */
    font-weight: 700;
    /* color: rgba(255, 255, 255, 0.4) */
}
.shopcart .content .content-left .highlight {
    color: #fff;
}
.shopcart .content .content-left .desc{
    display: inline-block;
    vertical-align: top;
    margin: 12px 0 0 12px;
    line-height: 24px;
    font-size: 10px;
    /* color: rgba(255, 255, 255, 0.4); */
}
.shopcart .content .content-right {
    flex: 0 0 105px;
    width: 105px;
}
.shopcart .content .content-right .pay {
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 12px;
    /* color: rgba(255, 255, 255, 0.4) */
    font-weight: 700;
    background: #2b333b;
}
.shopcart .content .content-right .enough {
    background: #00b43c;
    color: #fff;
}
.shopcart .shopcart-list {
  position: absolute; /* 相对于shopcart的绝对定位 */
  bottom: 48px;
  left: 0;
  z-index: -1;
  width: 100%;
}
.shopcart .shopcart-list .list-header {
  height: 40px;
  line-height: 40px;
  padding: 0 18px;
  background: #f3f5f7;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1)
}
.shopcart .shopcart-list .list-header .title {
  float: left;
  font-size: 14px;
  color: rgb(7, 17, 27);
}
.shopcart .shopcart-list .list-header .empty {
  float: right;
  font-size: 12px;
  color: rgb(0, 160, 220)
}
.shopcart .shopcart-list .list-content {
  padding: 0 18px;
  max-height: 217px;
  overflow: hidden;
  background: #fff;
}
.shopcart .shopcart-list .list-content .food {
  position: relative; /* 作为下面的相对位置 */
  padding: 12px 0;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.shopcart .shopcart-list .list-content .food .name{
  line-height: 24px;
  font-size: 14px;
  color: rgb(7, 17, 27)
}
.shopcart .shopcart-list .list-content .food .price {
  position: absolute;
  right: 90px;
  bottom: 12px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(240, 20, 20);
}
.shopcart .shopcart-list .list-content .food .cartcontrol-wrapper {
  position: absolute;
  right: 0;
  bottom: 6px;
}
.list-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  /* backdrop-filter: blur(10px); */
  background: rgba(1, 17, 27, 0.6);
}
</style>
