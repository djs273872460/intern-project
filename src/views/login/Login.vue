<template>
<div class="login-container" ref="loginContainer">
  <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="login-form">
    <h2>Login Form</h2>
    <el-form-item label="用户" prop="user">
      <el-input type="text" v-model="loginForm.user" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: 'Login',
  data(){
    return {
      loginForm: {
        user: '',
        password: ''
      },
      rules: {
        user: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入用户密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.loginForm.validate
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #283443;
  overflow: hidden;
}
.login-form {
  height: 300px;
  width: 25%;
  min-width: 380px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  text-align: center;
  color: #fff;
}
.login-form h2 {
  padding-left: 19%;
  padding-bottom: 20px;
}
</style>