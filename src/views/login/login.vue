<template>
  <div class="login">
    <div class="login-box">
      <div class="head">
        <img src="~assets/img/manson.jpg" alt="" class="avatar" />
      </div>
      <el-form :model="form" :rules="rules" class="from input" ref="elform">
        <el-form-item class="mb20" prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="el-icon-user-solid"
            v-model="form.username"
          >
          </el-input>
        </el-form-item>

        <el-form-item class="mb20" prop="password">
          <el-input
            placeholder="请输入内容"
            v-model="form.password"
            :type="form.passInput"
          >
            <i slot="prefix" class="iconfont mima ">&#xe62f;</i>
            <i
              slot="suffix"
              class="el-icon-view mima "
              :class="{ black: form.passInput == 'text' }"
              @click="showpassword"
            ></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="button-box">
        <el-button type="primary" @click="login">登陆</el-button>
        <el-button type="info" @click="restart">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "../../network/login.js";
export default {
  name: "login",
  created() {
    document.title = "登陆";
  },
  data() {
    return {
      form: {
        username: "admin",
        password: "123456",
        passInput: "password",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    login() {
      //validate为elUI的表单组件自带的表单验证方法。
      //如果表单内所有元素通过rulse对象的验证条件 则回调的参数布尔值为true。
      this.$refs.elform.validate(async (valid) => {
        if (!valid) return;
        let { data: res } = await login(this.form.username, this.form.password);
        // console.log("await得到结果才会执行");
        if (res.meta.status !== 200) return this.$message.error("登陆失败！");
        this.$message.success("登陆成功！");
        //保存用户的token 有token才能访问其他页面
        sessionStorage.setItem("token", res.data.token);
        this.$router.push({ name: "home" });
      });
    },
    showpassword() {
      this.form.passInput =
        this.form.passInput == "password" ? "text" : "password";
    },
    restart() {
      this.$refs.elform.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.black {
  color: black;
}
//在less中用 @ 声明变量
@dpb: #2b4b6a;
@bgc: background-color;
.login {
  user-select: none;
  //属性名或选择器变量 需要@{名字}这样使用。
  @{bgc}: @dpb;
  color: white;
  width: 100%;
  height: 100%;
  position: relative;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 20px;
  box-sizing: border-box;
  .head {
    width: 130px;
    height: 130px;
    position: relative;
    top: -70px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    overflow: hidden;
    border: 8px solid white;
    box-shadow: 0 0 10px #ddd;
    img {
      width: 100%;
      height: 100%;
      background-color: #eee;
    }
  }
  .input {
    margin-top: -30px;
  }
  .mb20 {
    margin-bottom: 20px;
  }
  .button-box {
    text-align: right;
  }
  .mima {
    line-height: 40px;
    margin-left: 6px;
    font-size: 14px;
  }
}
</style>
