<template>
  <div class="role">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">登陆</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加用户确认框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="showAdd"
      width="30%"
      @close="adddialogClose"
    >
      <!-- 新添加的角色信息 -->
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRoleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRole(false)">取 消</el-button>
        <el-button type="primary" @click="addRole(true)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色信息确认框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="showEdit"
      width="30%"
      class="edit"
    >
      <el-form
        :model="editRoleForm"
        :rules="addRoleRules"
        ref="editRoleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRole(false)">取 消</el-button>
        <el-button type="primary" @click="editRole(true)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除用户对话框 -->
    <el-dialog
      title="删除用户"
      :visible.sync="showDelete"
      width="30%"
      class="edit"
    >
      <span>确定要删除该角色吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteRole(false)">取 消</el-button>
        <el-button type="primary" @click="deleteRole(true)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showGiveRight"
      width="30%"
      @close="clearDefKeys"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="rightsTree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="giveRoleRights(false)">取 消</el-button>
        <el-button type="primary" @click="giveRoleRights(true)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAdd = true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="roleList" style="width: 100%" border stripe>
        <!-- 将type设置为expand 则每一行都是可展开的。 -->
        <el-table-column type="expand" label="#" class="index">
          <template slot-scope="slot">
            <el-row
              v-for="(item, index) of slot.row.children"
              :key="item.id + '1' + index"
              :class="['bdtop', 'row-center']"
            >
              <!-- 一级菜单 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(slot.row, item.id)">
                  {{ item.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级菜单和三级菜单 -->
              <el-col :span="19">
                <!-- 二级菜单 -->
                <el-row
                  v-for="(item2, index2) of item.children"
                  :class="['bdtop', 'bdbot']"
                  :key="item2.id + '2' + index2"
                  class="row-center"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(slot.row, item2.id)"
                    >
                      {{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级菜单 -->
                  <el-col :span="13">
                    <el-row
                      v-for="(item3, index3) of item2.children"
                      :key="item3.id + '3' + index3"
                    >
                      <el-tag
                        type="warning"
                        closable
                        @close="removeRightById(slot.row, item3.id)"
                      >
                        {{ item3.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-row>
                  </el-col>
                  <!-- !三级菜单完毕 -->
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="slot">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditRole(slot.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="showDeleteRole(slot.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showgiveRights(slot.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  editRole,
  searchRole,
  deleteRole,
  removeRight,
  getAllRight,
  changeRight,
} from "network/rights.js";
export default {
  name: "roles",
  created() {
    this.getRoles();
  },
  data() {
    return {
      roleList: [],
      showAdd: false,
      addRoleForm: {},
      editRoleForm: {},
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 2, max: 14, message: "长度在2到14个字之间" },
        ],
        roleDesc: [
          { min: 2, max: 30, message: "长度在2到30个字之间", trigger: "blur" },
        ],
      },
      editRoleRules: {},
      newRole: {},
      showEdit: false,
      showDelete: false,
      deleteId: "",
      showGiveRight: false,
      rightsList: [],
      // el-UI的树形组件树形绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 树形组件中默认选中的对应id数组
      defKeys: [],
      currentId: "",
    };
  },
  methods: {
    getRoles() {
      getRoleList().then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取角色列表失败");
        this.roleList = res.data.data;
        console.log(res.data.data);
      });
    },
    adddialogClose() {
      // this.$refs.addRoleForm.resetFields();
    },
    addRole(bool) {
      this.showAdd = false;
      if (!bool) {
        this.$refs.addRoleForm.resetFields();
        return;
      }
      this.$refs.addRoleForm.validate((res) => {
        if (!res) {
          this.$refs.addRoleForm.resetFields();
          return;
        }
        addRole(this.addRoleForm).then((res) => {
          console.log(res);
          if (res.data.meta.status != 201)
            return this.$message.error("添加角色失败");
          this.$message.success("添加角色成功");
          this.getRoles();
          this.$refs.addRoleForm.resetFields();
        });
      });
    },
    showEditRole(id) {
      this.showEdit = !this.showEdit;
      console.log(id);
      this.editRoleForm.id = id;
      searchRole(id).then((res) => {
        console.log(res.data.data);
        this.editRoleForm = res.data.data;
        console.log(this.editRoleForm);
      });
    },
    editRole(bool) {
      this.showEdit = false;
      if (!bool) return;
      console.log(this.editRoleForm, bool);
      editRole(this.editRoleForm).then((res) => {
        if (res.data.meta.status != 200)
          return this.$message.error("编辑角色失败！");
        this.$message.success("编辑角色成功！");
        this.getRoles();
      });
    },
    showDeleteRole(id) {
      this.showDelete = true;
      console.log(id);
      this.deleteId = id;
    },
    deleteRole(bool) {
      this.showDelete = false;
      if (!bool) return;
      deleteRole(this.deleteId).then((res) => {
        if (res.data.meta.status != 200)
          return this.$message.error("删除失败！");
        this.$message.success("删除成功！");
        this.getRoles();
      });
    },
    showgiveRights(role) {
      // 得到当前角色
      // let thisRole = this.roleList.find((item, index) => item.id == id);
      this.pushDefKeys(role, this.defKeys);
      this.showGiveRight = true;
      this.currentId = role.id;
      getAllRight("tree").then((res) => {
        if (res.data.meta.status != 200)
          return this.$message.error("请求权限失败");
        this.rightsList = res.data.data;
        //通过点击按钮传来对应角色的id载roleList内找到对应的角色数据
        //把角色数据内所有的三级权限的idpush到默认选中框数组中
        // for (let firstlist of thisRole.children) {
        //   for (let secondlist of firstlist.children) {
        //     for (let thirdlist of secondlist.children) {
        //       this.defKeys.push(thirdlist.id);
        //     }
        //   }
        // }
        console.log(this.defKeys);
      });
    },
    //递归获取所有三级权限的id
    pushDefKeys(thisRole, arr) {
      if (!thisRole.children) {
        return arr.push(thisRole.id);
      }
      thisRole.children.forEach((item) => this.pushDefKeys(item, arr));
    },
    removeRightById(role, rightId) {
      console.log(role, rightId);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          removeRight(role.id, rightId).then((res) => {
            if (res.data.meta.status != 200)
              return this.$message.error("删除失败");
            role.children = res.data.data;
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    clearDefKeys() {
      this.defKeys = [];
      this.currentId = "";
    },
    giveRoleRights(bool) {
      this.showGiveRight = false;
      if (!bool) return;
      let allCheckedKeys = [
        ...this.$refs.rightsTree.getHalfCheckedKeys(),
        ...this.$refs.rightsTree.getCheckedKeys(),
      ].join(",");
      changeRight(this.currentId, allCheckedKeys).then((res) => {
        if (res.data.meta.status != 200)
          return this.$message.error("更新权限失败！");
        this.$message.success("更新权限成功！");
        this.getRoles();
      });
    },
  },
};
</script>

<style scoped>
.row-center {
  display: flex;
  align-items: center;
}
.bdtop {
  border-top: 1px solid #eee;
  margin-top: -1px;
}
.bdtop:first-child {
  border-top: 1px solid transparent;
}
.bdbot {
  border-bottom: 1px solid #eee;
}
</style>
