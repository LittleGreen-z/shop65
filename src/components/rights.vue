<template>
  <el-card class="box">
    <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%" height="350px">
      <el-table-column type="index" label="#" width="160"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
      <el-table-column prop="path" label="路径" width="200"></el-table-column>
      <el-table-column  label="层级" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>

    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    this.getTableDate()
  },
  methods: {
    async getTableDate () {
      const res = await this.$http.get(`rights/list`)
      const {
        data,
        meta: { status }
      } = res.data
      if (status === 200) {
        this.list = data
      }
    }
  }
}
</script>

<style>
.box {
  height: 100%;
}
</style>
