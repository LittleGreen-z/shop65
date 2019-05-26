<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
    <el-alert title="添加商品信息" class="alert" type="info" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active*1" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-form label-position="top" label-width="80px" :model="form" class="form">
      <el-tabs @tab-click="changeTab()" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              expand-trigger="hover"
              :options="options"
              :props="defaultProp"
              v-model="selectedOptions"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item.attr_name" v-for="item in arrDy" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox border v-for="(item2,i) in item.attr_vals" :key="i" :label="item2"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item v-for="(item3,j) in arrState" :key="j" :label="item3.attr_name">
            <el-input v-model="item3.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-form-item></el-form-item>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <el-upload
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button  @click="addGoods()">添加商品</el-button>
            <quillEditor v-model="form.goods_introduce"></quillEditor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  name: "",
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      options: [],
      selectedOptions: [],
      defaultProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      arrDy: [],
      arrState: [],
      headers: {
        Authorization : localStorage.getItem('token')
      }

    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    async addGoods () {
      this.form.goods_cat = this.selectedOptions.join(',')
    //  动态
     const attr1 = this.arrDy.map(item => {
       return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      // 静态
      const attr2 = this.arrState.map(item => {
       return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      this.form.attrs = [...attr1, ...attr2]

      const res = await this.$http.post('goods', this.form)
      console.log(res)
      const {
            meta: {msg, status },
            data
          } = res.data;
          if (status === 201) {
           this.$message.success(msg)
           this.$router.push({
             name: 'goods'
           })
          }else {
            console.log(msg)
          }
    },
    handleRemove(file, fileList) {
       const index = this.form.pics.findIndex(item => {
        return item.pic = file.response.data.tmp_path
      })
      this.form.pics.splice(index,1)
      console.log(this.form.pics)
      },
      handleSuccess(response, file, fileList) {
        this.form.pics.push({
          pic: response.data.tmp_path
        })
        console.log(this.form.pics)
      },
    async changeTab() {
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请选择三级分类");
          if (this.active === '2') {
            this.arrDy = []
          }else {
            this.arrState = []
          }
          return;
        }
        // 静态数据
        if (this.active === "3") {
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
        // 动态数据
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
        }
      }
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
    },
    handleChange() {}
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.form {
  height: 350px;
  overflow: auto;
}
.ql-container {
  min-height: 200px
}
</style>
