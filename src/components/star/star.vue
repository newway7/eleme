<template>
    <div class="star" :class="starType">
        <span v-for="(itemClass,index) in itemClasses" :key='index' :class="itemClass" class="star-item"></span>
    </div>
</template>

<script>
  const LENGTH = 5
  const CLS_ON = 'on'
  const CLS_HALF = 'half'
  const CLS_OFF = 'off'
  
  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType () {
        return 'star-' + this.size
      },
      itemClasses () {
        let result = []
        let score = Math.floor(this.score * 2) / 2
        let hasDecimal = score % 1 !== 0
        let integer = Math.floor(this.score)
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON)
        }
        if (hasDecimal) {
          result.push(CLS_HALF)
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF)
          integer++
        }
        return result
      }
    }
  }
</script>

<style lang="stylus" ref="stylesheet/stylus">
@import '../../assets/stylus/mixin'

  .star
    .star-item
      display: inline-block
      background-repeat: no-repeat
  &.star-48
    .star-item
      width: 0.4rem
      height: 0.4rem
      margin-right: 0.44rem
      background-size: 0.4rem 0.4rem
      &:last-child
        margin-right: 0
      &.on
        bg-image('star48_on')
      &.half
        bg-image('star48_half')
      &.off
        bg-image('star48_off')
  &.star-36
    .star-item
      width: 0.3rem
      height: 0.3rem
      margin-right: 0.12rem
      background-size: 0.3rem 0.3rem
      &:last-child
        margin-right: 0
      &.on
        bg-image('star36_on')
      &.half
        bg-image('star36_half')
      &.off
        bg-image('star36_off')
  &.star-24
    .star-item
      width: 0.2rem
      height: 0.2rem
      margin-right: 0.06rem
      background-size: 0.2rem 0.2rem
      &:last-child
        margin-right: 0
      &.on
        bg-image('star24_on')
      &.half
        bg-image('star24_half')
      &.off
        bg-image('star24_off')
    

</style>