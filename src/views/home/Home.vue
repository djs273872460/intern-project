<template>
  <el-container style="border: 1px solid #eee" :style="'height:' + homeHeight">
    <el-aside width="200px" class="side">
      <el-menu :default-active="currentCategory" style="border-right: 0">
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

    <el-container v-loading="loading" style="overflow: auto">
      <el-header class="header-wrapper">
        <div class="jd-self-only">
          <el-checkbox v-model="params.JdSelfOnly">只看自营</el-checkbox>
        </div>
        <div class="category-select">
          <el-select
            ref="select"
            v-model="childCategory"
            size="medium"
            multiple
            filterable
            style="margin-left: 20px; overflow: hidden; width: 360px"
            placeholder="请选择"
            @change="addChildCategory"
          >
            <el-option
              v-for="item in childCategoryList"
              :key="item.category"
              :label="item.categoryName"
              :value="item.category"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search">
          <el-tag
            v-for="tag in tags"
            :key="tag"
            closable
            :disable-transitions="false"
            class="tag"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>

          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="medium"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="medium"
            @click="showInput"
            >添加搜索tag
          </el-button>
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

      <div v-if="goodsList.length > 0" ref="goodsWrapper" class="goods-wrapper">
        <div v-for="item in goodsList" :key="item.Id" class="goods">
          <div class="goods-img">
            <a :href="item.link" target="_blank">
              <img :src="item.primaryPic" />
            </a>
          </div>
          <div class="goods-price">
            <span class="current-price">{{ "￥" + item.currentPrice }}</span>
            <span class="capped-price">{{ "￥" + item.cappedPrice }}</span>&nbsp;
            <span class="shop-desc">{{
              !item.shopId || item.shopId.length === 0
                ? "京东自营"
                : "第三方商家"
            }}</span>
          </div>
          <div class="goods-desc">
            <a :href="item.link" target="_blank" :title="item.productName">
              <p>{{ item.productName }}</p>
            </a>
          </div>
          <div v-if="item.startTime > currentTime" class="state not-start">
            未开始
          </div>
          <div v-else-if="item.endTime < currentTime" class="state finish">
            已结束
          </div>
          <div v-else class="state underway">
            <span
              v-if="
                Math.floor(
                  (new Date(item.endTime).getTime() - currentTime) /
                    (60 * 60 * 1000)
                ) < 10
              "
            >
              {{
                "0" +
                  Math.floor(
                    (new Date(item.endTime).getTime() - currentTime) /
                      (60 * 60 * 1000)
                  )
              }}
              :
            </span>
            <span v-else
              >{{
                Math.floor(
                  (new Date(item.endTime).getTime() - currentTime) /
                    (60 * 60 * 1000)
                )
              }}
              :
            </span>
            <span
              v-if="
                Math.floor(
                  (new Date(item.endTime).getTime() - currentTime) / (60 * 1000)
                ) < 10
              "
            >
              {{
                "0" +
                  Math.floor(
                    (new Date(item.endTime).getTime() - currentTime) /
                      (60 * 1000)
                  )
              }}
              :
            </span>
            <span v-else
              >{{
                Math.floor(
                  (new Date(item.endTime).getTime() - currentTime) / (60 * 1000)
                )
              }}
              :
            </span>
            <span
              v-if="
                Math.floor(
                  ((new Date(item.endTime).getTime() - currentTime) %
                    (60 * 1000)) /
                    1000
                ) < 10
              "
            >
              {{
                "0" +
                  Math.floor(
                    ((new Date(item.endTime).getTime() - currentTime) %
                      (60 * 1000)) /
                      1000
                  )
              }}</span
            >
            <span v-else>{{
              Math.floor(
                ((new Date(item.endTime).getTime() - currentTime) %
                  (60 * 1000)) /
                  1000
              )
            }}</span>
          </div>
        </div>
      </div>
      <el-alert
        v-else
        class="nogood"
        title="没有找到商品"
        type="warning"
        description="去逛逛其他吧！！！"
        show-icon
      >
      </el-alert>

      <el-footer class="footer-wrapper">
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
import { getChildCategoryList } from "@/api/child-category.js";

export default {
  data() {
    return {
      homeHeight: "",
      firstRequest: false, // 判断页面是否首次请求商品数据,不是的话,$ref.goodsWrapper.scrollTop = 0
      sideList: [],
      currentCategory: "",
      tags: [],
      inputVisible: false,
      inputValue: "",
      childCategoryList: [],
      childCategory: [],
      total: "",
      goodsList: [],
      loading: true,
      currentTime: new Date().getTime(),
      params: {
        Keyword: "",
        Category: [],
        PageIndex: 1,
        PageSize: 24,
        JdSelfOnly: false
      }
    };
  },
  mounted() {
    this.homeHeight = document.documentElement.clientHeight + "px";
    this.loading = false;
    this.getCategroy();
    this.getGoods();
    this.getChildCategoryList("");
    setInterval(() => {
      this.currentTime = new Date().getTime();
    }, 1000);
    window.onresize = () => {
      this.homeHeight = document.documentElement.clientHeight + "px";
    };
  },
  methods: {
    // 请求分类数据
    getCategroy() {
      getCategroyList()
        .then(res => {
          if (res.data.data.length === 0) {
            this.$router.push({ path: "/empty" });
          } else {
            this.sideList = res.data.data;
          }
        })
        .catch(error => {
          console.log(error);
          this.$router.push({ path: "/empty" });
        });
    },

    // 请求商品数据
    async getGoods() {
      this.loading = true;
      await getGoodsList(this.params)
        .then(res => {
          this.total = res.data.data.total;
          this.goodsList = [];
          this.currentTime = new Date().getTime();
          this.goodsList = res.data.data.data.map(t => {
            var item = t;
            item.startTime = new Date(t.startTime).getTime();
            item.endTime = new Date(t.endTime).getTime();
            return item;
          });
          if (this.firstRequest) {
            this.$refs.goodsWrapper.scrollTop = 0;
          } else {
            this.firstRequest = true;
          }
          this.loading = false;
          
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },

    // 改变左侧Category
    async changeCateGory(item) {
      this.currentCategory = item.categoryId;
      this.params.Keyword = "";
      this.params.PageIndex = 1;
      this.params.Category = [];
      this.childCategoryList = [];
      this.childCategory = [];
      this.tags = [];
      if (item.categoryId === "") {
        this.getChildCategoryList("");
      } else {
        console.log("ddddddd");
        this.params.Category.push(item.categoryId);
        this.getChildCategoryList({ category: item.categoryId });
      }
      await this.getGoods();
    },

    // 获取childCategoryList
    async getChildCategoryList(category) {
      getChildCategoryList(category)
        .then(res => {
          this.childCategoryList = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 添加childCategory
    addChildCategory() {
      this.params.Category = [];
      if (this.childCategory.length === 0) {
        this.$refs.select.blur();
        if(this.currentCategory !== '') {
          this.params.Category.push(this.currentCategory);
        }
      } else {
        this.childCategory.forEach(category => {
          this.params.Category.push(String(category));
        });
      }
    },

    prevPage() {
      this.params.PageIndex -= 1;
      this.getGoods();
    },

    nextPage() {
      this.params.PageIndex += 1;
      this.getGoods();
    },

    currentPage(val) {
      this.params.PageIndex = val;
      this.getGoods();
    },

    searchGoods() {
      this.params.PageIndex = 1;
      this.params.Keyword = this.tags.join(",");
      this.getGoods();
    },

    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      const inputValue = this.inputValue;
      if (inputValue) {
        if (this.tags.length === 5) {
          this.$message.warning("最多添加五个搜索条件！");
          return;
        } else {
          this.tags.push(inputValue);
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    timeLag(time) {
      const e = new Date(time).getTime();
      const lag = e - this.currentTime;
      return new Date(lag);
    }
  }
};
</script>

<style>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  display: block;
  width: 6px;
  border-radius: 10px;
  background: rgb(226, 226, 226);
}
.side {
  margin-right: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  font-weight: bold;
}
.header-wrapper {
  position: fixed;
  z-index: 99;
  width: 1600px;
  background-color: #fff;
  padding: 15px 10px 0 0;
  display: flex;
  justify-content: flex-end;
}
.jd-self-only {
  margin-top: 5px;
}
.category-select {
  overflow: auto;
}
.search {
  margin-left: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.button-new-tag {
  border-radius: 4px 0 0 4px;
}
.search-button {
  border-radius: 0 4px 4px 0;
  margin-left: 0 !important;
}
.tag {
  margin-right: 10px;
}
.goods-wrapper {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  width: 1600px;
  height: calc(100% - 150px);
  padding: 5px 10px 0 0;
  margin-top: 70px;
  overflow: auto;
}
.goods {
  width: 200px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 0 0 25px 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  float: left;
}
.goods:hover {
  transition: all 0.2s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4);
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
  width: 100%;
  height: 30px;
  color: #666;
  font-size: 13px;
}
.goods-desc a {
  color: #666;
  text-decoration: none;
  cursor: pointer;
}
.goods-desc a:hover {
  color: #c81623;
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
.shop-desc {
  color: #ff3434;
  border-color: rgba(255, 52, 52, 0.7);
  padding: 0 5px;
  border: 1px solid rgba(255, 52, 52, 0.7);
  border-radius: 10px;
  line-height: 20px;
  margin-right: 10px;
  font: 12px/150% tahoma, arial, Microsoft YaHei, Hiragino Sans GB, u5b8bu4f53,
    sans-serif;
}
.nogood {
  margin-top: 60px;
}

.footer-wrapper {
  position: fixed;
  bottom: 20px;
  /* bottom: 0; */
  /* z-index: 99; */
  /* padding-bottom: 20px;
  background-color: #fff; */
}
.paging {
  margin-top: 25px;
}
.paging span {
  padding: 0 5px;
  background-color: #f4f4f5;
  font-weight: 600;
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
  background-color: #e6a23c;
}
.underway {
  background-color: #67c23a;
}
.finish {
  background-color: #909399;
}
</style>
