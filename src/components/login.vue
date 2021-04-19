<template>
  <div class="login_container">
    <div class="login_box">
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" class="login_form">
        <el-form-item prop="name">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-key"
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="verifyCode">
          <el-col :span="15">
            <el-input
              prefix-icon="el-icon-lock"
              v-model="loginForm.verifyCode"
              placeholder="请输入验证码"
            ></el-input>
          </el-col>
          <el-col :span="8" class="verify_class" ref="code">
            <v-sidentify />
          </el-col>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="info" @click="register">注册</el-button>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="warning" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import Sidentify from './sidentify'
export default {
  data () {
    return {
      loginForm: {
        name: '',
        password: '',
        verifyCode: ''
      },
      loginFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最小为6位', trigger: 'blur' }
        ],
        verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  components: {
    'v-sidentify': Sidentify
  },
  methods: {
    // 重置功能
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    login () {
      const data = this.$refs.code.$children[0].identifyCode.toLowerCase() // 从子组件中取值
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        // 先进行验证码判断
        this.loginForm.verifyCode = this.loginForm.verifyCode.toLowerCase()
        if (this.loginForm.verifyCode !== data) {
          alert('验证码输入错误，请重新输入')
          this.loginForm.verifyCode = ''
          return false
        }
        // 用户名密码判断，暂时直接判断
        if (this.loginForm.name === 'admin' && this.loginForm.password === '123456') {
          this.$message.success('登录成功')
          // 添加token
          window.sessionStorage.setItem('token', new Date().getTime())
          this.$router.push('home')
        } else {
          return this.$message.error('登录失败')
        }
      })
    },
    // 注册
    register () {
      alert('暂未开放')
    },
    // 更换验证码
    changeCode () {
      console.log(111)
    }
  }
}
</script>
<style>
.login_container {
  background-image: url('../assets/logo.jpg');
  background-size: 100%;
  height: 100%;
}
.login_box {
  width: 400px;
  height: 300px;
  background: #e2e1e4;
  border-radius: 10px;
  position: absolute;
  left: 60%;
  top: 50%;
  transform: translate(0, -50%);
}
.login_form {
  position: absolute;
  width: 100%;
  padding: 0 20px;
  bottom: 0;
  box-sizing: border-box;
}

#canvas {
  width: 10%;
  height: 20px;
  border: 1px solid #fff;
  cursor: pointer;
}

.change_code {
  font-size: 12px;
}

.btns {
  display: flex;
  justify-content: space-around;
}
</style>
