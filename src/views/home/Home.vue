<template>
  <el-container style="height: 700px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-active="params.Category">
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

    <el-container>
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
            size="medium"
            type="primary"
            icon="el-icon-search"
            @click="searchGoods"
            >搜索</el-button
          >
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
              Math.floor(
                new Date(new Date(item.endTime).getTime() - currentTime) /
                  (60 * 60 * 1000)
              )
            }}&nbsp;:
            {{
              Math.floor(
                new Date(new Date(item.endTime).getTime() - currentTime) /
                  (60 * 1000)
              )
            }}&nbsp;:
            {{
              Math.floor(
                (new Date(new Date(item.endTime).getTime() - currentTime) %
                  (60 * 1000)) /
                  1000
              )
            }}&nbsp;
          </div>
        </div>
      </div>
      <div v-else>没有商品啦！！！</div>

      <el-footer>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="400"
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
      sideList: [],
      goodsList: [],
      nextFlag: true,
      loading: true,
      currentTime: new Date().getTime(),
      params: {
        Keyword: "",
        Category: 1319,
        PageIndex: 1,
        PageSize: 20
      }
    };
  },
  mounted() {
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
          res.data.data.forEach(item => {
            this.sideList.push(item);
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    //请求商品数据
    getGoods(params) {
      this.loading = true;
      getGoodsList(params)
        .then(res => {
          this.loading = false;
          this.goodsList = [];
          this.currentTime = new Date().getTime();
          res.data.data.data.forEach(good => {
            good.startTime = new Date(good.startTime).getTime();
            good.endTime = new Date(good.endTime).getTime();
            this.goodsList.push(good);
          });
          if (res.data.data.data.length < 8) {
            this.nextFlag = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    changeCateGory(item) {
      this.params.Category = item.categoryId;
      this.params.PageIndex = 1;
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
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  align-content: flex-start;
}
.goods {
  width: 200px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
}
.paging span {
  font-size: 30px;
  font-weight: bold;
  padding: 0 10px;
  cursor: pointer;
}
.search {
  margin-top: 15px;
}
.search-input {
  width: 200px;
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
  background-color: #ff8c00;
}
.underway {
  background-color: #55ff00;
}
.finish {
  background-color: #b3b3b3;
}
</style>
