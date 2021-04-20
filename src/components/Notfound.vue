<template>
  <div class="notfound">
    <div class="head404"></div>
    <div class="txtbg404">
      <div class="txtbox">
        <p>对不起，您请求的页面不存在、或已被删除、或暂时不可用</p>
        <p class="paddingbox">请点击以下链接继续浏览网页</p>
        <p>
          》
          <span @click="lastpage">返回上一页面</span>
        </p>
        <p>
          》
          <span @click="root">返回网站首页</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    lastpage () {
      this.$router.go(-1)
    },
    root () {
      this.$router.push('/home')
    }
  }
}
</script>
<style>
.notfound {
  background-color: rgb(73, 73, 73);
  height: 100%;
  margin-top: -50px;
  padding-top: 50px;
}
.head404 {
  width: 580px;
  height: 234px;
  margin: 50px auto 0 auto;
  background: url(https://www.daixiaorui.com/Public/images/head404.png)
    no-repeat;
}

.txtbg404 {
  width: 499px;
  height: 169px;
  margin: 10px auto 0 auto;
  background: url(https://www.daixiaorui.com/Public/images/txtbg404.png)
    no-repeat;
}

.txtbg404 .txtbox {
  width: 390px;
  position: relative;
  top: 30px;
  left: 60px;
  color: #eee;
  font-size: 13px;
}

.txtbg404 .txtbox p {
  margin: 5px 0;
  line-height: 18px;
}

.txtbg404 .txtbox .paddingbox {
  padding-top: 15px;
}

.txtbg404 .txtbox p a {
  color: #eee;
  text-decoration: none;
}

.txtbg404 .txtbox p a:hover {
  color: #fc9d1d;
  text-decoration: underline;
}
span:hover {
  cursor: pointer;
}
</style>
