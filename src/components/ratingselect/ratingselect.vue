<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span class="positive">
        <span @click="select(2)" class="block" :class="{'active': selectType === 2}">
          {{desc.all}}
          <span class="count">{{ratings.length}}</span>
        </span>
      </span>
      <span class="positive">
        <span @click="select(0)" class="block" :class="{'active': selectType === 0}">
          {{desc.positive}}
          <span class="count"><!-- {{positives.length}} -->1</span>
        </span>
      </span>
      <span class="negative">
        <span @click="select(1)" class="block" :class="{'active': selectType === 1}">
          {{desc.negative}}
          <span class="count"><!-- {{negatives.length}} -->1</span>
        </span>
      </span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle icon">勾</span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
<script>
// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2

export default {
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  //   computed: {
  //     positives () {
  //       // filter用于过滤,这样就过滤拿到了所有positive评价的数据
  //       return this.rating.filter((rating) => {
  //         return rating.rateType === POSITIVE
  //       })
  //     },
  //     negatives () {
  //       // filter用于过滤,这样就过滤拿到了所有positive评价的数据
  //       return this.rating.filter((rating) => {
  //         return rating.rateType === NEGATIVE
  //       })
  //     }
  //   },
  methods: {
    select (type) {
      this.selectType = type
    //   this.$dispatch('ratingtype.select', type)
    },
    toggleContent () { // 来回切换Content
      this.onlyContent = !this.onlyContent
    //   this.$dispatch('content.toggle', this.onlyContent)
    }
  }
}
</script>
<style>
.ratingselect .rating-type {
  padding: 18px 0;
  margin: 0 18px; /* 因为有一个线，所以不写在padding里 */
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  font-size: 0;
}
.ratingselect .rating-type .block {
  display: inline-block;
  padding: 8px 12px;
  margin-right: 8px;
  border-radius: 1px;
  line-height: 16px;
  font-size: 12px;
  color: rgb(77, 85, 93);
}
.ratingselect .rating-type .active {
  color: #fff;
}
.ratingselect .rating-type .block .count {
  margin-left: 2px;
  font-size: 8px;
}
.ratingselect .rating-type .positive {
  background: rgba(0, 160, 220, 0.2);
}
.ratingselect .rating-type .positive .active {
  background: rgb(0, 160, 220);
}
.ratingselect .rating-type .negative {
  background: rgba(77, 85, 93, 0.2);
}
.ratingselect .rating-type .negative .active {
  background: rgb(77, 85, 93);
}
.ratingselect .switch {
  padding: 12px 18px;
  line-height: 24px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  color: rgb(147, 153, 159);
  font-size: 0;
}
.ratingselect .switch .icon {
  display: inline-block;
  vertical-align: top; /* 要设置这个必先设置 display: inline-block; */
  margin-right: 4px;
  font-size: 24px;
}
.ratingselect .switch .text {
  font-size: 12px;
}
.ratingselect .on .icon {
  color: #00c850;
}
</style>
