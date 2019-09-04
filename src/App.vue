<template>
  <div id="app">
     <v-header :seller="seller"></v-header>
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
     <keep-alive><router-view :seller="seller"></router-view></keep-alive>
  </div>
</template>

<script>
  import header from './components/header/header'
  import {urlParse} from './assets/js/util.js'
  import data from './assets/json/data.json'

//  const ERR_OK = 0
//  const debug = process.env.NODE_ENV !== 'production'

  export default {
    data () {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse()
            return queryParam.id
          })()
        }
      }
    },
    created () {
//      const url = debug ? '/api/seller' : 'http://ustbhuangyi.com/sell/api/seller'
//      this.$http(url + '?id=' + this.seller.id).then((response) => {
//        response = response.data
//        if (response.errno === ERR_OK) {
//          // 给this.seller扩展属性，保留id属性
//          this.seller = Object.assign({}, this.seller, response.data)
//          console.log(this.seller.id)
//        }
//      })
      this.seller = data.seller
    },
    components: {
      'v-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './assets/stylus/mixin.styl'
    .tab
      display: flex
      width: 100%
      height: 0.8rem
      line-height: 0.8rem
      
      border-top:0.02rem solid rgba(7,17,27,.1)
      .tab-item
        flex: 1
        text-align: center
        & > a
          text-decoration :none
          display: block
          font-size: 0.28rem
          line-height:0.8rem
          color: rgb(77,85,93)
          &.active
            color: rgb(240,20,20)
</style>
