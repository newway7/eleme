<template>
  <transition name="bounce">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back">
            <i class="icon-close" @click="hideFood"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <div class="split" v-show="food.info"></div>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <div class="split"></div>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :ratings="food.ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc" @selecttype="selecttype" @content="content"></ratingselect>
        </div>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType, rating.text)" :key='index' v-for="(rating,index) in food.ratings" class="rating-item">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" :src="rating.avatar" width="12" height="12">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span class="icon" :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></span>
                <span class="text-content">{{rating.text}}</span>
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
            暂无评价
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
 import Vue from 'vue'
 import BScroll from 'better-scroll'
 import { eventBus } from '../../components/event-bus'
 import cartcontrol from '../../components/cartcontrol/cartcontrol.vue'
 import ratingselect from '../../components/ratingselect/ratingselect.vue'
 import {formatDate} from '../../assets/js/formatDate'

 const ALL = 2

 export default {
   props: {
     food: {
       type: Object
     }
   },
   data () {
     return {
       showFlag: false,
       selectType: ALL,
       onlyContent: true,
       desc: {
         all: '全部',
         positive: '推荐',
         negative: '吐槽'
       }
     }
   },
   methods: {
     show () {
       this.showFlag = true
       this.$nextTick(() => {
         if (!this.foodScroll) {
           this.foodScroll = new BScroll(this.$refs.food, {
             click: true
           })
         } else {
           this.foodScroll.refresh()
         }
       })
     },
     hideFood () {
       this.showFlag = false
     },
     addFirst (event) {
       // 优化体验，异步传递当前点击文档
       this.$nextTick(() => {
         eventBus.$emit('addcart', event.target)
       })
       Vue.set(this.food, 'count', 1)
     },
     selecttype (type) {
       this.selectType = type
       // 手动刷新better-scroll重新计算页面高度
       this.$nextTick(() => {
         this.foodScroll.refresh()
       })
     },
     content () {
       this.onlyContent = !this.onlyContent
       // 手动刷新better-scroll重新计算页面高度
       this.$nextTick(() => {
         this.foodScroll.refresh()
       })
     },
     needShow (type, text) {
       if (this.onlyContent && !text) {
         return false
       }
       if (this.selectType === ALL) {
         return true
       } else {
         return type === this.selectType
       }
     }
   },
   filters: {
     formatDate (time) {
       let date = new Date(time)
       return formatDate(date, 'yyyy-MM-dd hh:mm')
     }
   },
   components: {
     cartcontrol,
     ratingselect
   }
 }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/mixin.styl'

  .food
    
    position: fixed
    width: 100%
    z-index: 2
    top: 0
    left: 0
    right: 0
    margin: 0 auto
    bottom: 0.96rem
    background: #fff
    &.bounce-enter-active
      animation: bounce-in .3s
    &.bounce-leave-active
      animation: bounce-in .3s reverse
    @keyframes bounce-in
      0%
        transform: scale(0)
      100%
        transform: scale(1)
    .food-content
      .image-header
        position: relative
        width: 100%
        height: 0
        padding-bottom: 100%
        img
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
        .back
          position: absolute
          top: 0.24rem
          left: 0
          .icon-close
            display: inline-block
            padding: 0.20rem
            color: #fff
            font-size: 0.4rem
      .content
        position: relative
        padding: 0.36rem
        .title
          font-size: 0.28rem
          line-height: 0.28rem
          font-weight: 700
          color: rgb(7,17,27)
          margin-bottom: 0.16rem
        .detail
          font-size: 0.20rem
          line-height: 0.20rem
          color: rgb(147,153,159)
          margin-bottom: 0.36rem
          .sell-count
            margin-right: 0.24rem
        .price
          font-size: 0.28rem
          font-weight: 700
          line-height: 0.48rem
          color: rgb(240,20,20)
          .old
            font-size: 0.20rem
            font-weight: 700
            line-height: 0.48rem
            color: rgb(147,143,159)
            text-decoration: line-through
            margin-left: 0.20rem
        .cartcontrol-wrapper
          position: absolute
          right: 0.24rem
          bottom: 0.24rem
        .buy
          position: absolute
          right: 0.36rem
          bottom: 0.36rem
          padding: 0 0.24rem
          height: 0.48rem
          line-height: 0.48rem
          background: rgb(0,160,220)
          font-size: 0.20rem
          color: rgb(255,255,255)
          border-radius: 0.24rem
          opacity: 1
          &.fade-enter-active, &.fade-leave-active
             transition: opacity .5s
          &.fade-enter, &.fade-leave-to /* .fade-leave-active in below version 2.1.8 */
             opacity: 0
      .split
        height: 0.32rem
        border-top: 0.02rem solid rgba(7,17,27,0.1)
        border-bottom: 0.02rem solid rgba(7,17,27,0.1)
        background: #f3f5f7
      .info
        padding: 0.36rem
        .title
          font-size: 0.28rem
          line-height: 0.28rem
          margin-bottom: 0.12rem
          color: rgb(7,17,27)
          font-weight: 500
        .text
          padding: 0 0.16rem
          font-size: 0.24rem
          font-weight: 200
          color: rgb(77,85,93)
          line-height: 0.48rem
      .rating
        padding: 0.36rem 0.36rem 0.24rem 0.36rem
        border-bottom:0.02rem solid rgba(7,17,27,.1)
        .title
          font-size: 0.28rem
          line-height: 0.28rem
          margin-bottom: 0.12rem
          color: rgb(7,17,27)
          font-weight: 500
      .rating-wrapper
        padding: 0 0.36rem
        .rating-item
          padding: 0.32rem 0
          border-top:0.02rem solid rgba(7,17,27,.1)
          .user
            position: absolute
            right: 0
            top: 0.32rem
            font-size: 0
            .name
              display: inline-block
              margin-right: 0.12rem
              font-size: 0.20rem
              line-height: 0.24rem
              color: rgb(147,153,159)
              vertical-align: top
            .avatar
              border-radius: 50%
              vertical-align: top
          .time
            font-size: 0.20rem
            color: rgb(147,153,159)
            line-height: 0.24rem
          .text
            margin-top: 0.12rem
            font-size: 0
            .icon-thumb_down
              display: inline-block
              margin-right: 0.08rem
              font-size: 0.24rem
              color: rgb(147,153,159)
              line-height: 0.32rem
              vertical-align: top
            .icon-thumb_up
              display: inline-block
              margin-right: 0.08rem
              font-size: 0.24rem
              color: rgb(0,160,220)
              line-height: 0.32rem
              vertical-align: top
            .text-content
              font-size: 0.24rem
              color: rgb(7,17,27)
              line-height: 0.32rem
        .no-rating
          padding: 0.24rem 0
          font-size: 0.24rem
          color: rgb(147,153,159)

</style>
