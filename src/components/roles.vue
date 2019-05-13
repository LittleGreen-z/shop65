<template>
  <el-card class="box">
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <el-button class="btn" type="primary">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roles" style="width: 100%" height="350px">
      <el-table-column type="expand" width="80">
        <template slot-scope="scope">
          <el-row v-for="(item1) in scope.row.children" :key="item1.id" class="level1">
            <el-col :span="4">
              <el-tag closable @close="deleRights(scope.row,item1)">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2) in item1.children" :key="item2.id" class="level2">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success"
                    @close="deleRights(scope.row,item2)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    v-for="(item3) in item2.children"
                    :key="item3.id"
                    class="level3"
                    type="warning"
                    @close="deleRights(scope.row,item3)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col>
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>

      <el-table-column prop="date" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" :plain="true"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" :plain="true"></el-button>
          <el-button
            type="success"
            @click="showDiaUserRights(scope.row)"
            icon="el-icon-check"
            circle
            size="mini"
            :plain="true"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
      <el-tree
      ref="treeDom"
       :data="treelist"
       show-checkbox
       node-key="id"
       :default-checked-keys="arrCheck"
       default-expand-all
       :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      roles: [],
      dialogFormVisible: false,
      treelist: [],
      arrCheck: [],
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      currRoleId: -1
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    // 设置权限
    async setRights () {
      const arr1 = this.$refs.treeDom.getCheckedKeys()
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys()
      const arr = [...arr1, ...arr2]
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(',')
      })
      const {
        meta: { status }
      } = res.data
      if (status === 200) {
        this.$message.success('修改成功')
        this.dialogFormVisible = false
        this.getRoles()
      }
    },
    // 删除权限
    async deleRights (role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}}`
      )
      const {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.$message.success('删除成功')
        role.children = data
      }
    },
    async showDiaUserRights (role) {
      this.currRoleId = role.id
      const res = await this.$http.get(`rights/tree`)
      const {meta: {status}, data} = res.data
      if (status === 200) {
        this.treelist = data

        const temp2 = []
        role.children.forEach(item1 => {
          temp2.push(item1.id)
          item1.children.forEach(item2 => {
            temp2.push(item2.id)
            item2.children.forEach(item3 => {
              temp2.push(item3.id)
            })
          })
        })
        this.arrCheck = temp2
      }
      this.dialogFormVisible = true
    },
    async getRoles () {
      const res = await this.$http.get(`roles`)
      const {
        data,
        meta: { status }
      } = res.data
      if (status === 200) {
        this.roles = data
        console.log(this.roles)
      }
    }
  }
}
</script>

<style>
.box {
  height: 100%;
}
.btn {
  margin-top: 10px;
}
.level1,
.level2 {
  margin-bottom: 10px;
}
</style>
