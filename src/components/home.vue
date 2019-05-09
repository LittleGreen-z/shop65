<template>
  <div class="dd">
    <el-container class="container">
      <el-header>
        <el-row>
          <el-col :span="4">
            <img src="../assets/logo.png" alt="图片加载失败">
          </el-col>
          <el-col :span="19" class="middle">
            <h2>电商后台管理系统</h2>
          </el-col>
          <el-col :span="1" class="logout">
            <a href="#" class="logout" @click.prevent="handleLoginout()">退出</a>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            :unique-opened="true"
            :router="true"
          >
          <!-- 导航一 -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="users">
                <i class="el-icon-s-grid"></i>
                <span>用户列表</span>
                </el-menu-item>
            </el-submenu>
            <!-- 导航二 -->
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="roles">
                <i class="el-icon-s-grid"></i>
                <span>角色列表</span>
                </el-menu-item>
                <el-menu-item index="rights">
                <i class="el-icon-s-grid"></i>
                <span>权限列表</span>
                </el-menu-item>
            </el-submenu>
            <!-- 导航三 -->
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="1-1">
                <i class="el-icon-s-grid"></i>
                <span>商品列表</span>
                </el-menu-item>
                <el-menu-item index="1-1">
                <i class="el-icon-s-grid"></i>
                <span>分类参数</span>
                </el-menu-item>
                <el-menu-item index="1-1">
                <i class="el-icon-s-grid"></i>
                <span>商品分类</span>
                </el-menu-item>
            </el-submenu>
            <!-- 导航四 -->
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item index="1-1">
                <i class="el-icon-s-grid"></i>
                <span>订单列表</span>
                </el-menu-item>
            </el-submenu>
            <!-- 导航五-->
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item index="1-1">
                <i class="el-icon-s-grid"></i>
                <span>数据报表</span>
                </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  beforeMount () {
    if (!localStorage.getItem('token')) {
      this.$router.push({
        name: 'login'
      })
      this.$message.warning('请先登录')
    }
  },
  methods: {
    handleLoginout () {
      localStorage.clear()
      this.$router.push({
        name: 'login'
      })
      this.$message.warning('退出成功')
    }
  }
}
</script>

<style>
.dd {
  height: 100%;
}
.container {
  background-color: #b3c0d1;
  height: 100%;
}
.middle {
  line-height: 60px;
  text-align: center;
  color: #ffffff;
  height: 100%
}
.logout {
  line-height: 60px;
  text-decoration: none;
}
</style>
