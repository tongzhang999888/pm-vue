<template>
  <div>
    <el-descriptions class="margin-top" title="" :column="1" :size="size" border style="padding: 50px;">
      
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          用户名
        </template>
        {{ userInfoList.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-postcard"></i>
          ID
        </template>
        {{ userId }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-message"></i>
          邮箱
        </template>
        {{ userInfoList.email }}   
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          地址
        </template>
        
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile"></i>
          联系方式
        </template>
        
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          备注
        </template>
        <el-tag size="small" v-if="userInfoList.email.match(/@whu.edu.cn/)">武汉大学</el-tag>

      </el-descriptions-item>
    </el-descriptions>
    <el-drawer
  title=""
  :visible.sync="imageDrawer"
  :with-header="false"
  size="50%">
  <span align="left">
    <el-row>
      {{items[imageDrawerIndex].name}}
    </el-row>
    <el-row>
      {{items[imageDrawerIndex].info}}
    </el-row>
  </span>
  <span>
            <el-row v-for="url in itemImages[imageDrawerIndex]" :key="url" :span="6">
                <el-image
                style="width: 300px; height: 300px"
                :src="url"
                fit="contain"></el-image>
                        
            </el-row>
            <el-empty description="没有图片" v-if="itemImages[imageDrawerIndex]==[]"></el-empty>
  </span>
  <span align="left">
    <el-descriptions class="margin-top" title="" :column="1" :size="size">
    <el-descriptions-item label="商品分类">{{items[imageDrawerIndex].type}}</el-descriptions-item>
    <el-descriptions-item label="商品数量">{{items[imageDrawerIndex].amount}}</el-descriptions-item>
    <el-descriptions-item label="个人闲置">
      <i class="el-icon-circle-check" v-if="items[imageDrawerIndex].personal=='true'">是</i>
      <i class="el-icon-circle-close" v-if="items[imageDrawerIndex].personal=='false'">否</i>
    </el-descriptions-item>
    <el-descriptions-item label="商品品相">
      {{items[imageDrawerIndex].appearance}}
    </el-descriptions-item>
    <el-descriptions-item label="发布时间">
      {{items[imageDrawerIndex].time}}
    </el-descriptions-item>
  </el-descriptions>
  </span>
  <span align="right">
    <el-button type="warning" icon="el-icon-star-off" @click="addLike(imageDrawerIndex)" v-if="!likes[imageDrawerIndex]" circle>收藏</el-button>
    <el-button type="warning" icon="el-icon-star-on" @click="cancelLike(imageDrawerIndex)" v-if="likes[imageDrawerIndex]" circle>取消收藏</el-button>
  </span>
</el-drawer>
    <template>
      <ul style="overflow:auto">
        <li style="padding: 10px;">商品总数：{{ items.length }}</li>
      <li v-for="i in items.length" :key="i" style="padding: 10px;">

    <el-card :body-style="{ padding: '10px' }" shadow="hover">
      <img :src="itemImages[i-1][0]" class="image" style="width: 150px; height: 150px" v-if="itemImages[i-1].length!=0">
      <div style="padding: 14px;">
        <span>{{ items[i-1].name }}</span>
        <div align="right">
          <i class="el-icon-star-on" style="color: rgb(255, 153, 0);" v-if="likes[i-1]"></i>
          <i class="el-icon-star-off" style="color: rgb(255, 153, 0);" v-if="!likes[i-1]"></i>
        </div>
        <div class="bottom clearfix">
          <el-button type="text" class="button" @click="openImageDrawer(i-1)">查看详情</el-button>
        </div>
      </div>
    </el-card>

      </li>
      </ul>
</template>
  </div>
</template>

<script>
  export default{
      data(){
          return {
            userId: 0,
            userInfoList: [],
            items: [],
            itemImages: [],
            likes: [],
            imageDrawer: false,
            imageDrawerIndex: 0,
          }
      },
      created(){
        this.load()
      },
      methods: {
        load(){
            this.userId=this.$route.query.userId
            const url = "http://localhost:8083/user-center/users/"+this.userId;
        
                this.axios.get(url,{
                  params: {

                  }}).then(res => {
                    if(res.data.message=='success'){
                      this.userInfoList=res.data.userInfoList
                      this.items=res.data.items
                      this.itemImages=res.data.itemImages
                      this.likes=res.data.likes
                    }
                  })
        .catch((error) => {
            this.$message.error(error);
        });
        },
        openImageDrawer(index){
        this.imageDrawer=true
        this.imageDrawerIndex=index
        },
        addLike(index){
            let formData = new FormData() //创建一个表单
                formData.append("itemId", this.items[index].itemId)
                formData.append("itemUserId", this.items[index].userId)
                this.axios.post(
                    'http://localhost:8083/likes',
                    formData,
                    {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
                    if(res.data.message=='success'){
                      this.likes[index]=true
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
                    itemId: this.items[index].itemId,
                    itemUserId: this.items[index].userId
                    }}).then(res => {
                    if(res.data.message=='success'){
                      this.likes[index]=false
                      this.imageDrawer=false
                      this.imageDrawer=true
                    }
                }).catch(error => {
                    this.$message.error(error)
                })
          },
      }
  }
  </script>
  
  <style>
  </style>