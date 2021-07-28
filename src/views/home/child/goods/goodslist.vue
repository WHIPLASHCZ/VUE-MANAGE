<template>
  <div class="list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">登陆</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 修改属性/参数对话框 -->
    <el-dialog
      :title="'修改商品'"
      :visible.sync="showGoodEdit"
      width="30%"
      @close="resetGoodEditForm"
    >
      <el-form
        :model="editGoodForm"
        :rules="editGoodRules"
        ref="editGoodForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editGoodForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input
            v-model="editGoodForm.goods_weight"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input
            v-model="editGoodForm.goods_number"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" prop="goods_introduce">
          <!-- <el-input v-html="editGoodForm.goods_introduce"> </el-input> -->
          <!-- <el-input
            v-model="editGoodForm.goods_introduce"
            class="intro"
          ></el-input> -->
          <!-- <el-button type="primary" @click="editIntro"> 修改介绍 </el-button> -->
          <!-- <el-input
            placeholder="请输入内容"
            v-html="editGoodForm.goods_introduce"
            v-if="showIntroHtml"
            ref="textarea"
          >
          </el-input> -->
          <el-input
            type="textarea"
            :rows="10"
            placeholder="请输入内容"
            v-model="editGoodForm.goods_introduce"
            ref="textarea"
          >
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editGood(false)">取 消</el-button>
        <el-button type="primary" @click="editGood(true)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除属性对话框 -->

    <el-dialog :title="'删除商品'" :visible.sync="showGoodDelete" width="30%">
      <span>确认删除该商品吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteGood(false)">取 消</el-button>
        <el-button type="primary" @click="deleteGood(true)">确 定</el-button>
      </span>
    </el-dialog>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="resetList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchGoods"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGood">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goods" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" class="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="195">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="175">
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            <span> {{ scope.row.add_time | dateFormat }} </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-share"
              @click="showEdigDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-edit"
              @click="showdeleteGood(scope.row)"
              >删除</el-button
            >
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
import { getGoods, deleteGood, searchGood, editGood } from "network/goods.js";
import { debounce } from "../../../../tools/tools.js";
export default {
  name: "goodslist",
  data() {
    return {
      searchList: "",
      goods: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      currentGood: {},
      showGoodDelete: false,
      editGoodForm: {
        id: "",
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
      },
      showGoodEdit: false,
      editGoodRules: {
        goods_name: [
          { required: true, message: "请填写商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请填写商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请填写商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请填写商品重量", trigger: "blur" },
        ],
        goods_introduce: [
          { required: true, message: "请填写商品介绍", trigger: "blur" },
        ],
      },
      editInfo: {},
      showIntroHtml: true,
    };
  },
  created() {
    this.getGoodsList();
    this.flag = debounce(() => {
      if (this.queryInfo.query === "") {
        this.getGoodsList();
      }
    }, 350);
  },
  methods: {
    getGoodsList() {
      getGoods(this.queryInfo).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取商品失败！");
        this.goods = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    // 每页展示条数改变
    handleSizeChange(newsize) {
      console.log(newsize);
      this.queryInfo.pagesize = newsize;
      this.getGoodsList();
    },
    // 页数改变
    handleCurrentChange(newpage) {
      console.log(newpage);
      this.queryInfo.pagenum = newpage;
      this.getGoodsList();
    },
    // 搜索
    searchGoods() {
      console.log(this.queryInfo.query);
      this.getGoodsList();
    },
    resetList() {
      this.getGoodsList();
    },
    showdeleteGood(good) {
      this.showGoodDelete = true;
      this.currentGood = good;
    },
    deleteGood(bool) {
      this.showGoodDelete = false;
      if (!bool) return;
      console.log(this.currentGood);
      deleteGood(this.currentGood.goods_id).then((res) => {
        console.log(res);
        if (res.data.meta.status != 200)
          return this.$message.error("删除失败！");
        this.$message.success("删除成功！");
        this.getGoodsList();
      });
    },
    addGood() {
      this.$router.push("/home/goods/add");
    },
    showEdigDialog(good) {
      this.showGoodEdit = true;
      console.log(good);
      searchGood(good.goods_id).then((res) => {
        console.log(res);
        this.editGoodForm = res.data.data;
        console.log(this.editGoodForm);
      });
    },
    editGood(bool) {
      this.showGoodEdit = false;
      if (!bool) return;
      editGood(this.editGoodForm.goods_id, this.editGoodForm).then((res) => {
        console.log(res);
        this.getGoodsList();
      });
    },
    resetGoodEditForm() {},
    editIntro() {
      console.log("click");
      this.showIntroHtml = false;
    },
  },
  watch: {
    // "queryInfo.query"(newval) {
    //   this.flag();
    // },
  },
};
</script>

<style scoped>
.intro {
  height: 200px !important;
}
</style>
