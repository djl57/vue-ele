<template>
  <div class="title">
    <!-- 用div而不用span是因为有的安卓浏览器下它的宽度样式会有兼容性问题，所以用block元素去写他的布局 -->
    <div class="line"></div>
    <div class="text">{{text}}</div>
    <div class="line"></div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String
    }
  }
}
</script>
<style>
  .header .detail .detail-wrapper .detail-main .title {
    display: flex;
    width: 80%;
    margin: 28px auto 24px auto;
  }
  .header .detail .detail-wrapper .detail-main .title .line {
    /* 不用担心flex的兼容性问题，因为vue自带的一个postcss工具会给那个不兼容的代码自动添加一些兼容性的代码 */
    flex: 1;
    position: relative;
    top: -6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  .header .detail .detail-wrapper .detail-main .title .text {
    /* 不需要设置flex，因为它会因为它的内容自动铺开 */
    padding: 0 12px;
    font-size: 14px;
    font-weight: 700;
  }
</style>
