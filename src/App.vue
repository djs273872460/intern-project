<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  // created() {
  //   var app = document.querySelector('#app');
  //   app.style.height = document.documentElement.clientHeight + 'px';
  // }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html, body {
  height: 100%;
}
#app {
  height: 100%;
}
</style>

