<template>
  <div class="goods">
     <div class="menu-wrapper" ref="menuWrapper">
       <ul>
         <li v-for="(item,index) in goods" :key='index' class="menu-item" :class="{'current': currentIndex === index}" @click="selectMenu(index)">
           <span class="text"><span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</span>
         </li>
       </ul>
     </div>
     <div class="foods-wrapper" ref="foodsWrapper">
       <ul>
         <li v-for="(item,index) in goods" :key='index' class="food-list food-list-hook">
           <h1 class="title">{{item.name}}</h1>
           <ul v-for="(food,index) in item.foods" :key="index" class="food-item">
             <div class="icon" @click="selectFood(food)">
               <img width="57" height="57" :src="food.icon">
             </div>
             <div class="content">
               <h2 class="name">{{food.name}}</h2>
               <p class="description">{{food.description}}</p>
               <div class="extra">
                 <span class="count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
               </div>
               <div class="price">
                 <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
               </div>
               <div class="cart-wrapper">
                 <cartcontrol :food="food"></cartcontrol>
               </div>
             </div>
           </ul>
         </li>
       </ul>
     </div>
     <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
     <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import shopcart from '../../components/shopcart/shopcart'
import cartcontrol from '../../components/cartcontrol/cartcontrol'
import food from '../../components/food/food'
import data from '../../assets/json/data.json'

// const ERR_OK = 0
// const debug = process.env.NODE_ENV !== 'production'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
    currentIndex () {//通过计算goods上移距离，得到现在显示的是menu的哪一部分。从而增加currentclass
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']


    this.goods = data.goods
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
      this._calculateHeight()
    }, 20)
  },
  methods: {
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,//支持点击事件
        probeType: 3//当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，
        //而且在 momentum 滚动动画运行过程中实时派发 scroll 事件
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)//每一项距离this.$refs.menuWrapper元素高度；形成数组
      }
    },
    selectMenu (index) {//点击menu，goods上移；
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let ref = foodList[index]
      this.foodsScroll.scrollToElement(ref, 300)//滚动到目标元素，300为时间
    },
    selectFood (food) {
      this.selectedFood = food
      this.$refs.food.show()
      console.log('111')
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/mixin.styl'

  .goods
    position: absolute
    top: 3.52rem
    bottom: 0.88rem
    width: 100%
    border-top:0.02rem solid rgba(7,17,27,0.1)

    
    display: flex
    overflow: hidden
    .menu-wrapper
      flex: 0 0 1.6rem
      background: #f3f5f7
      .menu-item
        width: 1.12rem
        height: 1.08rem
        display: table
        font-size: 0.24rem
        line-height: 0.28rem
        padding: 0 0.24rem
        font-weight: 200
        &:first-child
          margin-top: -0.02rem
        &:last-child
          .text:after
            border-top: none
        &.current
          position: relative
          background: #fff
          font-weight: 700
          margin-top: -0.02rem
          z-index: 2
          
          .text:after
            border-top: 0
        .text
          display: table-cell
          vertical-align: middle
          border-top:0.02rem solid rgba(7,17,27,.1)
          width: 1.12rem
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
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
    .foods-wrapper
      flex: 1
      .title
        padding-left: 0.28rem
        border-left: 0.04rem solid #d9dde1
        font-size: 0.24rem
        height: 0.52rem
        line-height: 0.52rem
        color: rgb(147,153,159)
        background-color: #f3f5f7
      .food-item
        position:relative
        display: flex
        margin: 0.36rem
        padding-bottom: 0.36rem
        border-bottom:0.02rem solid rgba(7,17,27,.1)
        &:last-child:after
          border-top: 0
        .icon
          flex: 0 0 1.14rem
          margin-right: 0.20rem
        .content
          flex: 1
          .name
            margin: 0.04rem 0 0.16rem 0
            height: 0.28rem
            line-height: 0.28rem
            font-size: 0.28rem
            color: rgb(7,17,27)

          .description,.extra
            font-size: 0.20rem
            line-height: 0.20rem
            color: rgb(147,153,159)
            margin-bottom: 0.16rem
          .extra
              .count
                margin-right: 0.24rem
                line-height: 0.20rem
              .rating
                line-height: 0.20rem
          .price
            font-size:0
            line-height: 0
            padding: 0
            padding-top: 0.16rem
            .now
              font-size: 0.28rem
              color: rgb(240,20,20)
              font-weight: 700
              line-height: 0.48rem
              margin-right: 0.16rem
            .old
               font-size: 0.20rem
               text-decoration: line-through
               color: rgb(147,153,159)
               font-weight: 700
               line-height: 0.48rem
          .cart-wrapper
            position: absolute
            right: 0
            bottom: 0.24rem
</style>
