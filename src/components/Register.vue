<template>
    <el-dialog title="注册" :show-close="false" :visible.sync="dialogFormVisible">
        <el-form>
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="user.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="user.password" type="password" autocomplete="off"></el-input>
                
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="register" style="width: 120px">注 册</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            formLabelWidth: "80px", //宽度
            dialogFormVisible: true,
            user: { name: "", password: "" },

        };
    },
    methods: {
        register(){
            const url = "http://localhost:8083/register";
        this.axios
        .post(url, {
            name: this.user.name,
            password: this.user.password,
        })
        .then((res) => {
            if(res.data.message=='success'){
                this.$alert('注册成功！', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.go(-1);
                    }
                    });
            }else{
                this.$message.error(res.data.message);
            }
        })
        .catch((error) => {
            this.$message.error(error);
        });
        },
    },

};
</script>

<style scoped>
</style>