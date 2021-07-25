<template>
  <div class="home" v-if="token">
    home sweet home
    <el-button type="info" @click="logout">退出登陆</el-button>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      token: sessionStorage.getItem("token"),
    };
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      this.$router.push({
        name: "login",
      });
    },
  },
};
</script>

<style></style>
