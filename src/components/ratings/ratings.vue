<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-child">
      <div class="rating-wrapper">
        <div class="rating-left">
          <div class="score">{{seller.score}}</div>
            <div class="title">综合评分</div>
            <div class="rank">高于周边商家{{seller.rankRate}}%</div>
          </div>
          <div class="rating-right">
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <star :size="24" :score="seller.serviceScore"></star>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">商品评分</span>
              <star :size="24" :score="seller.foodScore"></star>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="delivery-wrapper">
              <span class="title">送达时间</span>
              <span class="time">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
      <div class="split"></div>
      <ratingselect :ratings="ratings" :select-type="selectType" :only-content="onlyContent" @selecttype="selecttype" @content="content"></ratingselect>
      <div class="rating-content">
        <ul>
          <li v-for="(rating,index) in ratings" :key='index' class="rating-item" v-show="needShow(rating.rateType, rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content-wrapper">
              <div class="name">{{rating.username}}</div>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="time" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <div class="text">{{rating.text}}</div>
              <div class="recommend" v-show="rating.recommend">
                <span class="icon-thumb_up" v-show="rating.recommend && rating.recommend.length"></span>
                <span  v-for="(item,index) in rating.recommend" :key='index' class="recommend-item">{{item}}</span>
              </div>
              <div class="rate-time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import star from '../../components/star/star.vue'
import ratingselect from '../../components/ratingselect/ratingselect'
import {formatDate} from '../../assets/js/formatDate.js'
import data from '../../assets/json/data.json'

const ALL = 2
// const ERR_OK = 0
// const debug = process.env.NODE_ENV !== 'production'

export default {
  props: {
    seller: Object
  },
  data () {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true
    }
  },
  created () {
//    const url = debug ? '/api/ratings' : 'http://ustbhuangyi.com/sell/api/ratings'
//    this.$http.get(url).then((response) => {
//      response = response.data
//      if (response.errno === ERR_OK) {
//        this.ratings = response.data
//        this.$nextTick(() => {
//          if (!this.ratingScroll) {
//            this.ratingScroll = new BScroll(this.$refs.ratings, {
//              click: true
//            })
//          } else {
//            this.ratingScroll.refresh()
//          }
//        })
//      }
//    })
    this.ratings = data.ratings
    this.$nextTick(() => {
      if (!this.ratingScroll) {
        this.ratingScroll = new BScroll(this.$refs.ratings, {
          click: true
        })
      } else {
        this.ratingScroll.refresh()
      }
    })
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    selecttype (type) {
      this.selectType = type
      // 手动刷新better-scroll重新计算页面高度
      this.$nextTick(() => {
        this.ratingScroll.refresh()
      })
    },
    content () {
      this.onlyContent = !this.onlyContent
      // 手动刷新better-scroll重新计算页面高度
      this.$nextTick(() => {
        this.ratingScroll.refresh()
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
  components: {
    star,
    ratingselect
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/mixin.styl'

  .ratings
    position: absolute
    top: 3.52rem
    left: 0
    bottom: 0
    right: 0
    margin: 0 auto
    border-top:0.02rem solid rgba(7,17,27,0.1)
   
    overflow: hidden
    .rating-wrapper
      padding: 0.36rem 0
      display: flex
      .rating-left
        flex: 0 0 2.74rem
        width: 2.74rem
        padding: 0.12rem 0
        text-align: center
        border-right: 0.02rem solid rgba(7,17,27,0.1)
        .score
          font-size: 0.48rem
          line-height: 0.56rem
          color: rgb(255,153,0)
          margin-bottom: 0.12rem
        .title
          font-size: 0.24rem
          line-height: 0.24rem
          color: rgb(7,17,27)
          margin-bottom: 0.16rem
        .rank
          font-size: 0.2rem
          line-height: 0.2rem
          color: rgb(147,153,159)
      .rating-right
        flex: 1
        padding-left: 0.48rem
        .score-wrapper
          font-size: 0
          margin-bottom: 0.16rem
          line-height: 0.36rem
          .title
            display: inline-block
            font-size: 0.24rem
            color: rgb(7,17,27)
          .star
            margin-left: 0.24rem
            display: inline-block
          .score
            margin-left: 0.24rem
            font-size: 0.24rem
            color: rgb(255,153,0)
        .delivery-wrapper
           font-size: 0
           .title
             display: inline-block
             font-size: 0.24rem
             color: rgb(7,17,27)
           .time
             margin-left: 0.24rem
             display: inline-block
             font-size: 0.24rem
             color: rgb(147,153,159)
    .split
      height: 0.32rem
      border-top: 0.02rem solid rgba(7,17,27,0.1)
      border-bottom: 0.02rem solid rgba(7,17,27,0.1)
      background: #f3f5f7
    .ratingselect
      padding: 0.36rem 0.36rem 0.24rem 0.36rem
      border-bottom: 0.02rem solid rgba(7,17,27,.1)
    .rating-content
      padding: 0 0.36rem
      .rating-item
        position: relative
        display: flex
        padding: 0.36rem 0
        border-top:0.02rem solid rgba(7,17,27,.1)
        .avatar
          flex: 0 0 0.56rem
          width: 0.56rem
          margin-right: 0.24rem
          img
            border-radius: 50%
        .content-wrapper
          flex: 1
          .name
            font-size: 0.2rem
            line-height: 0.24rem
            color: rgb(7,17,27)
            margin-bottom: 0.08rem
          .star-wrapper
            font-size: 0
            margin-bottom: 0.12rem
            .star
              display: inline-block
              margin-right: 0.12rem
            .time
              font-size: 0.2rem
              font-weight: 200
              line-height: 0.24rem
              color: rgb(147,153,159)
          .text
            font-size: 0.24rem
            line-height: 0.36rem
            color: rgb(7,17,27)
            margin-bottom: 0.16rem
          .recommend
            font-size: 0
            .icon-thumb_up
              display: inline-block
              font-size: 0.24rem
              color: rgb(0,160,220)
              line-height: 0.32rem
            .recommend-item
              display: inline-block
              padding: 0 0.12rem
              font-size: 0.18rem
              line-height: 0.32rem
              color: rgb(147,153,159)
              border: 0.02rem solid rgba(7,17,27,.1)
              margin: 0 0 0.08rem 0.16rem
          .rate-time
            position: absolute
            right: 0.36rem
            top: 0.36rem
            font-size: 0.2rem
            line-height: 0.24rem
            color: rgb(147,153,159)


</style>
