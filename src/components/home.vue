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
            <el-submenu :key="item1.id" v-for="item1 in menus" :index="item1.order+''">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item1.authName}}</span>
              </template>
              <el-menu-item :key="item2.id" v-for="item2 in item1.children" :index="item2.path+''">
                <i class="el-icon-s-grid"></i>
                <span>{{item2.authName}}</span>
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
  data () {
    return {
      menus: []
    }
  },
  beforeMount () {

  },
  created () {
    this.getMenus()
  },
  methods: {
    async getMenus () {
      const res =await this.$http.get('menus')
      console.log(res)
      const {meta: {msg,status},data} = res.data
      if(status === 200) {
        this.menus = data
      }
    },
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
