<template>

    <el-container style="height: 100%;">
      <el-header style="height: 100px; position: fixed; width: 100%;">
        <div>
          <el-row>
              <el-input placeholder="请输入内容" class="input-with-select" style="width: 50%; align-items: center;">
              <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
              <div style="float: right;">
              <el-button type="primary" icon="el-icon-user-solid" circle style="margin-right: 15px;" @click="gotoUserCenter"></el-button>
              </div>
          </el-row>
       </div>
      </el-header>
      <el-container style="padding-top: 100px;">
        <el-aside style="position: fixed; height: 100%; width: 15%;">
          <el-col>
      <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      @select="handleSelect">
      <el-menu-item index="all" v-permission="{action:'selectitems'}">
        <i class="el-icon-menu"></i>
        <span slot="title">全部商品</span>
      </el-menu-item>
      <el-menu-item index="图书" v-permission="{action:'图书'}">
        <i class="el-icon-reading"></i>
        <span slot="title">图书</span>
      </el-menu-item>
      <el-menu-item index="百货" v-permission="{action:'百货'}">
        <i class="el-icon-toilet-paper"></i>
        <span slot="title">百货</span>
      </el-menu-item>
      <el-menu-item index="电器" v-permission="{action:'电器'}">
        <i class="el-icon-table-lamp"></i>
        <span slot="title">电器</span>
      </el-menu-item>
      <el-menu-item index="食品" v-permission="{action:'食品'}">
        <i class="el-icon-food"></i>
        <span slot="title">食品</span>
      </el-menu-item>
      <el-menu-item index="服饰" v-permission="{action:'服饰'}">
        <i class="el-icon-shopping-bag-2"></i>
        <span slot="title">服饰</span>
      </el-menu-item>
      <el-menu-item index="其他" v-permission="{action:'其他'}">
        <i class="el-icon-shopping-cart-full"></i>
        <span slot="title">其他</span>
      </el-menu-item>
    </el-menu>
  </el-col>
        </el-aside>
        <el-main style="padding-left: 15%;">
          <div class="infinite-list-wrapper" style="overflow:auto">
        <ul
          class="list"
          v-infinite-scroll="load"
          infinite-scroll-disabled="disabled">
          <li v-for="i in count" :key="i" class="list-item">
            <el-row>
            {{ totalItems[i][0].name }}
            </el-row>
            <el-row>
            <el-image
            v-if="totalItemImages[i][0].length!=0"
                style="width: 300px; height: 300px"
                :src="totalItemImages[i][0][0]"
                fit="contain"></el-image>
            </el-row>
            <el-tag type="success" v-if="totalItems[i][0].personal=='true'">个人闲置</el-tag>
            <el-tag effect="plain">{{ totalItems[i][0].appearance }}</el-tag>
            <el-tag type="warning" v-if="userLikes[i][0]">已收藏</el-tag>
            <el-row>
            <el-button type="text" @click="handleItemInfo(i)">查看详情</el-button>
            </el-row>
            <el-divider></el-divider>
          </li>
        </ul>
        <p v-if="loading">加载中...</p>
        <el-button v-if="noMore" @click="maxAmount = maxAmount+5">加载更多</el-button>
      </div>
      <el-drawer
  title=""
  :visible.sync="imageDrawer"
  :with-header="false"
  size="50%">
  <span align="left">
    <el-row>
      {{itemInfoForm.name}}
    </el-row>
    <el-row>
      {{itemInfoForm.info}}
    </el-row>
  </span>
  <span>
            <el-row v-for="url in itemInfoForm.imageurls" :key="url" :span="6">
                <el-image
                style="width: 300px; height: 300px"
                :src="url"
                fit="contain"></el-image>
                        
            </el-row>
            <el-empty description="没有图片" v-if="imageurls==[]"></el-empty>
  </span>
  <span align="left">
    <el-descriptions class="margin-top" title="" :column="1" :size="size">
    <el-descriptions-item label="商品分类">{{itemInfoForm.type}}</el-descriptions-item>
    <el-descriptions-item label="商品数量">{{itemInfoForm.amount}}</el-descriptions-item>
    <el-descriptions-item label="个人闲置">
      <i class="el-icon-circle-check" v-if="itemInfoForm.personal=='true'">是</i>
      <i class="el-icon-circle-close" v-if="itemInfoForm.personal=='false'">否</i>
    </el-descriptions-item>
    <el-descriptions-item label="商品品相">
      {{itemInfoForm.appearance}}
    </el-descriptions-item>
    <el-descriptions-item label="发布时间">
      {{itemInfoForm.time}}
    </el-descriptions-item>
  </el-descriptions>
  </span>
  <span align="right">
    <el-button type="primary" icon="el-icon-user-solid" @click="gotoUserInfo">用户信息</el-button>
    <el-button type="warning" icon="el-icon-star-off" @click="addLike(selectedItem)" v-if="!userLikes[selectedItem][0]" circle>收藏</el-button>
    <el-button type="warning" icon="el-icon-star-on" @click="cancelLike(selectedItem)" v-if="userLikes[selectedItem][0]" circle>取消收藏</el-button>
  </span>
</el-drawer>

        </el-main>
      </el-container>
    </el-container>
      
    </template>
    
    <script>
      export default {
        data () {
          return {
            count: 0,
            maxAmount: 5,
            loading: false,
            totalItems: [],
            totalItemImages: [],
            totalLikes: [],
            userLikes: [],
            selectedType: 'all',
            selectedItem: 0,
            imageDrawer: false,
            itemInfoForm: {
              name: '',
              amount: '',
              personal: 'false',
              type: '',
              appearance: '',
              info: '',
              time: '',
              imageurls: []
            },
          }
        },
        created(){
          this.getItems();
            
        },
        computed: {
          noMore () {
            return this.count >= this.maxAmount
          },
          disabled () {
            return this.loading || this.noMore
          }
        },
        methods: {
          load () {
            this.loading = true
            setTimeout(() => {
              this.getItems();
              this.count += 1
              this.loading = false
            }, 1000)
          },
          gotoUserCenter(){
            this.$router.push('/user-center');
          },
          getItems(){
            const url = "http://localhost:8083/items";
              this.axios
              .get(url, {
                params: {
                  needAmount: 1,
                  type: this.selectedType,
                },
            })
              .then((res) => {
                  if(res.data==''){
                  }else{
                      this.totalItems.push(res.data.items);
                      this.totalItemImages.push(res.data.images);
                      this.userLikes.push(res.data.likes);
                  }
              })
              .catch((error) => {
                  this.$message.error(error);
              });
          },
          handleSelect(key, keyPath) {
            console.log(key, keyPath);
            this.selectedType=key
            this.totalItems=[]
            this.totalItemImages=[]
            this.userLikes=[]
            this.totalLikes=[]
            this.count=0
            this.maxAmount=5
            this.getItems()
          },
          addLike(index){
            let formData = new FormData() //创建一个表单
                formData.append("itemId", this.totalItems[index][0].itemId)
                formData.append("itemUserId", this.totalItems[index][0].userId)
                this.axios.post(
                    'http://localhost:8083/likes',
                    formData,
                    {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
                    if(res.data.message=='success'){
                      this.userLikes[index][0]=true
                      this.imageDrawer=false
                      this.imageDrawer=true
                    }
                }).catch(error => {
                    this.$message.error(error)
                })
          },
          cancelLike(index){
                this.axios.delete(
                    'http://localhost:8083/likes',
                    {params: {
                    itemId: this.totalItems[index][0].itemId,
                    itemUserId: this.totalItems[index][0].userId
                    }}).then(res => {
                    if(res.data.message=='success'){
                      this.userLikes[index][0]=false
                      this.imageDrawer=false
                      this.imageDrawer=true
                    }
                }).catch(error => {
                    this.$message.error(error)
                })
          },
          handleItemInfo(index){
            this.imageDrawer=true
            this.selectedItem=index;
            this.itemInfoForm.name=this.totalItems[index][0].name
            this.itemInfoForm.amount=this.totalItems[index][0].amount
            this.itemInfoForm.personal=this.totalItems[index][0].personal
            this.itemInfoForm.type=this.totalItems[index][0].type
            this.itemInfoForm.appearance=this.totalItems[index][0].appearance
            this.itemInfoForm.info=this.totalItems[index][0].info
            this.itemInfoForm.time=this.totalItems[index][0].time
            this.itemInfoForm.imageurls=this.totalItemImages[index][0]
          },
          gotoUserInfo(){
            this.$router.push('/user?userId='+this.totalItems[this.selectedItem][0].userId)
          },
        }
      }
    </script>
    
    <style>
      .el-header, .el-footer {
        background-color: #ffffff;
        color: #333;
        text-align: center;
        line-height: 60px;
      }
      
      .el-aside {
        background-color: #e4e4e4;
        color: #333;
        text-align: center;
        line-height: 200px;
      }
      
      .el-main {
        background-color: #ffffff;
        color: #333;
        text-align: center;
        line-height: 50px;
      }
      
      body > .el-container {
        margin-bottom: 40px;
      }
      
      .el-container:nth-child(5) .el-aside,
      .el-container:nth-child(6) .el-aside {
        line-height: 260px;
      }
      
      .el-container:nth-child(7) .el-aside {
        line-height: 320px;
      }
    
      html,body,#app {
        height: 100%;
      }
    
      li{
        list-style-type: none;
        font-size: 20px;
        text-align: left;
      }
    
      ul{
        margin-left: 50px;
        padding: 1px;
      }
    </style>