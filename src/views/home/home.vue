<template>
  <el-container class="container">
    <!-- 头部 -->
    <el-header class="header">
      <div class="titlebox">
        <img src="~assets/img/heima.png" alt="" />
        <h2>电商后台管理系统</h2>
      </div>
      <el-button type="info" @click="logout" class="logout">退出登陆</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside
        :width="isCollapse ? '76px' : '200px'"
        class="aside"
        ref="aside"
      >
        <div class="sidehead" @click="collapse">|||</div>
        <!-- <input type="button" value="展开/折叠" @click="collapse" /> -->
        <el-menu
          background-color="#373c41"
          text-color="#fff"
          active-text-color="#409BFF"
          class="menu"
          :unique-opened="true"
          :collapse-transition="false"
          :collapse="isCollapse"
          ref="menu"
          :router="true"
          :default-active="currentState"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="(i, index) of asideList"
            :index="i.path"
            :key="i.id"
            class="submenu"
            :popper-append-to-body="true"
            :style="{ height: '100%' }"
          >
            <template slot="title">
              <i class="iconfont">{{ icons[index] }}</i>
              <span>{{ i.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              class="second-list"
              v-for="item of i.children"
              :key="item.id"
              :index="item.path"
            >
              <template slot="title">
                <i class="el-icon-menu"> </i>
                <span>{{ item.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenu } from "../../network/login.js";
export default {
  name: "home",
  mounted() {
    getMenu().then((res) => {
      if (res.data.meta.status !== 200)
        return this.$message.error(res.meta.msg);
      this.asideList = res.data.data;
    });
    this.currentState = sessionStorage.getItem("activeIndex");
    this.$bus.$on("jump", () => {
      console.log("页面跳转");
      this.currentState = sessionStorage.getItem("activeIndex");
    });
  },

  data() {
    return {
      token: sessionStorage.getItem("token"),
      asideList: [],
      icons: ["\ue8b5", "\ue709", "\ue888", "\ue89b", "\ue902"],
      isCollapse: false,
      currentState: "",
    };
  },
  computed: {
    currentIndex() {
      console.log(sessionStorage.getItem("activeIndex"));
      return sessionStorage.getItem("activeIndex");
    },
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      this.$router.push({
        name: "login",
      });
    },
    collapse() {
      this.isCollapse = !this.isCollapse;
    },
    // saveState(state) {
    //   sessionStorage.setItem("activeIndex", state);
    // },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
}
.header {
  background-color: #373c41;
  color: white;
  padding-left: 10px;
}
.logout {
  float: right;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.titlebox {
  display: flex;
  align-items: center;
  height: 100%;
  float: left;
  img {
    margin-right: 20px;
    // margin-top: 3px;
    width: 52px;
  }
  h2 {
    font-weight: normal;
  }
}
.menu {
  width: 100%;
}
.submenu {
  position: relative;
  //   height: 100px !important;
}
.aside {
  height: 100%;
  color: white;
  background-color: #373c41;
  user-select: none;
  overflow: hidden;
  li {
    height: 65px;
    line-height: 65px;
    padding-left: 10px;
    .iconfont {
      //   padding: 15px;
      padding-right: 25px;
    }
  }
  .sidehead {
    width: 100%;
    background-color: #485166;
    text-align: center;
    line-height: 24px;
    cursor: pointer;
    // margin: 8px 0;
  }
  .second-list {
    // z-index: 9999;
    // position: relative;
    border-bottom: 1px solid black;
    // background-color: #434b61 !important;
    // margin-top: -1px;
  }
}
</style>
