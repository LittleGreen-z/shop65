<template>
  <div class=td>
    <el-card class="box">
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row class="seartBox">
        <el-col>
          <el-input class="searchInput" placeholder="请输入内容" v-model="query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="success">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: ''
    }
  }
}
</script>

<style>
.td {
  height: 100%;
}
.box {
  height: 100%
}
.seartBox {
  margin-top: 20px
}
.searchInput {
  width: 350px
}
</style>
