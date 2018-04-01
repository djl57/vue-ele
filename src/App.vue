<template>
  <div id="app">
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"/>
    </keep-alive>
  </div>
</template>

<script>
import {urlParse} from './common/js/util'
import header from './components/header/header'

const ERR_OK = 0

export default {
  name: 'App',
  data () {
    return {
      seller: {
        // 收藏商家缓存到前端的localstorage中
        id: (() => {
          let queryParam = urlParse()
          return queryParam.id
        })()
      }
    }
  },
  // part
  created () {
    this.axios.get('/api/seller?id=' + this.seller.id)
      .then((response) => {
        // console.log(response.data.data)
        if (response.data.errno === ERR_OK) {
          // this.seller = response.data.data
          this.seller = Object.assign({}, this.seller, response.data.data)
          // console.log(this.seller.id)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // part
  components: {
    'v-header': header
  }
}
</script>

<style>
/* Flex布局 */
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid rgba(77, 2, 17, 0.1);
  }
  .tab .tab-item {
    flex: 1;
    text-align: center;
  }
  .tab a {
    display: block;
    color: rgb(77, 85, 93);
  }
  .tab .active {
    color: rgb(240, 20, 20);
  }
</style>
