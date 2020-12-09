<template>
  <el-container style="border: 1px solid #eee"
                :style="'height:' + homeHeight">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-active="params.Category[0]">
        <el-menu-item
          v-for="item in sideList"
          :key="item.categoryId"
          :index="item.categoryId"
          @click="changeCateGory(item)"
        >
          {{ item.categoryName }}
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container style="overflow: auto">
      <el-header>
        <div class="search">
          <el-input
            class="search-input"
            type="text"
            size="medium"
            v-model="params.Keyword"
            placeholder="请输入内容"
          >
          </el-input>
          <el-button
            class="search-button"
            size="medium"
            type="primary"
            icon="el-icon-search"
            @click="searchGoods"
          >搜索
          </el-button>
        </div>
      </el-header>
      <div
        class="goods-wrapper"
        v-loading="loading"
        v-if="goodsList.length > 0"
      >
        <div class="goods" v-for="item in goodsList" :key="item.Id">
          <div class="goods-img">
            <a :href="item.link" target="_blank">
              <img :src="item.primaryPic" />
            </a>
          </div>
          <div class="goods-price">
            <span class="current-price">{{ "￥" + item.currentPrice }}</span>
            <span class="capped-price">{{ "￥" + item.cappedPrice }}</span>
          </div>
          <div class="goods-desc">
            <p>{{ item.productName }}</p>
          </div>
          <div v-if="item.startTime > currentTime" class="state not-start">
            未开始
          </div>
          <div v-else-if="item.endTime < currentTime" class="state finish">
            已结束
          </div>
          <div v-else class="state underway">
            {{
              Math.floor((new Date(item.endTime).getTime() - currentTime) / (60 * 60 * 1000))
            }}&nbsp;:
            {{
              Math.floor((new Date(item.endTime).getTime() - currentTime) / (60 * 1000))
            }}&nbsp;:
            {{
              Math.floor((new Date(item.endTime).getTime() - currentTime) % (60 * 1000) /1000)
            }}
          </div>
        </div>
      </div>
      <el-alert
        v-else
        title="当前分类没有商品"
        type="warning"
        description="请点击其他分类获取商品"
        show-icon>
      </el-alert>

      <el-footer>
        <el-pagination
          class="paging"
          background
          layout="total, prev, pager, next, jumper"
          :total="total"
          :page-size="params.PageSize"
          :current-page="params.PageIndex"
          @current-change="currentPage"
          @prev-click="prevPage"
          @next-click="nextPage"
        >
        </el-pagination>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { getCategroyList } from "@/api/category.js";
import { getGoodsList } from "@/api/goods.js";

export default {
  data() {
    return {
      homeHeight: '',
      sideList: [],
      goodsList: [],
      loading: true,
      total: '',
      currentTime: new Date().getTime(),
      params: {
        Keyword: '',
        Category: [],
        PageIndex: 1,
        PageSize: 12
      }
    };
  },
  mounted() {
    this.homeHeight = document.documentElement.clientHeight + 'px';
    this.loading = false;
    this.getCategroy();
    this.getGoods(this.params);
    setInterval(() => {
      this.currentTime = new Date().getTime();
    }, 1000);
  },
  methods: {
    // 请求分类数据
    getCategroy() {
      getCategroyList()
        .then(res => {
          console.log(res);
          if(res.data.data.length == 0) {
            this.$router.push({path:'/empty'});
          }else {
            res.data.data.forEach(item => {
            this.sideList.push(item);
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.$router.push({path:'/empty'});
        });
    },

    //请求商品数据
    getGoods(params) {
      this.loading = true;
      getGoodsList(params)
        .then(res => {
          this.loading = false;
          this.total = res.data.data.total;
          this.goodsList = [];
          this.currentTime = new Date().getTime();
          res.data.data.data.forEach(good => {
            good.startTime = new Date(good.startTime).getTime();
            good.endTime = new Date(good.endTime).getTime();
            this.goodsList.push(good);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    changeCateGory(item) {
      this.params.Keyword = '';
      this.params.PageIndex = 1;
      if(item.categoryId == '') {
        this.params.Category = [];
      }else {
        this.params.Category = [];
        this.params.Category.push(item.categoryId);
      }
      this.getGoods(this.params);
    },

    prevPage() {
      this.params.PageIndex -= 1;
      this.getGoods(this.params);
    },

    nextPage() {
      this.params.PageIndex += 1;
      this.getGoods(this.params);
    },

    currentPage(val) {
      this.params.PageIndex = val;
      this.getGoods(this.params);
    },

    searchGoods() {
      this.params.PageIndex = 1;
      this.getGoods(this.params);
    },

    timeLag(time) {
      let e = new Date(time).getTime();
      let lag = e - this.currentTime;
      return new Date(lag);
    }
  }
};
</script>

<style>

.goods-wrapper {
  width: 1600px;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
.goods {
  width: 200px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 25px 0 0 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  float: left;
}
.goods-img {
  display: block;
  width: 150px;
  height: 150px;
}
.goods-img img {
  width: 100%;
  height: 100%;
}
.goods-desc {
  margin-top: 5px;
  height: 30px;
  color: #666;
  font-size: 12px;
}
.goods-desc p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.goods-price {
  margin-top: 5px;
  width: 200px;
}
.current-price {
  color: orangered;
  font-size: 20px;
  padding-right: 2px;
}
.capped-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
}
.paging {
  margin-top: 25px;
}
.paging span{
  padding: 0 5px;
  background-color: #f4f4f5;
  font-weight: 600;
}
.search {
  margin-top: 15px;
}
.search-input {
  width: 300px;
}
.search-button {
  transform: translate(-100%,0);
  border-radius: 0 4px 4px 0;
}
.state {
  width: 200px;
  height: 25px;
  border-radius: 3px;
  margin-top: 10px;
  line-height: 25px;
  text-align: center;
  font-size: 16px;
  color: #fff;
}
.not-start {
  background-color: #E6A23C ;
}
.underway {
  background-color: #67C23A;
}
.finish {
  background-color: #909399;
}
</style>
