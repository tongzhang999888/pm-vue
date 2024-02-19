<template>
  <div id="app">
    <el-container style="height: 100%; width: 100%; border: 1px solid #eee">
    <el-aside width="15%"><Aside></Aside></el-aside>
  <el-container>
    <el-header height="10%">Header</el-header>
    <el-main height="90%" width="90%">
    <router-view/>
    </el-main>
  </el-container>
</el-container>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
// @ is an alias to /src
import Aside from '@/components/Menu.vue'

export default {
  name: 'Manage',
  components:{
    Aside
  },
}
</script>