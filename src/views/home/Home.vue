<template>
  <el-container style="height: 937px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/home/dashboard">dashboard</el-menu-item>
        <el-menu-item index="/home/document">document</el-menu-item>
        <el-menu-item index="/home/chart">chart</el-menu-item>
      </el-menu>
    </el-aside>

    <router-view />
  </el-container>
</template>
<script>
export default {
  methods:{

  },

}
</script>

<style>

</style>