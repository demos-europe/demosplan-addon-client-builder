<template>
  <div class="hello">{{ msg }}</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return { msg: 'Hello from addon' }
  }
}
</script>

<style lang="scss" scoped>
.hello {
  color: red;
}
</style>

<license>
This block must be stripped by removeSFCBlockLoader before vue-loader parses the file.
</license>
