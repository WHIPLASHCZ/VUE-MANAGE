<template>
  <div class="users">
    <!-- 添加用户确认框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      @close="dialogClose"
    >
      <!-- 新添加的用户信息 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addUser(false)">取 消</el-button>
        <el-button type="primary" @click="addUser(true)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息确认框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editVisible"
      width="30%"
      class="edit"
    >
      <el-form
        :model="editForm"
        :rules="addRules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUser(false)">取 消</el-button>
        <el-button type="primary" @click="editUser(true)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除用户对话框 -->
    <el-dialog
      title="删除用户"
      :visible.sync="deleteVisible"
      width="30%"
      class="edit"
    >
      <span>确定要删除该用户吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteUser(false)">取 消</el-button>
        <el-button type="primary" @click="deleteUser(true)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">登陆</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getusers"
          >
            <el-button
              slot="prepend"
              icon="el-icon-search"
              @click="getusers"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = !dialogVisible"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户信息 -->
      <el-table :data="list" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" class="index"></el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="mobile" label="注册手机"> </el-table-column>
        <el-table-column prop="email" label="注册邮箱"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 通过scope.row拿到当前循环item 获取到对应值 绑定开关 -->
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="scope.row.mg_state"
              @change="statechange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="220">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改信息"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEdit(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="showDelete(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- <div v-for="i of list" :key="i.id" class="text item">
        {{ i.role_name }} / {{ i.username }} / {{ i.create_time }} /
        {{ i.mobile }} /
        {{ i.email }}
      </div> -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getUserlist,
  changeUserState,
  addUser,
  search,
  changeUser,
  deleteUser,
} from "../../../../network/login.js";
// import { debounce } from "../../../../tools/tools.js";
export default {
  name: "users",
  data() {
    var checkEmail = (rule, val, callback) => {
      let res = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!res.test(val)) {
        callback(new Error("邮箱格式有误"));
      } else {
        callback();
      }
    };
    var checkPhone = (rule, val, callback) => {
      let reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!reg.test(val)) {
        callback(new Error("手机号格式有误"));
      } else {
        callback();
      }
    };
    return {
      search: "",
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      list: [],
      total: 0,
      dialogVisible: false,
      addForm: {},
      editVisible: false,
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 14, message: "长度在3到14个字之间" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在6到20个字之间" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { min: 6, max: 30, message: "长度在6到30个字之间" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 10, max: 12, message: "长度在10到12个字之间" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
      editForm: {},
      deleteId: "",
      deleteVisible: false,
    };
  },
  created() {
    this.getusers();
  },
  computed: {
    jumpToUser() {
      if (this.$route.path.includes("users")) return;
      return "users";
    },
  },
  methods: {
    getusers() {
      getUserlist(this.queryInfo).then((res) => {
        if (res.data.meta.status != 200)
          return this.$message.error("获取用户失败！");
        console.log(res);
        this.list = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getusers();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getusers();
    },
    statechange(item) {
      console.log(item);
      changeUserState(item).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("修改用户状态失败!");
          item.mg_state = !item.mg_state;
        }
      });
    },
    showSearch() {
      console.log(this.search);
    },
    handleClose() {},
    addUser(bool) {
      this.dialogVisible = false;
      if (!bool) return;
      this.$refs.addForm.validate((valid) => {
        if (!valid) return;
        // 发送添加用户的网络请求
        addUser(this.addForm).then((res) => {
          console.log(res);
          if (res.data.meta.status != 201)
            return this.$message.error("添加用户失败！");
          this.$message.success("添加用户成功！");
          this.getusers();
        });
      });
    },
    dialogClose() {
      this.$refs.addForm.resetFields();
    },
    showEdit(id) {
      console.log(id);
      this.editVisible = !this.editVisible;
      search(id).then((res) => {
        console.log(res);
        this.editForm = res.data.data;
      });
    },
    editUser(bool) {
      this.editVisible = false;
      this.$refs.editForm.clearValidate();
      if (!bool) return;
      this.$refs.editForm.validate((valid) => {
        console.log(valid);
        if (!valid) return this.$message.error("修改用户信息失败");
        if (valid && this.editForm.email != "" && this.editForm.mobile != "") {
          console.log(this.editForm);
          changeUser(this.editForm).then((res) => {
            if (res.data.meta.status !== 200)
              return this.$message.error("编辑用户信息失败！");
            this.getusers();
            this.$message.success("编辑用户信息成功！");
          });
        }
      });
    },
    showDelete(id) {
      this.deleteVisible = !this.deleteVisible;
      this.deleteId = id;
      console.log(this.deleteId);
    },
    deleteUser(bool) {
      this.deleteVisible = false;
      if (!bool) return;
      deleteUser(this.deleteId).then((res) => {
        if (res.data.meta.status != 200)
          return this.$message.error("删除失败！");
        this.$message.success("删除成功！");
        this.getusers();
      });
    },
  },
  watch: {
    // "queryInfo.query"(newval) {
    //   this.debounce(newval);
    // },
  },
};
</script>

<style scoped>
.edit {
  z-index: 999999;
}
.el-table {
  margin-top: 20px;
}
.cell div {
  text-align: center !important;
}
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
