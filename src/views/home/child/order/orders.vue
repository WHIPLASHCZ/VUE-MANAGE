<template>
  <div class="order">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">登陆</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 地址 -->
    <el-dialog
      :title="'修改地址'"
      :visible.sync="showLocationDialog"
      width="500px"
      @close="resetLocationForm"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        label-width="100px"
        ref="addrForm"
      >
        <el-form-item label="省市区/县：" prop="address1">
          <!-- <el-input v-model="addressForm.address1" class="ipt"></el-input> -->
          <el-cascader
            v-model="addressForm.address1"
            :options="citys"
            :props="{ expandTrigger: 'hover', children: 'children' }"
            class="addr"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="详细地址：" prop="address2">
          <el-input v-model="addressForm.address2" class="ipt"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editLocation(false)">取 消</el-button>
        <el-button type="primary" @click="editLocation(true)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 地址 -->
    <el-dialog
      :title="'物流进度'"
      :visible.sync="showProgressDialog"
      width="500px"
      @close="resetLocationForm"
    >
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="resetOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchOrder"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- <el-button type="primary" @click="addGood">添加商品</el-button> -->
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay == '0'"
              >未付款</el-tag
            >
            <el-tag type="primary" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            <span> {{ scope.row.create_time | dateFormat }} </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showLocation(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location-outline"
              @click="showProgress(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="text-align:center; margin-top:20px"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getOrders, editAddr } from "network/order.js";
import citys from "@/assets/js/citydata.js";
export default {
  name: "orders",
  created() {
    this.getOrderList();
    this.citys = citys;
  },
  data() {
    return {
      orderList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 1,
      showLocationDialog: false,
      showProgressDialog: false,
      addressForm: {
        address1: "",
        address2: "",
      },
      citys: {},
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      currentOrderId: "",
      progressInfo: "",
    };
  },
  methods: {
    getOrderList() {
      getOrders(this.queryInfo).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取订单信息失败！");
        this.orderList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    searchOrder() {
      this.getOrderList();
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getOrderList();
    },
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum;
      this.getOrderList();
    },
    resetOrderList() {
      this.queryInfo.query = "";
      this.queryInfo.pagenum = 1;
      this.getOrderList();
    },
    showLocation(order) {
      this.showLocationDialog = true;
      console.log(order);
      this.currentOrderId = order.order_id;
    },
    resetLocationForm() {
      this.$refs.addrForm.resetFields();
    },
    editLocation(bool) {
      this.showLocationDialog = false;
      if (!bool) return;
      editAddr(this.currentOrderId).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("修改地址失败！");
        console.log(res);
      });
    },
    showProgress(order) {
      this.showProgressDialog = true;
      editAddr("1106975712662").then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取物流详情失败！");

        this.progressInfo = res.data.data;
        console.log(this.progressInfo);
      });
    },
    resetLocationForm() {},
  },
};
</script>

<style scoped>
.ipt {
  /* width: 70% !important; */
}
.addr {
  width: 100%;
}
</style>
