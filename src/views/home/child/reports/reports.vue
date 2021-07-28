<template>
  <div class="report">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">登陆</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- <h3>用户来源</h3> -->
      <div id="main" style="width: 700px;height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getLine } from "network/order.js";
import _ from "lodash";
export default {
  name: "report",
  data() {
    return {
      myChart: "",
      echarts: echarts,
      option: {
        title: {
          text: "用户来源",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
    };
  },
  created() {},
  mounted() {
    getLine().then((res) => {
      console.log(res);
      //   this.option = res.data.data;
      //   console.log(this.option);
      this.option = _.merge(res.data.data, this.option);
      this.myChart = echarts.init(document.getElementById("main"));
      this.myChart.setOption(this.option);
    });
  },
};
</script>

<style scoped>
#main {
  /* margin-top: 20px !important; */
}
</style>
