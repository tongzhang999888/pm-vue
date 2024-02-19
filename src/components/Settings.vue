<template>
    
    <el-row :gutter="12">
        <el-col :span="24">
          <el-card shadow="hover">
            <el-button type="text" class="button" @click="logout">退出登录</el-button>
          </el-card>
        </el-col>
      </el-row>
    
    </template>
    
    <script>
    export default {
        data() {
            return {
                test:'',
            };
        },
        created(){
            
        },
        methods: {
            logout(){
                this.$store.commit('logout')
                this.$router.go(0);
            },
        },
    
    };
    </script>