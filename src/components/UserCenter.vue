<template>
    <el-tabs v-model="activeName" tab-position="top" stretch="true" style="height: 200px;">
  <el-tab-pane label="个人资料" name="profile">
    <template>
      <el-descriptions class="margin-top" title="" :column="1" :size="size" border v-permission="{action:'selectuser'}">
      
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          用户名
        </template>
        {{user.name}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-postcard"></i>
          ID
        </template>
        {{ user.id }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-message"></i>
          邮箱
        </template>
        {{ user.email }}
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
        <el-tag size="small" v-if="user.email.match(/@whu.edu.cn/)">武汉大学</el-tag>
  
      </el-descriptions-item>
    </el-descriptions>
  </template>
  </el-tab-pane>
  <el-tab-pane label="账号设置">
    <template>
    
    <el-row :gutter="12" v-permission="{action:'updateuser'}">
        <el-col :span="8" >
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
            <span>用户名设置</span>
            </div>

            当前用户名：
            <el-input v-model="userinput.name" style="width: 200px;" :disabled="true"></el-input>
            <div >
            <el-button type="text" style="float: right; padding: 6px 0" class="button" @click="changeName">修改用户名</el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8" >
            <el-card shadow="hover">
            <div slot="header" class="clearfix">
            <span>密码设置</span>
            </div>

            当前密码：
            <el-input v-model="userinput.password" type="password" style="width: 200px;" :disabled="true"></el-input>
            <div >
            <el-button type="text" style="float: right; padding: 6px 0" class="button" @click="changePassword">修改密码</el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8" >
            <el-card shadow="hover">
            <div slot="header" class="clearfix">
            <span>邮箱设置</span>
            </div>

            当前邮箱：
            <el-input v-model="userinput.email" style="width: 200px;" :disabled="true"></el-input>
            <div >
            <el-button type="text" style="float: right; padding: 6px 0" class="button" @click="gotoSetEmail">绑定邮箱</el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-card shadow="hover">
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-card shadow="hover">
            <el-button type="text" class="button" @click="logout" >退出登录</el-button>
          </el-card>
        </el-col>
      </el-row>
    
    </template>
  </el-tab-pane>
  <el-tab-pane label="我的商品" name="items">
    <template >
  
        <template>
          <el-empty description="还没有发布商品" v-if="itemTableData.length==0" v-permission="{action:'selectitems'}">
            <el-button
            type="text" size="medium" class="button"
            @click="gotoItems"
            >管理商品</el-button>
          </el-empty>
    <el-table
    v-if="!itemTableData.length==0"
      ref="multipleTable"
      :data="itemTableData"
      stripe
      style="width: 100%"
      max-height="600"
      @selection-change="handleSelectionChange"
      v-permission="{action:'selectitems'}">
      
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.type }}</span>
            </el-form-item>
            <el-form-item label="商品品相">
              <span>{{ props.row.appearance }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.itemId }}</span>
            </el-form-item>
            <el-form-item label="用户 ID">
              <span>{{ props.row.userId }}</span>
            </el-form-item>
            <el-form-item label="商品数量">
              <span>{{ props.row.amount }}</span>
            </el-form-item>
            <el-form-item label="发布时间">
              <span>{{ props.row.time }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.info }}</span>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="发布时间"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="itemId"
        label="商品ID"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名">
      </el-table-column>

    </el-table>
    <div style="margin-top: 20px; margin-right: 20px" align="right">
      <el-button
            size="medium"
            @click="gotoItems"
            v-permission="{action:'selectitems'}"
            v-if="!itemTableData.length==0"
            >管理商品</el-button>
    </div>
    <el-empty description="需要绑定邮箱后才可以发布商品" v-none="{action:'selectitems'}">
      <el-button type="text" size="medium" class="button" @click="gotoSetEmail">前往绑定邮箱</el-button>
    </el-empty>
  </template>
    </template>
  </el-tab-pane>
  <el-tab-pane label="我的收藏">
    <el-drawer
    v-if="!likeTableData.length==0"
  title=""
  :visible.sync="imageDrawer"
  :with-header="false"
  size="50%">
  <span align="left">
    <el-row>
      {{likeTableData[imageDrawerIndex].name}}
    </el-row>
    <el-row>
      {{likeTableData[imageDrawerIndex].info}}
    </el-row>
  </span>
  <span>
            <el-row v-for="url in likeImages[imageDrawerIndex]" :key="url" :span="6">
                <el-image
                style="width: 300px; height: 300px"
                :src="url"
                fit="contain"></el-image>
                        
            </el-row>
            <el-empty description="没有图片" v-if="likeImages[imageDrawerIndex]==[]"></el-empty>
  </span>
  <span align="left">
    <el-descriptions class="margin-top" title="" :column="1" :size="size">
    <el-descriptions-item label="商品分类">{{likeTableData[imageDrawerIndex].type}}</el-descriptions-item>
    <el-descriptions-item label="商品数量">{{likeTableData[imageDrawerIndex].amount}}</el-descriptions-item>
    <el-descriptions-item label="个人闲置">
      <i class="el-icon-circle-check" v-if="likeTableData[imageDrawerIndex].personal=='true'">是</i>
      <i class="el-icon-circle-close" v-if="likeTableData[imageDrawerIndex].personal=='false'">否</i>
    </el-descriptions-item>
    <el-descriptions-item label="商品品相">
      {{likeTableData[imageDrawerIndex].appearance}}
    </el-descriptions-item>
    <el-descriptions-item label="发布时间">
      {{likeTableData[imageDrawerIndex].time}}
    </el-descriptions-item>
  </el-descriptions>
  </span>
  <span align="right">
    <el-button type="primary" icon="el-icon-user-solid" @click="gotoUserInfo">用户信息</el-button>
    <el-button type="warning" icon="el-icon-star-off" @click="addLike(imageDrawerIndex)" v-if="!totalLikes[imageDrawerIndex]" circle>收藏</el-button>
    <el-button type="warning" icon="el-icon-star-on" @click="cancelLike(imageDrawerIndex)" v-if="totalLikes[imageDrawerIndex]" circle>取消收藏</el-button>
  </span>
</el-drawer>
    <template v-if="!likeTableData.length==0">
      <template>
      <ul style="overflow:auto">
      <li v-for="i in likeTableData.length" :key="i" style="padding: 10px;">

    <el-card :body-style="{ padding: '10px' }" shadow="hover">
      <img :src="likeImages[i-1][0]" class="image" style="width: 150px; height: 150px" v-if="likeImages[i-1].length!=0">
      <div style="padding: 14px;">
        <span>{{ likeTableData[i-1].name }}</span>
        <div align="right">
          <i class="el-icon-star-on" style="color: rgb(255, 153, 0);" v-if="totalLikes[i-1]"></i>
          <i class="el-icon-star-off" style="color: rgb(255, 153, 0);" v-if="!totalLikes[i-1]"></i>
        </div>
        <div class="bottom clearfix">
          <el-button type="text" class="button" @click="openLikeDrawer(i-1)">查看详情</el-button>
        </div>
      </div>
    </el-card>

      </li>
      </ul>
</template>
    </template>
    <el-empty description="还没有收藏的商品" v-if="likeTableData.length==0">
      <el-button type="text" size="medium" class="button" @click="gotoMain">前往发现商品</el-button>
    </el-empty>
  </el-tab-pane>
  </el-tabs>
  </template>
  
  <style>
    .demo-table-expand {
      font-size: 0;
    }
    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 100%;
    }
  </style>
  
  <script>
  import qs from 'qs'
    export default {
      data () {
        return {
          size: '',
          activeName: 'profile',
          user: { email: "", name: "" , id: "", password: "",},
          userinput: { email: "", name: "" , password: "",},
          itemTableData: [],
          likeTableData: [],
          totalLikes: [],
          likeImages: [],
          multipleSelection: [],
          imageDrawer: false,
          imageDrawerIndex: 1,
        };
      },
      created(){
        this.loadUser();
        this.loadItem();
          
      },
      methods:{
        
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        gotoItems(){
            this.$router.push('/user-center/items')
        },
        loadUser(){
            const url = "http://localhost:8083/user";
        
                this.axios.get(url,{
                  params: {

                  }}).then(res => {
                    this.itemTableData = res.data.items;
                    this.likeTableData = res.data.likeItems;
                    this.likeImages = res.data.likeImages;
                    this.totalLikes = res.data.likes;
                    this.user.email = res.data.user.email;
                this.user.name = res.data.user.name;
                this.user.id = res.data.user.id;
                this.user.password = res.data.user.password;
                this.userinput.name = res.data.user.name;
                this.userinput.password = res.data.user.password;
                this.userinput.email = res.data.user.email;
                })
        .catch((error) => {
            this.$message.error(error);
        });
        },
        loadItem(){},
        changeName() {
        this.$prompt('请输入新用户名', '修改用户名', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
          inputErrorMessage: '用户名不能为空'
        }).then(({ value }) => {
            this.handleUserNameChange(value);
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });       
        });
      },
      changePassword() {
        if(this.user.email==""||this.user.email==null){
            this.$prompt('请输入新密码', '修改密码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType:"password",
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
          inputErrorMessage: '密码不能为空'
        }).then(({ value }) => {
            this.handleUserPasswordChange(value);
          this.$message({
            type: 'success',
            message: '成功修改密码'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });       
        });
        }else{
            this.$router.push('/user-center/set-password')
        }
        
      },
      handleUserNameChange(name){
        const url = "http://localhost:8083/user";
            this.axios
            .put(url,{
                name: name,
            }).then((res)=>{
                if(res.data==''){
              }else{
                if(res.data.message=='success'){
                    this.$message({
                    type: 'success',
                    message: '成功修改用户名'
                    });
                }else{
                    this.$message.error(res.data.message);
                }
              }
            })
            .catch((error) => {
              this.$message.error(error);
            });
      },
      handleUserPasswordChange(password){
        const url = "http://localhost:8083/user";
            this.axios
            .put(url,{
                password: password,
            }).then((res)=>{
                if(res.data==''){
              }else{
                if(res.data.message=='success'){
                }else{
                    this.$message.error(res.data.message);
                }
              }
            })
            .catch((error) => {
              this.$message.error(error);
            });
      },
      gotoSetEmail(){
        this.$router.push('/user-center/set-email')
      },
      openLikeDrawer(index){
        this.imageDrawer=true
        this.imageDrawerIndex=index
      },
          addLike(index){
            let formData = new FormData() //创建一个表单
                formData.append("itemId", this.likeTableData[index].itemId)
                formData.append("itemUserId", this.likeTableData[index].userId)
                this.axios.post(
                    'http://localhost:8083/likes',
                    formData,
                    {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
                    if(res.data.message=='success'){
                      this.totalLikes[index]=true
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
                    itemId: this.likeTableData[index].itemId,
                    itemUserId: this.likeTableData[index].userId
                    }}).then(res => {
                    if(res.data.message=='success'){
                      this.totalLikes[index]=false
                      this.imageDrawer=false
                      this.imageDrawer=true
                    }
                }).catch(error => {
                    this.$message.error(error)
                })
          },
          gotoUserInfo(){
            this.$router.push('/user?userId='+this.likeTableData[this.imageDrawerIndex].userId)
          },
          gotoMain(){
            this.$router.push('/main')
          },
        logout(){
            this.$store.commit('logout')
            this.$router.go(0);
        },
      }
    }
  </script>