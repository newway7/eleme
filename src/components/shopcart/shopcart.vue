<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper" @click="toggleList">
          <div class="logo" :class="{'highlight': totalCount > 0} ">
            <span class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></span>
          </div>
          <div class="num" v-show="totalCount">{{totalCount}}</div>
        </div>
        <span class="price" :class="{'highlight': totalPrice > 0}">￥{{totalPrice}}</span>
        <span class="desc">另需配送费{{deliveryPrice}}元</span>
      </div>
      <div class="content-right">
        <div class="pay" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <div v-for="(ball, index) in balls" :key="index" v-show="ball.show" class="ball">
          <span class="inner inner-hook"></span>
        </div>
      </transition-group>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="cartShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li v-for="(food,index) in selectFoods" :key='index' class="food">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="mask-fade">
      <div class="list-mask" @click="hideList" v-show="cartShow"></div>
    </transition>
  </div>
</template>

<script>
  import { eventBus } from '../../components/event-bus'
  import cartcontrol from '../../components/cartcontrol/cartcontrol'
  import BScroll from 'better-scroll'

  export default {
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      selectFoods: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: [],
        fold: true
      }
    },
    created () {
      // 优化体验，异步监听小球平抛动画
      this.$nextTick(() => {
        eventBus.$on('addcart', this.drop)
      })
    },
    computed: {
      totalPrice () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.count
        })
        return total
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return `去结算`
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return `not-enough`
        } else {
          return `enough`
        }
      },
      cartShow () {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          // 手动刷新better-scroll重新计算页面高度
          if (!this.listContentScroll) {
            this.listContentScroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            this.$nextTick(() => {
              this.listContentScroll.refresh()
            })
          }
        }
        return show
      }
    },
    methods: {
      drop (ele) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true // 表示可以有下落动画
            ball.el = ele
            this.dropBalls.push(ball)
            return // 跳出循环
          }
        }
      },
      beforeEnter: function (ele) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            ele.style.display = ''
            ele.style.webkitTransform = `translate3d(0, ${y}px, 0)`
            ele.style.transform = `translate3d(0, ${y}px, 0)`
            let inner = ele.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
            inner.style.transform = `translate3d(${x}px, 0, 0)`
          }
        }
      },
      enter: function (ele) {
        /* eslint-disable */
        ele.offsetHeight
        this.$nextTick(() => {
          ele.style.webkitTransform = 'translate3d(0, 0, 0)'
          ele.style.transform = 'translate3d(0, 0, 0)'
          let inner = ele.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0, 0, 0)'
          inner.style.transform = 'translate3d(0, 0, 0)'
        })
      },
      afterEnter: function (ele) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          ele.style.display = 'none'
        }
      },
      toggleList () {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      hideList () {
        this.fold = true
      },
      empty () {
        this.selectFoods.forEach((food) => {
          food.count = 0
        })
      },
      pay () {
        if (this.totalPrice < this.minPrice) {
          return
        }
        window.alert(`需要支付${this.totalPrice}元`)
      }
    },
    components: {
      cartcontrol
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/mixin'

  .shopcart
    position: fixed
    
    left: 0
    right: 0
    margin: 0 auto
    bottom: 0
    width: 100%
    height: 0.96rem
    z-index: 4
    .content
      display: flex
      background: #141d27
      color: rgba(255,255,255,.4)
      .content-left
        flex: 1
        font-size: 0
        .logo-wrapper
          padding: 0.12rem
          margin: 0 0.24rem
          background: #141d27
          width: 1.12rem
          height: 1.12rem
          display: inline-block
          position: relative
          top: -0.20rem
          box-sizing: border-box
          border-radius: 50%
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background: #2b343c
            text-align: center
            line-height: 0.88rem
            &.highlight
              background: rgb(0,160,220)
            .icon-shopping_cart
              font-size: 0.48rem
              line-height: 0.88rem
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 0.48rem
            height: 0.32rem
            line-height: 0.32rem
            text-align: center
            border-radius: 0.32rem
            font-size: 0.18rem
            font-weight: 700
            color: #fff
            background: rgb(240,20,20)
            box-shadow: 0 0.08rem 0.16rem 0 rgba(0,0,0,.4)
        .price
          display: inline-block
          height: 0.48rem
          line-height: 0.48rem
          vertical-align: top
          margin-top: 0.24rem
          font-size: 0.32rem
          font-weight: 700
          border-right: 0.02rem solid rgba(255,255,255,.1)
          padding-right: 0.24rem
          &.highlight
            color: #fff
        .desc
          display: inline-block
          font-size: 0.2rem
          line-height: 0.48rem
          vertical-align: top
          margin: 0.24rem 0 0 0.24rem
      .content-right
        flex: 0 0 2.1rem
        width: 2.1rem
        .pay
          height: 0.96rem
          line-height: 0.96rem
          font-size: 0.24rem
          font-weight: 700
          text-align: center
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 0.64rem
        bottom: 0.44rem
        z-index: 200
        &.drop-enter, &.drop-enter-active
          transition all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          display: inline-block
          width: 0.32rem
          height: 0.32rem
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all .4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      width: 100%
      z-index: -1
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-to
        transform: translate3d(0, 0, 0)
    .list-header
      height: 0.8rem
      line-height: 0.8rem
      padding: 0 0.32rem
      background: #f3f5f7
      border-bottom: 0.02rem solid rgba(7,17,27,.1)
      .title
        font-size: 0.28rem
        float: left
        color: rgb(7,17,27)
      .empty
        float: right
        font-size: 0.24rem
        color: rgb(0,160,220)
    .list-content
      padding: 0 0.32rem
      
      background: #fff
      overflow: hidden
      .food
        position: relative
        padding: 0.24rem 0
        box-sizing: border-box
        border-top:0.02rem solid rgba(7,17,27,.1)
        &:last-child:after
          border-top: 0
        .name
          line-height: 0.48rem
          font-size: 0.28rem
          color: rgb(7,17,27)
        .price
          position: absolute
          right: 1.8rem
          bottom: 0.24rem
          line-height: 0.48rem
          font-size: 0.28rem
          font-weight: 700
          color: rgb(240,20,20)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 0.12rem
    .list-mask
      position: fixed
    
      top: 0
      left: 0
      right: 0
      margin: 0 auto
      width: 100%
      height: 100%
      background: rgba(7,17,27,.6)
      backdrop-filter: blur(0.20rem)
      z-index: -2;
      opacity: 1
      &.mask-fade-enter-active, &.mask-fade-leave-active
        transition: all 0.3s
      &.mask-fade-enter, &.mask-fade-leave-to
        opacity: 0
</style>
