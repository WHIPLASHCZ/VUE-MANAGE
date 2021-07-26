<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">登陆</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>全选列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" class="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.level === '0'">等级零</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'"
              >等级一</el-tag
            >
            <el-tag type="warning" v-else-if="scope.row.level === '2'"
              >等级二</el-tag
            >
            <el-tag type="danger" v-else-if="scope.row.level === '3'"
              >等级三</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getPowerList } from "network/rights.js";
export default {
  name: "rights",
  created() {
    getPowerList("list").then((res) => {
      console.log(res);
      this.rightlist = res.data.data;
    });
  },
  data() {
    return {
      rightlist: [],
    };
  },
};
</script>

<style></style>
