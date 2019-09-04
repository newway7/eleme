<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span class="block positive" @click="select(2)" :class="{'active': selectType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" @click="select(0)" :class="{'active': selectType === 0}">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
      <span class="block negative" @click="select(1)" :class="{'active': selectType === 1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
    </div>
    <div class="switch">
      <span class="icon-check_circle" :class="{'on': onlyContent}" @click="toggleContent"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2

  export default {
    props: {
      ratings: {
        type: Array,
        default () {
          return []
        }
      },
      selectType: {
        type: Number,
        defalut: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    computed: {
      positive () {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        })
      },
      negative () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    },
    methods: {
      select (type) {
        this.$emit('selecttype', type)
      },
      toggleContent () {
        this.$emit('content')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/stylus/mixin'

  .ratingselect
    .rating-type
      padding: 0.24rem 0 0.36rem 0
      border-top:0.02rem solid rgba(7,17,27,.1)
      font-size: 0
      .block
        display: inline-block
        padding: 0.16rem 0.24rem
        border-radius: 0.04rem
        font-size: 0.24rem
        margin-right: 0.16rem
        line-height: 0.32rem
        &.positive
          background: rgba(0,160,220,.2)
          &.active
            background: rgb(0,160,220)
            color: #fff
        &.negative
          background: rgba(77,85,93,.2)
          &.active
            background: rgb(77,85,93)
            color: #fff
        .count
            font-size: 0.16rem
            margin-left: 0.04rem
    .switch
      padding-top: 0.24rem
      color: rgb(147,153,159)
      line-height: 0.48rem
      font-size: 0
      .icon-check_circle
        display: inline-block
        font-size: 0.48rem
        vertical-align: top
        margin-right: 0.08rem
        &.on
          color: #00c850
      .text
        display: inline-block
        font-size: 0.24rem
</style>
