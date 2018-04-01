<template>
  <div class="cartcontrol">
    <div class="cart-decrease icon-remove_circlr_outline" v-show="food.count>0"
    @click.stop.prevent="decreaseCart">减</div>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCard">加</div>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  props: {
    food: {
      type: Object
    }
  },
  // created () {
  //   console.log(this.food)
  // },
  methods: {
    addCard () {
      // if (!event._constructed) {
      //   return
      // }
      console.log('click')
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
        // this.food.count = 1
      } else {
        this.food.count++
      }
    },
    decreaseCart () {
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>
<style>
.cartcontrol {
  font-size: 0;
}
.cart-decrease,.cart-add {
  display: inline-block;
  line-height: 24px;
  font-size: 24px;
  padding: 6px; /* 为了美观，按钮很小，为了用户体验，给它加一个padding，这样点到周围也能实现按钮 */
  color: rgb(0, 160, 220);
}
.cart-count {
  display: inline-block;
  vertical-align: top;
  width: 12px;
  padding-top: 6px;
  line-height: 24px;
  text-align: center;
  font-size: 10px;
  color: rgb(147, 153, 159)
}
/* .cart-add {
  display: inline-block;
  line-height: 24px;
  font-size: 24px;
  padding: 6px;
  color: rgb(0, 160, 220);
} */
</style>
