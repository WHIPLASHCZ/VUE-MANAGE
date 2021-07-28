<template>
  <div class="add">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">登陆</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/goods' }"
        >商品列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dialog title="提示" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="img" />
    </el-dialog>

    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps :active="activeIndex - 0" align-center class="step">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="tabChange"
          @tab-click="getParams"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  children: 'children',
                  value: 'cat_id',
                }"
                @change="CateChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="(i, index) of goodParam"
              :label="i.attr_name"
              :key="i.attr_id"
            >
              <el-checkbox-group v-model="i.attr_vals">
                <el-checkbox
                  v-for="(i, index) of i.attr_vals"
                  :label="i"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="(i, index) of goodProp"
              :label="i.attr_name"
              :key="index"
            >
              <el-input v-model="i.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- <el-button type="primary" @click="upload">上传图片</el-button> -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              list-type="picture"
              :headers="headerObj"
              :on-success="uploadDone"
              :on-remove="removePic"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce">123</quill-editor>
            <div class="btnbox">
              <el-button type="primary" @click="addGood" class="add"
                >添加商品</el-button
              >
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getCategories, getParams, addGood } from "network/goods.js";
import _ from "lodash";
export default {
  name: "add",
  data() {
    return {
      activeIndex: 0,
      tabPosition: "left",
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: "",
        pics: [],
        attrs: [],
        goods_introduce: "",
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      currentCate: [],
      //   新增商品的动态属性
      goodParam: [],
      //   新增商品的静态属性
      goodProp: [],
      paramSelectedList: [],
      catelist: [],
      uploadUrl: "http://timemeetyou.com:8889/api/private/v1/upload",
      // 图片上传组件的请求头
      headerObj: {
        Authorization: sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible: false,
      //   fileList: [],
    };
  },
  created() {
    this.getCate();
  },
  computed: {
    // 最后一个分类的ID。
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  methods: {
    getCate() {
      getCategories({}).then((res) => {
        if (res.data.meta.status != 200)
          return this.$message.error("获取分类信息失败");
        this.catelist = res.data.data;
      });
    },
    // 必须选中三级分类
    CateChange() {
      if (this.addForm.goods_cat.length < 3) {
        this.addForm.goods_cat = [];
      }
    },
    tabChange(active, oldactive) {
      if (this.addForm.goods_cat.length !== 3 && oldactive === "0") {
        this.$message.error("请选择三级商品分类！");
        return false;
      }
    },
    getParams() {
      if (this.activeIndex == "1") {
        getParams(this.cateId, "many").then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error("获取参数失败");
          console.log(res);
          res.data.data.forEach((item) => {
            item.attr_vals = item.attr_vals.includes(" ")
              ? item.attr_vals.split(" ")
              : item.attr_vals.split(",");
          });
          //   保存所有动态参数
          this.goodParam = res.data.data;
        });
      } else if (this.activeIndex == "2") {
        getParams(this.cateId, "only").then((res) => {
          console.log(res);
          //   保存所有静态属性
          this.goodProp = res.data.data;
        });
      }
    },
    // 当图片成功上传到后端 我们需要把后端返回的图片临时存储地址添加到addForm对象中
    uploadDone(res, file, file_list) {
      console.log(res);
      if (res.meta.status != 200) return this.$message.error("添加图片失败");
      this.addForm.pics.push({ pic: res.data.tmp_path });
      console.log(this.addForm);
    },
    // 预览图片
    handlePreview(file) {
      this.previewVisible = true;
      console.log("preview");
      this.previewPath = file.response.data.url;
    },
    // 删除图片
    removePic(file) {
      // 获取删除图片的临时路径
      let removePath = file.response.tmp_path;
      // 在addForm找到这个临时路径
      let id = this.addForm.pics.findIndex(
        (item, index) => item.tmp_path === removePath
      );
      // 将这个路径移除
      this.addForm.pics.splice(id, 1);
      console.log(this.addForm);
    },
    // 提交商品信息 添加商品
    addGood() {
      this.$refs.addForm.validate((valid) => {
        if (!valid) {
          this.$message.error("请填写全部必填项！");
        }
        // 使用lodash的深拷贝 拷贝addform对象。
        const sendForm = _.cloneDeep(this.addForm);
        sendForm.goods_cat = sendForm.goods_cat.join(",");
        console.log(sendForm);

        // 处理动态参数
        this.goodParam.forEach((item) => {
          const newParam = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newParam);
        });
        // 处理静态属性
        this.goodProp.forEach((item) => {
          const newProp = {
            attr_id: item.attr_id,
            attr_value: item,
          };
          this.addForm.attrs.push(newProp);
        });

        sendForm.attrs = this.addForm.attrs;
        console.log(sendForm);
        // 发送添加商品请求
        addGood(sendForm).then((res) => {
          console.log(res);
          if (res.data.meta.status !== 201 && res.data.meta.status !== 400)
            return this.$message.error("添加商品失败！");
          this.$message.success("添加商品成功！");
          this.$router.push("/home/goods");
        });
      });
    },
  },
};
</script>

<style scoped>
.el-checkbox {
  margin: 5px 8px 0 0 !important;
}
.img {
  width: 100%;
}
.btnbox {
  width: 100%;
  text-align: center;
}
.add {
  margin-top: 20px;
}
</style>
