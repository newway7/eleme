<template>
  <div class="seller" ref="seller">
     <div class="seller-content">
       <div class="overview">
         <h1 class="title">{{seller.name}}</h1>
         <div class="desc">
           <star :size="36" :score="seller.score"></star>
           <span class="text">({{seller.ratingCount}})</span>
           <span class="text">月售{{seller.sellCount}}单</span>
         </div>
         <div class="remark">
           <div class="block">
             <h1 class="title">起送价</h1>
             <div class="content">
               <span class="stress">{{seller.minPrice}}</span>元
             </div>
           </div>
           <div class="block">
             <h1 class="title">商家配送</h1>
             <div class="content">
               <span class="stress">{{seller.deliveryPrice}}</span>元
             </div>
           </div>
           <div class="block">
             <h1 class="title">平均配送时间</h1>
             <div class="content">
               <span class="stress">{{seller.deliveryTime}}</span>分钟
             </div>
           </div>
         </div>
         <div class="favorite" @click="toggleFavorite">
           <span class="icon-favorite" :class="{'active': favorite}"></span>
           <div class="text">{{favoriteText}}</div>
         </div>
       </div>
       <div class="split"></div>
       <div class="bulletin">
         <h1 class="title">公告与活动</h1>
         <div class="content-wrapper">
           <p class="content">{{seller.bulletin}}</p>
         </div>
         <ul v-if="seller.supports" class="supports">
           <li class="support-item" :key="index" v-for="(item,index) in seller.supports">
             <span class="icon" :class="classMap[seller.supports[index].type]"></span>
             <span class="text">{{seller.supports[index].description}}</span>
           </li>
         </ul>
       </div>
       <div class="split"></div>
       <div class="pic">
         <h1 class="title">商家实景</h1>
         <div class="pic-wrapper" ref="picWrapper">
           <ul class="pics" ref="pic">
             <li v-for="(pic,index) in seller.pics" :key='index' class="pic-item">
               <img :src="pic" width="120" height="90">
             </li>
           </ul>
         </div>
       </div>
       <div class="split"></div>
       <div class="info">
         <h1 class="title">商家信息</h1>
         <ul class="info-content">
           <li v-for="(info,index) in seller.infos" :key='index' class="info-item">{{info}}</li>
         </ul>
       </div>
     </div>
  </div>
</template>

<script>
import star from '../../components/star/star'
import BScroll from 'better-scroll'
import {saveToLocal, loadFromLocal} from '../../assets/js/store'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      favorite: (() => {
        // 读取favorate数据
        return loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
  },
  mounted () {
    this.scroll = new BScroll(this.$refs.seller, {
      click: true
    })
    this._initPics()
  },
  methods: {
    _initPics () {
      if (this.seller.pics) {
        let picWidth = 120
        let margin = 6
        this.$refs.pic.style.width = (picWidth + margin) * this.seller.pics.length - margin + 'px'
        this.$nextTick(() => {
          if (!this.picWrapperScroll) {
            this.picWrapperScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,//开启横向滚动
              eventPassthrough: 'vertical'//纵向滚动
            })
          } else {
            this.picWrapperScroll.refresh()
            //重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
          }
        })
      }
    },
    toggleFavorite () {
      this.favorite = !this.favorite
      // 存储favorate数据
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    }
  },
  components: {
    star
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/mixin.styl'

  .seller
    position: absolute
    top: 3.52rem
    left: 0
    right: 0
    bottom: 0
    
    margin: 0 auto
    overflow: hidden
    .seller-content
      .overview
        border-top:0.02rem solid rgba(7,17,27,0.1)
        padding: 0.36rem
        position: relative
        .title
          font-size: 0.28rem
          line-height: 0.28rem
          color: rgb(7,17,27)
          margin-bottom: 0.16rem
        .desc
          font-size: 0
          padding-bottom: 0.36rem
          margin-bottom: 0.36rem
          border-bottom:0.02rem solid rgba(7,17,27,.1)
          .star
            display: inline-block
            margin-right: 0.16rem
            vertical-align: top
          .text
            vertical-align: top
            display: inline-block
            font-size: 0.2rem
            color: rgb(77,85,93)
            line-height: 0.36rem
            margin-right: 0.24rem
        .remark
          display: flex
          .block
            flex: 1
            text-align: center
            border-right: 0.02rem solid rgba(7,17,27,.1)
            &:last-child
              border-right: none
            .title
              font-size: 0.2rem
              line-height: 0.2rem
              color: rgb(147,153,159)
              margin-bottom: 0.08rem
            .content
              font-size: 0.2rem
              color: rgb(7,17,27)
              .stress
                font-size: 0.48rem
                line-height: 0.48rem
        .favorite
          position: absolute
          width: 1rem
          right: 0.24rem
          top: 0.36rem
          text-align: center
          font-size: 0
          .icon-favorite
            display: inline-block
            color: #d4d6d9
            font-size: 0.48rem
            line-height: 0.48rem
            margin-bottom: 0.08rem
            &.active
              color: rgb(240,20,20)
          .text
            font-size: 0.2rem
            line-height: 0.2rem
            color: rgb(77,85,93)
      .split
        width: 100%
        height: 0.32rem
        border-top: 0.02rem solid rgba(7,17,27,0.1)
        border-bottom: 0.02rem solid rgba(7,17,27,0.1)
        background: #f3f5f7
      .bulletin
        padding: 0.36rem 0.36rem 0 0.36rem
        .title
          font-size: 0.28rem
          line-height: 0.28rem
          color: rgb(7,17,27)
          margin-bottom: 0.16rem
        .content-wrapper
          padding: 0 0.24rem 0.32rem 0.24rem
          
          .content
            font-size: 0.24rem
            font-weight: 200
            color: rgb(240,20,20)
            line-height: 0.48rem
        .supports
          .support-item
            padding: 0.32rem 0.24rem
            font-size: 0
            border-top:0.02rem solid rgba(7,17,27,.1)
            &:last-child:after
              border-top: none
            .icon
              vertical-align: top
              display: inline-block
              width: 0.32rem
              height: 0.32rem
              margin-right: 0.12rem
              background-size: 0.32rem 0.32rem
              background-repeat: no-repeat
              &.decrease
                bg-image('decrease_4')
              &.discount
                bg-image('discount_4')
              &.guarantee
                bg-image('guarantee_4')
              &.invoice
                bg-image('invoice_4')
              &.special
                bg-image('special_4')
            .text
              font-size: 0.24rem
              line-height: 0.32rem
              color: rgb(7,17,27)
              font-weight: 200
      .pic
        padding: 0.36rem
        .title
          font-size: 0.28rem
          line-height: 0.28rem
          color: rgb(7,17,27)
          margin-bottom: 0.24rem
        .pic-wrapper
          white-space: nowrap
          font-size: 0
          .pic-item
            width: 2.4rem
            height: 1.8rem
            display: inline-block
            margin-right: 0.12rem
            &:last-child
              margin-right: 0
      .info
        padding: 0.36rem 0.36rem 0 0.36rem
        .title
          font-size: 0.28rem
          line-height: 0.28rem
          color: rgb(7,17,27)
          padding-bottom: 0.24rem
         
        .info-content
          .info-item
            padding: 0.32rem 0.24rem
            font-size: 0.24rem
            line-height: 0.32rem
            color: rgb(7,17,27)
            font-weight: 200
            border-top:0.02rem solid rgba(7,17,27,.1)
            &:last-child:after
              border-top: none
</style>
