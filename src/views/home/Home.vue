<template>
  <el-container style="height: 937px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-active="737">
        <el-menu-item 
          v-for="item in sideList" 
          :key="item.categoryId"
          :index="item.categoryId"
          @click="changeCateGory(item)">
          {{item.categoryName}}
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <div class="goods-wrapper" :v-loading="loading">
      <div class="goods" v-for="item in goodsList" :key="item.Id">
        <div class="goods-img">
          <a :href="item.link">
            <img :src="item.primaryPic">
          </a>
        </div>
        <div class="desc"><span>{{item.productName}}</span></div>
        <span>{{'￥'+item.maxPrice}}</span>
      </div>
    </div>



  </el-container>
</template>

<script>
import { getCategroyList } from "@/api/category.js"
import { getGoodsList } from "@/api/goods.js"


export default {
  data() {
    return {
      sideList: [
        {categoryId: 737,categoryName: '家用电器'},
        {categoryId: 7137,categoryName: '厨房电器'},
        {categoryId: 7237,categoryName: '汽车用品'},
        {categoryId: 7337,categoryName: '图书'},
        {categoryId: 7437,categoryName: '运动器材'},
      ],
      goodsList: [],
      loading: false,
      params: {
        Category: 737,
        PageIndex: 1,
        PageSize: 20
      }
    }
  },
  mounted() {
   this.init()
  },
  methods:{
    init() {
      // 请求分类数据
      getCategroyList()
        .then(res => {
          res.data.data.forEach(item => {
            this.sideList.push(item)
          })
        })
        .catch(error => {
          console.log(error);
        });

       //请求商品数据
      getGoodsList(this.params)
        .then(res => {
          this.goodsList = res.data.data.data;
        })
        .catch(error => {
          console.log(error);
        })
    },
    
    changeCateGory(item) {
      this.loading = true;
      this.params.Category = item.categoryId;
      this.params.PageIndex = 1;
      getGoodsList(this.params).then(res => {
        this.loading = false;
        this.goodsList = res.data.data.data;
      })
      .catch(error => {
        console.log(error);
      })
    }
  },

}
</script>

<style>
.goods-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-content: flex-start;
}
.goods {
  width:200px;
  height: 200px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.goods-img{
  display: block;
  width: 100px;
  height: 100px;
}
.goods-img img {
  width: 100%;
  height: 100%;
}
.desc {
  display: block;
  height: 20px;
  width: 200px;
  padding: 20px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>