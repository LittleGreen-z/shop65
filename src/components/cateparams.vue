<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
    <el-alert title="注意：只允许为第三分类设置参数" class="alert" type="warning" show-icon></el-alert>
    <el-form label-position="left" label-width="120px" :model="form" class="form">
      <el-form-item label="请选择商品参数">
        <el-cascader
          expand-trigger="hover"
          :options="options"
          :props="defaultProp"
          v-model="selectedOptions"
          @change="handleChange"
          :show-all-levels="false"
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>
    <el-tabs @tab-click="changeTab()" type="border-card" v-model="active">
      <el-tab-pane name="1" label="动态参数">
        <el-button>设置动态参数</el-button>
        <el-table height="450px" border stripe :data="arrDy" style="width: 100%">
          <!-- 序号 -->
          <el-table-column type="expand" width="120">
            <template slot-scope="scope">
              <el-tag
                :key="i"
                v-for="(item,i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,item)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" width="120"></el-table-column>

          <el-table-column prop="attr_name" label="属性名称"></el-table-column>

          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="2" label="静态参数">
        <el-button>设置静态参数</el-button>
        <el-table height="350px" border stripe :data="arrState" style="width: 100%">
          <!-- 序号 -->

          <el-table-column type="index" label="#" width="120"></el-table-column>

          <el-table-column prop="attr_name" label="属性名称" ></el-table-column>
          <el-table-column prop="attr_vals" label="属性值"  ></el-table-column>

          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      form: {},
      active: "1",
      options: [],
      arrDy: [],
      arrState: [],
      selectedOptions: [],
      inputVisible: false,
      inputValue: "",
      defaultProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    changeTab() {
      this.getDyOrStatic();
    },
    async handleClose(obj, item) {
      obj.attr_vals.splice(obj.attr_vals.indexOf(item), 1);
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}`,
        {
          attr_name: obj.attr_name,
          attr_sel: obj.attr_sel,
          attr_vals: obj.attr_vals.join(",")
        }
      );
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(obj) {
      let inputValue = this.inputValue;
      if (inputValue) {
        obj.attr_vals.push(inputValue);
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}`,
          {
            attr_name: obj.attr_name,
            attr_sel: obj.attr_sel,
            attr_vals: obj.attr_vals.join(",")
          }
        );
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // 获取动态或静态数据
    async getDyOrStatic() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning("请先选择三级分类");
        if (this.active === "1") {
          this.arrDy = [];
        }
        if (this.active === "2") {
          this.arrState = [];
        }
        return;
      }
      if (this.active === "1") {
        // 获取动态参数
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        const {
          meta: { status },
          data
        } = res.data;
        if (status === 200) {
          this.arrDy = data;
          this.arrDy.forEach(item => {
            if (item.attr_vals.trim().length === 0) {
              item.attr_vals = [];
            } else {
              item.attr_vals = item.attr_vals.trim().split(",");
            }
          });
          console.log(this.arrDy);
        }
      }
      if (this.active === "2") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        const {
          meta: { status },
          data
        } = res.data;
        if (status === 200) {
          this.arrState = data;
          console.log(this.arrState);
        }
      }
    },
    async handleChange() {
      this.getDyOrStatic();
    },
    async getGoodsCate() {
      const res = await this.$http.get("categories?type=3");
      const {
        meta: { status },
        data
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin: 20px 0;
}
</style>
