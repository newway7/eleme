<template>
 <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar">
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟送达
          </div>
          <div v-if="seller.supports" class="support">
            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
        </div>
        <div v-if="seller.supports" class="support-count" @click="showDetail">
          <span class="count">{{seller.supports.length}}</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
        <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" :key='index' v-for="(item,index) in seller.supports">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">
                {{seller.bulletin}}
              </p>
            </div>
          </div>
        </div>
      <div class="detail-close" @click="hideDetail">
        <i class="icon-close"></i>
      </div>
      </div>
    </transition>

 </div>
</template>

<script>
  import star from '../star/star'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        detailShow: false
      }
    },
    methods: {
      showDetail () {
        this.detailShow = true
      },
      hideDetail () {
        this.detailShow = false
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
    },
    components: {
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/mixin'

  .header
    overflow: hidden
    position: relative
    color: #fff
    background: rgba(7,17,27,.5)
    .content-wrapper
      position: relative
      font-size: 0
      padding: 0.48rem 0.24rem 0.36rem 0.48rem
      .avatar
        display: flex;
        font-size: 0;
        vertical-align: top
        display: inline-block
        overflow: hidden;
        img
          width: 1.28rem;
          height: 1.28rem;
          border-radius: 0.04rem
      .content
        
        margin-left: 0.32rem
        display: inline-block;
        vertical-align: top
        
        .title
          line-height :0.36rem
          font-size: 0.28rem
          margin: 0.04rem 0 0.16rem 0
          .brand
            vertical-align: top
            display: inline-block
            width: 0.60rem
            height: 0.36rem
            bg-image('brand')
            background-size: 0.60rem 0.36rem
            background-repeat: no-repeat
          .name
            display: inline-block;
            margin-left: 0.12rem
            font-size: 0.32rem
            line-height: 0.36rem
            font-weight: bold
        .description
          margin-bottom: 0.2rem
          line-height: 0.24rem
          font-size: 0.24rem
        .support
          font-size: 0.24rem
          .icon
            vertical-align: top
            display: inline-block
            width: 0.24rem
            height: 0.24rem
            margin-right: 0.08rem
            background-size: 0.24rem 0.24rem
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
              line-height: 0.24rem
              font-size: 0.2rem
      .support-count
        position: absolute
        right: 0.24rem
        bottom: 0.36rem
        padding: 0 0.16rem
        height: 0.48rem
        line-height: 0.48rem
        border-radius: 0.28rem
        background: rgba(0,0,0,.2)
        text-align: center
        .count
          vertical-align: top
          font-size: 0.2rem
        .icon-keyboard_arrow_right
          margin-left: 0.04rem
          line-height: 0.48rem
          font-size: 0.2rem
    .bulletin-wrapper
      position: relative
      height: 0.56rem
      line-height: 0.56rem
      padding: 0 0.44rem 0 0.24rem
      font-size: 0.2rem;
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis

      background: rgba(7,17,27,.2)
      .bulletin-title
        vertical-align: top
        margin-top: 0.16rem
        display: inline-block
        width: 0.44rem
        height: 0.24rem
        bg-image('bulletin')
        background-size: 0.44rem 0.24rem
        background-repeat: no-repeat
      .bulletin-text
        vertical-align: top
        margin: 0 0.08rem
        font-size: 0.2rem
      .icon-keyboard_arrow_right
        position: absolute
        font-size: 0.2rem
        right: 0.24rem
        top: 0.16rem
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      filter: blur(0.2rem)
    .detail
      z-index: 100
      position: fixed
      
      top: 0
      left: 0
      right: 0
      margin: 0 auto
      width: 100%
      height: 100%
      overflow: auto
      background: rgba(7,17,27,.8)
      backdrop-filter: blur(0.2rem)
      &.fade-enter-active, &.fade-leave-active
        transition: opacity .5s
      &.fade-enter, &.fade-leave-to /* .fade-leave-active in below version 2.1.8 */
        opacity: 0
      .detail-wrapper
        min-height: 100%
        width: 100%
        .detail-main
          margin-top: 1.28rem
          padding-bottom: 1.28rem
          .name
            line-height: 0.32rem
            text-align: center
            font-size: 0.32rem
            font-weight: 700
          .star-wrapper
            margin-top: 0.32rem
            padding: 0.04rem 0
            text-align: center
          .title
            display: flex
            width: 80%
            margin: 0.56rem auto 0.48rem
            .line
              flex: 1
              position: relative
              top: -0.12rem
              border-bottom: 0.02rem solid rgba(255,255,255,.2)
            .text
              padding: 0 0.24rem
              font-size: 0.28rem
              font-weight: 700
          .supports
            width: 80%
            padding: 0 0.24rem
            font-size: 0
            margin: 0 auto
            .icon
              display: inline-block
              width: 0.32rem
              height: 0.32rem
              vertical-align: top
              background-size: 0.32rem 0.32rem
              background-repeat: no-repeat
              margin-right: 0.12rem
              margin-bottom: 0.24rem
              &:last-child
                margin-bottom: 0
              &.decrease
                bg-image('decrease_2')
              &.discount
                bg-image('discount_2')
              &.guarantee
                bg-image('guarantee_2')
              &.invoice
                bg-image('invoice_2')
              &.special
                bg-image('special_2')
            .text
              font-size: 0.24rem
              font-weight: 200
              line-height: 0.32rem
              display: inline-block
          .bulletin
            width: 80%
            padding: 0 0.24rem
            margin: 0 auto
            .content
              font-weight: 200
              font-size: 0.24rem
              line-height: 0.48rem
              word-break: break-all
      .detail-close
        position: relative
        width: 0.64rem
        height: 0.64rem
        margin: -1.28rem auto 0 auto
        clear: both
        font-size: 0.64rem
</style>
