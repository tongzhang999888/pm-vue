<template>
    <el-dialog title="登录" :show-close="false" :visible.sync="dialogFormVisible">
        <el-form>
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="user.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="user.password" type="password" autocomplete="off"></el-input>
                <el-link type="primary" @click.prevent="forgetPassword">忘记密码?</el-link>
                
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-link type="primary" @click.prevent="toRegister">新用户注册</el-link>
            <el-button type="primary" @click="login" style="width: 120px">登 录</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { initDynamicRoutes } from '@/router/index.js'
export default {
    data() {
        return {
            formLabelWidth: "80px", //宽度
            dialogFormVisible: true,
            user: { name: "", password: "" },
            test1:'',
            test2:'',

        };
    },
    methods: {
        forgetPassword(){
        this.$router.push('/login/forget-password');
        },
        login(){
            //this.$router.push('/permission-management-center/permissions');
            const url = "http://10.0.0.34:8083/login";
        this.axios
        .get(url, {
            params: {
            name: this.user.name,
            password: this.user.password,
            },
        })
        .then((res) => {
            if(res.data.message=='success'){
                if(!window.localStorage){
                    this.$message.error("您的浏览器不支持localStorage!");
                }else{
                    this.$store.commit('setToken',res.data.token)
                    this.$store.commit('setUser',res.data.user)
                    this.$store.commit('setPermission',res.data.permission)
                    this.$store.commit('setOperations',res.data.operations)
                    initDynamicRoutes()
                    var isUser = false;
                    res.data.permission.forEach(item => {
                        if(item.path=='user-center'){isUser=true}
                    })
                    if(isUser){
                        this.$router.push('/main')
                    }else{
                        this.$router.push('/permission-management-center')
                    }
                    
                    this.$message({
                    message: '登录成功！',
                    type: 'success'
                    });
                }
            }else{
                console.log(res.data)
                this.$message.error("账号或密码错误");
            }
        })
        .catch((error) => {
            this.$message.error(error);
        });
        },
        toRegister(){
            this.$router.push('/register')
        },
    },

};
</script>

<style scoped>
</style>