<template>
    
<el-row :gutter="12">
    <el-col :span="8" v-path="{action:'permissions'}">
      <el-card shadow="hover">
        <el-button type="text" class="button" @click="gotoPermissions">权限管理</el-button>
      </el-card>
    </el-col>
    <el-col :span="8" v-path="{action:'roles'}">
      <el-card shadow="hover">
        <el-button type="text" class="button" @click="gotoRoles">角色管理</el-button>
      </el-card>
    </el-col>
    <el-col :span="8" v-path="{action:'users'}">
      <el-card shadow="hover">
        <el-button type="text" class="button" @click="gotoUsers">用户管理</el-button>
      </el-card>
    </el-col>
    <el-col :span="24">
      <el-card shadow="hover">
        {{ test }}
      </el-card>
    </el-col>
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
        this.test = window.localStorage.getItem('permission');
    },
    methods: {
        gotoPermissions(){this.$router.push('/permission-management-center/permissions');},
        gotoRoles(){this.$router.push('/permission-management-center/roles');},
        gotoUsers(){this.$router.push('/permission-management-center/users');},
        logout(){
            this.$store.commit('logout')
            this.$router.go(0);
        },
    },

};
</script>