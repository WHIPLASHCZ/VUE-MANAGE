<template>
  <div class="params">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">登陆</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加属性/参数对话框 -->
    <el-dialog
      :title="'添加' + addWhat"
      :visible.sync="showAddParams"
      width="30%"
      @close="resetForm"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsRules"
        ref="paramsForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="addWhat + '：'" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addParams(false)">取 消</el-button>
        <el-button type="primary" @click="addParams(true)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改属性/参数对话框 -->
    <el-dialog
      :title="'修改' + addWhat"
      :visible.sync="showEdit"
      width="30%"
      @close="resetEditForm"
    >
      <el-form
        :model="editParamsForm"
        :rules="addParamsRules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="addWhat + '：'" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editParam(false)">取 消</el-button>
        <el-button type="primary" @click="editParam(true)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除属性对话框 -->

    <el-dialog :title="'删除' + addWhat" :visible.sync="showDelete" width="30%">
      <span>确认删除该参数吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteParam(false)">取 消</el-button>
        <el-button type="primary" @click="deleteParam(true)">确 定</el-button>
      </span>
    </el-dialog>
    <el-card>
      <el-alert
        title="只允许给第三级商品添加参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="chosetype">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="currentCate"
            :options="catelist"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              children: 'children',
              value: 'cat_id',
            }"
            @change="CateChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 只有当我们选中三级分类时 tab-pane才是可点击的 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisable" @click="showAdd"
            >添加参数</el-button
          >

          <el-table :data="manyList" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(i, index) of scope.row.attr_vals"
                  :closable="true"
                  :key="index"
                  @close="deleteVals(scope.row, index)"
                  >{{ i }}</el-tag
                >
                <el-input
                  class="input-new-tag1"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  v-else
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-share"
                  @click="showEditParams(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-edit"
                  @click="showDeleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only"
          ><el-button type="primary" :disabled="isBtnDisable" @click="showAdd"
            >添加属性</el-button
          >

          <el-table :data="onlyList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(i, index) of scope.row.attr_vals"
                  :closable="true"
                  :key="index"
                  @close="deleteVals(scope.row, index)"
                  >{{ i }}</el-tag
                >
                <el-input
                  class="input-new-tag1"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  v-else
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-share"
                  @click="showEditParams(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-edit"
                  @click="showDeleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {
  getCategories,
  getParams,
  addParams,
  searchParams,
  editParam,
  deleteParam,
} from "network/goods.js";
export default {
  name: "params",
  data() {
    return {
      catelist: [],
      currentCate: [],
      activeName: "many",
      isTabClickable: true,
      onlyList: [],
      manyList: [],
      showAddParams: false,
      addParamsForm: {
        attr_name: "",
        attr_vals: "",
      },
      editParamsForm: {
        attr_name: "",
        attr_vals: "",
      },
      addParamsRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      currentParam: {},
      showEdit: false,
      showDelete: false,
    };
  },
  created() {
    this.getCate();
  },
  computed: {
    isBtnDisable() {
      return this.currentCate.length !== 3;
    },
    // 最后一个分类的ID。
    cateId() {
      if (this.currentCate.length === 3) {
        return this.currentCate[2];
      }

      return null;
    },
    addWhat() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
    // valsArr(vals) {
    //   return function(param) {
    //     //   每一行的添加按钮的文本框的值和隐藏显示
    //     param.inputVisible = false;
    //     console.log("计算属性被触发");
    //     // this.$set(param, "inputVisible", false);
    //     vals.inputValue = "";
    //     return param.attr_vals == "" ? [] : param.attr_vals.split(" ");
    //   };
    // },
  },
  methods: {
    handleTabClick() {},
    //   获取分类信息
    getCate() {
      getCategories({}).then((res) => {
        if (res.data.meta.status != 200)
          return this.$message.error("获取分类信息失败");
        this.catelist = res.data.data;
      });
    },
    // 获取参数列表
    getParamsList() {
      if (!this.cateId) return;
      getParams(this.cateId, this.activeName).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("请求参数失败！");
        res.data.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          item.inputVisible = false;
          item.inputValue = "";
        });
        if (this.activeName === "many") {
          this.manyList = res.data.data;
        } else {
          this.onlyList = res.data.data;
        }
      });
    },
    // 分类发生变化
    CateChange() {
      if (this.currentCate.length < 3) {
        this.currentCate = [];
        this.manyList = [];
        this.onlyList = [];
        return;
      }
      //   根据所选分类ID和当前所选面板获取对应参数
      console.log(this.cateId);
      this.getParamsList();
    },
    // 显示添加分类对话框
    showAdd() {
      this.showAddParams = true;
    },
    // 添加参数
    addParams(bool) {
      this.showAddParams = false;
      this.$refs.paramsForm.validate((valid) => {
        console.log(valid);
        if (!valid) return;
        addParams(
          this.cateId,
          this.addParamsForm.attr_name,
          this.activeName,
          this.addParamsForm.attr_vals
        ).then((res) => {
          console.log(res);
          if (res.data.meta.status !== 201)
            return this.$message.error("添加参数失败！");
          this.$message.success("添加参数成功！");
          this.getParamsList();
        });
      });
      if (!bool) return;
    },
    // 关闭对话框时重置表单
    resetForm() {
      this.$refs.paramsForm.resetFields();
    },
    // 关闭编辑对话框时重置表单
    resetEditForm() {
      this.$refs.editForm.resetFields();
    },
    // 显示编辑对话框
    showEditParams(param) {
      this.showEdit = true;
      this.currentParam = param;
      console.log(param);
      searchParams(this.cateId, param).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取参数失败");
        this.editParamsForm.attr_name = res.data.data.attr_name;
      });
    },
    // 显示删除对话框
    showDeleteParams(param) {
      this.showDelete = true;
      this.currentParam = param;
    },
    // 发送编辑参数请求
    sendEditRequest(refresh = true) {
      editParam(
        this.cateId,
        this.editParamsForm.attr_name,
        this.currentParam,
        this.editParamsForm.attr_vals
      ).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("编辑参数失败");
        this.$message.success("编辑参数成功");
        if (refresh) this.getParamsList();
      });
    },
    // 修改/编辑参数
    editParam(bool) {
      this.showEdit = false;
      if (!bool) return;
      this.$refs.editForm.validate((val) => {
        //   先得到原有的attr_vals
        this.editParamsForm.attr_vals = this.currentParam.attr_vals.join(" ");
        console.log(this.editParamsForm.attr_vals);
        if (!val) return;
        this.sendEditRequest();
      });
    },
    // 删除参数
    deleteParam(bool) {
      this.showDelete = false;
      if (!bool) return;
      deleteParam(this.cateId, this.currentParam.attr_id).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("删除参数失败");
        this.$message.success("删除参数成功");
        this.getParamsList();
      });
    },
    // 显示tag输入框
    showInput(param) {
      //   param.inputVisible = true;
      this.$set(param, "inputVisible", true);
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加新tag
    handleInputConfirm(param) {
      this.currentParam = param;
      let inputValue = param.inputValue;
      if (inputValue.trim() != "") {
        param.attr_vals.push(inputValue);
        this.editParamsForm.attr_vals = param.attr_vals.join(" ");
        this.editParamsForm.attr_name = param.attr_name;
        this.sendEditRequest(false);
      }
      param.inputVisible = false;
      param.inputValue = "";
    },
    // 删除tag
    deleteVals(param, index) {
      this.currentParam = param;
      console.log(index);
      console.log(param.attr_vals);
      param.attr_vals.splice(index, 1);
      this.editParamsForm.attr_vals = param.attr_vals.join(" ");
      this.editParamsForm.attr_name = param.attr_name;
      this.sendEditRequest(false);
    },
  },
  watch: {
    activeName(newval) {
      this.getParamsList();
    },
  },
};
</script>

<style scoped>
.input-new-tag1 {
  width: 80px;
  margin-right: 10px;
}
.chosetype {
  margin: 20px 0;
}
</style>
