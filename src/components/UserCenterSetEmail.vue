<template>
    
    <el-form label-width="100px">
      <el-form-item align="left">
      <el-steps :active="active" finish-status="success" style="width: 450px">
        <el-step :title="step1"></el-step>
        <el-step :title="step2"></el-step>
      </el-steps>
      </el-form-item>
      <el-form-item label="邮箱" align="left" >
        <el-input v-model="email" placeholder="" clearable style="width: 400px" :disabled="canInputCode" @change="checkEmailForm" />
        <el-button type="primary" @click="checkEmail" :disabled="!canSendCode">发送验证码</el-button>
      </el-form-item>
      <el-form-item label="验证码"  align="left" >
        <el-input v-model="comfirmCode" placeholder="" clearable style="width: 400px" :disabled="!canInputCode"/>
        <el-button type="primary" @click="checkCode" :disabled="comfirmCode==''">确定</el-button>
      </el-form-item>

    </el-form>
    
    
  </template>
  
  <script>
  export default{
      data(){
          return {
            active: 0,
            step1: '填写邮箱地址',
            step2: '步骤 2' ,

              email: '',
              canInputCode: false,
              canSendCode: false,
              comfirmCode: '',
              code: '',
          }
      },
      methods: {
        checkEmail(){
        const url = "http://localhost:8083/user/code";
        this.axios
        .get(url, {
            params: {
            email: this.email,
            },
        })
        .then((res) => {
          if(res.data.message=='success'){
            this.code=res.data.code;
            this.canInputCode=true;
            this.active++;
            this.step2='填写验证码'
          }else{
            this.$message.error(res.data.message);
          }
        })
        .catch((error) => {
            this.$message.error(error);
        });
        },

        checkCode(){
          if(this.comfirmCode==this.code&&this.code!=''){
            this.active++;
            this.handleSetEmail();
          }
        },
        checkEmailForm(){
            if(!/^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.email)){
                this.canSendCode=false;
            }else{
                this.canSendCode=true;
            }
        },
        handleSetEmail(){
            
            const url = "http://localhost:8083/user";
            this.axios
        .put(url, {
            email: this.email,
        })
        .then((res) => {
            if(res.data==''){
            }else{
                if(res.data.message=='success'){
                    this.$alert('绑定邮箱成功！', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.push('/login');
                    }
                    });
                }
            }
        })
        .catch((error) => {
            this.$message.error(error);
        });
        }
      }
  }
  </script>
  
  <style>
  </style>
  