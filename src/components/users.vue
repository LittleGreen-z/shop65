<template>
  <div class="td">
    <el-card class="box">
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row class="seartBox">
        <el-col>
          <el-input
            clearable
            @clear="getAllUser()"
            class="searchInput"
            placeholder="请输入内容"
            v-model="query"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
          </el-input>
          <el-button type="success" @click="showDiaAddUser()">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="list" style="width: 100%" height="350px">
        <el-table-column prop="id" label="#" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
        <el-table-column prop="create_time" label="创建日期" width="140">
          <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
        </el-table-column>
        <el-table-column label="用户状态" width="140">
          <template slot-scope="scope">
            <el-switch
              @change="changeState(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="showDiaEditUser(scope.row)"
              icon="el-icon-edit"
              circle
              size="mini"
              :plain="true"
            ></el-button>
            <el-button
              type="danger"
              @click="showMsgBoxDele(scope.row)"
              icon="el-icon-delete"
              circle
              size="mini"
              :plain="true"
            ></el-button>
            <el-button
              type="success"
              @click="showDiaUserRole(scope.row)"
              icon="el-icon-check"
              circle
              size="mini"
              :plain="true"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
        <el-form label-position="left" label-width="80px" :model="formdata">
          <el-form-item label="用户名">
            <el-input v-model="formdata.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="formdata.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formdata.email"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="formdata.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑用户对话框 -->
      <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
        <el-form label-position="left" label-width="80px" :model="formdata">
          <el-form-item label="用户名">
            <el-input v-model="formdata.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formdata.email"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="formdata.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="EditUser()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
        <el-form :model="formdata" label-position="left" label-width="80px">
          <el-form-item label="用户名" >
            {{formdata.username}}
          </el-form-item>
          <el-form-item label="角色" >
            <el-select v-model="searchVal" placeholder="请选择角色">
              <el-option label="请选择" :value="-1" disabled></el-option>
              <el-option v-for='(item) in roles' :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
          <el-button type="primary" @click="setRole()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      formdata: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      list: [],
      total: -1,
      searchVal: -1,
      // 角色数组
      roles: [],
      currUserId: -1
    }
  },
  created () {
    this.getListdate()
  },
  methods: {
    async setRole () {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {rid: this.searchVal})
      const {
        meta: { status }
      } = res.data
      if (status === 200) {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.dialogFormVisibleRole = false
        this.getListdate()
      }
    },
    async showDiaUserRole (user) {
      this.formdata.username = user.username
      this.currUserId = user.id
      this.dialogFormVisibleRole = true
      const res = await this.$http.get(`roles`)
      this.roles = res.data.data
      const res2 = await this.$http.get(`users/${user.id}`)
      this.searchVal = res2.data.data.rid
    },
    async changeState (user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      )
      const {
        meta: { status }
      } = res.data
      if (status === 200) {
        this.$message({
          type: 'success',
          message: '状态修改成功!'
        })
        this.getListdate()
      }
    },
    async EditUser () {
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      )
      const {
        meta: { status }
      } = res.data
      if (status === 200) {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.dialogFormVisibleEdit = false
        this.getListdate()
      }
    },
    showDiaEditUser (user) {
      this.formdata = user
      this.dialogFormVisibleEdit = true
    },
    showMsgBoxDele (user) {
      this.$confirm('是否把我删掉?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`)
          const {
            meta: { status }
          } = res.data
          if (status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.pagenum = 1
            this.getListdate()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async addUser () {
      const res = await this.$http.post(`users`, this.formdata)
      const {
        meta: { status }
      } = res.data
      if (status === 201) {
        this.dialogFormVisibleAdd = false
        this.getListdate()
      }
    },
    async getListdate () {
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.list = data.users
        this.total = data.total
      }
    },
    handleSizeChange (val) {
      this.pagenum = 1
      this.pagesize = val
      this.getListdate()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getListdate()
    },
    searchUser () {
      this.pagenum = 1
      this.getListdate()
    },
    getAllUser () {
      this.getListdate()
    },
    showDiaAddUser () {
      this.dialogFormVisibleAdd = true
      this.formdata = {}
    }
  }
}
</script>

<style>
.td {
  height: 100%;
}
.box {
  height: 100%;
}
.seartBox {
  margin-top: 20px;
}
.searchInput {
  width: 350px;
}
.page {
  margin-top: 20px;
}
</style>
