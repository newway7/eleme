<template>
  <div class="cartcontroll">
    <transition name="slide-fade">
      <div class="decrease icon-remove_circle_outline" v-show="food.count" @click="decreaseCart"></div>
    </transition>
    <div class="count" v-show="food.count">{{food.count}}</div>
    <div class="add icon-add_circle" @click="addCart"></div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { eventBus } from '../../components/event-bus'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart (e) {
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count += 1
        }
        // 优化体验，异步传递当前点击文档节点
        this.$nextTick(() => {
          eventBus.$emit('addcart', e.target)
        })
      },
      decreaseCart () {
        if (this.food.count) {
          this.food.count --
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontroll
    font-size: 0
    .decrease,.add
      display: inline-block
      font-size: 0.48rem
      width: 0.48rem
      height: 0.48rem
      color: rgb(0,160,220)
      padding: 0.12rem
    .count
      display: inline-block
      vertical-align: top
      font-size: 0.2rem
      width: 0.24rem
      line-height: 0.48rem
      padding-top: 0.12rem
      text-align: center
      color: rgb(143,153,159)
  .cartcontroll
  &.slide-fade-enter-active
    transition: all .3s ease
  &.slide-fade-leave-active
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0)
  &.slide-fade-enter, &.slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
    transform: translateX(0.48rem) rotate(360deg)
    opacity: 0

</style>
