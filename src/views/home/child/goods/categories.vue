<template>
  <div class="cate">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">登陆</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加商品对话框 -->
    <el-dialog
      title="添加商品"
      :visible.sync="showAddGoods"
      width="40%"
      @close="resetAddForm"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="cateform"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="currentParentCate"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              chidlren: 'children',
            }"
            @change="parentCateChange"
            :change-on-select="true"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCate(false)">取 消</el-button>
        <el-button type="primary" @click="addCate(true)">确 定</el-button>
      </span>
    </el-dialog>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="getParentCateList"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <tree-table
        :data="catelist"
        :columns="columns"
        class="tree"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :border="true"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen; font-size='16px';"
          ></i>
          <i
            class="el-icon-error"
            v-else
            style="color:lightred; font-size='16px';"
          ></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="do" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-share"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-edit"
            >删除</el-button
          >
        </template>
      </tree-table>

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
import { getCategories, addCate } from "network/goods.js";
export default {
  name: "cate",
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      catelist: [],
      parentCateList: [],
      total: 0,
      showAddGoods: false,
      currentParentCate: [],
      //   添加分类的分类信息
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },

      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          //   自定义插槽
          type: "template",
          //   插槽名称
          template: "isok",
        },
        {
          label: "等级",
          type: "template",
          template: "level",
        },
        {
          label: "操作",
          type: "template",
          template: "do",
        },
      ],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    getCateList() {
      getCategories(this.queryInfo).then((res) => {
        if (res.data.meta.status != 200)
          return this.$message.error("获取分类信息失败");

        this.catelist = res.data.data.result;
        this.total = res.data.data.total;
      });
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getCateList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getCateList();
    },
    //获取添加分类对话框中父级分类的下拉框的所有选项
    getParentCateList() {
      // 只需获取前两级的分类。获取所有分类 不需要写pagenum和pagesize
      this.showAddGoods = true;
      let query = { type: 2 };
      getCategories(query).then((res) => {
        if (res.data.meta.status != 200)
          return this.$message.error("获取分类信息失败");
        this.parentCateList = res.data.data;
      });
    },
    // 发送添加分类的请求
    addCate(bool) {
      this.showAddGoods = false;
      if (!bool) return;
      this.$refs.cateform.validate((valid) => {
        if (!valid) return;
        addCate(this.addCateForm).then((res) => {
          if (res.data.meta.status != 201)
            return this.$message.error("添加分类失败！");
          this.getCateList();
          this.$message.success("添加分类成功！");
        });
      });
    },
    parentCateChange() {
      console.log(this.currentParenCate);
      //   如果当前选中父级分类长度大于0 说明选中了父级分类。
      // 反之 说明没有选中任何父级分类。
      if (this.currentParentCate.length > 0) {
        //   赋值父分类id
        this.addCateForm.cat_pid = this.currentParentCate[
          this.currentParentCate.length - 1
        ];
        // 新增分类级别
        this.addCateForm.cat_level = this.currentParentCate.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 重置分类信息
    resetAddForm() {
      this.addCateForm = {};
      this.currentParentCate = [];
      this.$refs.cateform.resetFields();
    },
  },
};
</script>

<style scoped>
.tree {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
