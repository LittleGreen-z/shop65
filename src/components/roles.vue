<template>
  <el-card class="box">
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <el-button class="btn" type="primary">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roles" style="width: 100%" height="350px">
      <el-table-column type="expand"  width="80">
        <template slot-scope="scope">
          <el-row v-for="(item1) in scope.row.children" :key="item1.id" class="level1">
            <el-col :span='4'>
              <el-tag closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span='20'>
              <el-row v-for="(item2) in item1.children" :key="item2.id" class="level2">
                <el-col :span="4">
                  <el-tag closable type="success">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag closable v-for="(item3) in item2.children" :key="item3.id" class="level3" type="warning">
                    {{item3.authName}}
                  </el-tag>
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
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            :plain="true"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            :plain="true"
          ></el-button>
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
  </el-card>

</template>

<script>
export default {
  data () {
    return {
      roles: []
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    showDiaUserRights () {

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
.level1, .level2 {
  margin-bottom: 10px;
}
</style>
