<template>
  <div class="goods">
    <!-- better-scroll -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <!-- :class传入一个current对象 -->
        <!-- 我们遍历goods的时候会有一个index值，当currentIndex与index相等的时候会有一个current样式 -->
        <li v-for="(item,index) in goods" :key="index" class="menu-item"
        :class="{'current':currentIndex === index}" @click="selectMenu(index)">
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!-- better-scroll -->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <!-- class加一个-hook后缀用来表示它只是用来被js选择，并没有实际的样式 -->
        <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food)" v-for="(food,index) in item.foods" :key="index" class="food-item">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script>
import BScroll from 'better-scroll'// better-scroll
import shopcart from '@/components/shopcart/shopcart'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
import food from '@/components/food/food'

const ERR_OK = 0

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [], // 每个区间的高度组成的数组
      scrollY: 0, // 因为要跟踪这个变量，所以定义在data里
      selectedFood: {}
    }
  },
  computed: {
    currentIndex () { // 实时发生变化
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i] // 当前高度
        let height2 = this.listHeight[i + 1] // 下一个高度
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () { // 通过这两层遍历，就能找到所有被选择的food
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) { // 如果它的商品的count值是有，则它已经被选过了
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.axios.get('/api/goods')
      .then((response) => {
        console.log(response.data.data)
        if (response.data.errno === ERR_OK) {
          this.goods = response.data.data
          this.$nextTick(() => { // 这里没听，关于dom的
            this._initScroll()
            this._calculateHeight()
          })
          console.log(this.goods)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // better-scroll
  methods: {
    selectMenu (index) {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index] // index就是我们想要选择的列表
      this.foodsScroll.scrollToElement(el, 300)
    },
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true // 没有这个点击左边没有反应
      })// 取到dom
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3 // 希望能知道scroll实时滚动的位置
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      }) // 通过foodsScroll对象去监听一个事件onscroll
    },
    _calculateHeight () {
      // 用访问原生dom的一些方法去获得高度
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook') // 拿到了food-list-hook元素
      // 拿到的foodList就是li，每个li的高度就是每个区间的高度，即每个foodList的高度就是每个区块的高度
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectFood (food) {
      this.selectedFood = food
      this.$refs.food.show()
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  }
}
</script>

<style>
.goods {
  display: flex;
  position: absolute;
  width: 100%;
  top: 174px; /* header的高度 */
  bottom: 46px; /* 购物车的高度 */
  overflow: hidden;
}
.goods .menu-wrapper {
  flex: 0 0 80px;
   width: 80px; /*如果不写width,在安卓浏览器下会有问题 */
   background: #f3f5f7;
}
/* 能用class写样式就用class，标签的性能比不上class */
.goods .menu-wrapper .menu-item {
  display: table; /* 垂直居中 */
  height: 54px;
  width: 56px;
  line-height: 14px;
  padding: 0 12px;
}
.goods .menu-wrapper .current {
  position: relative;
  margin-top: -1px;
  background: #fff;
  font-weight: 700;
}
.goods .menu-wrapper .current .text {
  border-bottom: none;
}
/* 像这种大量粘贴复制代码的地方就适合做成组件 */
.goods .menu-wrapper .menu-item .icon {
  display: inline-block;
  vertical-align: top;
  width: 12px;
  height: 12px;
  margin-right: 2px;
  background-size: 12px;
  background-repeat: no-repeat;
  }
.menu-item .decrease {
  background-image: url(decrease_3@3x.png);
}
.menu-item .discount {
  background-image: url(discount_3@3x.png);
}
.menu-item .guarantee {
  background-image: url(guarantee_3@3x.png);
}
.menu-item .invoice {
  background-image: url(invoice_3@3x.png);
}
.menu-item .special {
  background-image: url(special_3@3x.png);
}
.goods .menu-wrapper .menu-item .text {
  display: table-cell; /* 垂直居中 */
  width: 56px;
  vertical-align: middle; /* 垂直居中 */
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  font-size: 12px;
}
.goods .foods-wrapper {
  flex: 1; /* 如果没有这个flex，foods-wrapper层没有出来 */
}
.goods .foods-wrapper .title {
  padding-left: 14px;
  height: 26px;
  line-height: 26px;
  border-left: 2px solid #d9dde1;
  font-size: 12px;
  color: rgb(147, 153, 159);
  background: #f3f5f7;
}
.goods .foods-wrapper .food-item {
  display: flex;
  /* margin: 18px; */
  padding: 18px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.goods .foods-wrapper .food-item:last-child {
  border-bottom: none;
}
.goods .foods-wrapper .food-item .icon {
  /* 一般如果是img的话直接在上面写他的weith，height */
  flex: 0 0 57px;
  margin-right: 10px;
}
.goods .foods-wrapper .food-item .content {
  flex: 1;
  position: relative;
}
.goods .foods-wrapper .food-item .content .name {
  margin: 2px 0 8px 0;
  height: 14px;
  line-height: 14px;
  font-size: 14px;
  color: rgb(7, 17, 27)
}
.goods .foods-wrapper .food-item .content .desc {
  margin-bottom: 8px;
  line-height: 12px;
  font-size: 10px;
  color: rgb(147, 153, 159)
}
.goods .foods-wrapper .food-item .content .extra {
  line-height: 10px;
  font-size: 10px;
  color: rgb(147, 153, 159)
}
.goods .foods-wrapper .food-item .content .extra .count {
  margin-right: 10px;
}
.goods .foods-wrapper .food-item .content .price {
  font-weight: 700;
  line-height: 24px;
}
.goods .foods-wrapper .food-item .content .price .now {
  margin-right: 8px;
  font-size: 14px;
  color: rgb(240, 20, 20)
}
.goods .foods-wrapper .food-item .content .price .old {
  text-decoration: line-through;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.goods .foods-wrapper .food-item .content .cartcontrol-wrapper {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
