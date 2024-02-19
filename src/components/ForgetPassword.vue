<template>
    
    <el-form label-width="100px">
      <el-form-item align="left">
      <el-steps :active="active" finish-status="success" style="width: 450px">
        <el-step :title="step1"></el-step>
        <el-step :title="step2"></el-step>
        <el-step :title="step3"></el-step>
      </el-steps>
      </el-form-item>
      <el-form-item label="邮箱" align="left" >
        <el-input v-model="email" placeholder="" clearable style="width: 400px" :disabled="canInputCode" @change="checkEmailForm" />
        <el-button type="primary" @click="sendCode" :disabled="!canSendCode">发送验证码</el-button>
      </el-form-item>
      <el-form-item label="验证码"  align="left" >
        <el-input v-model="comfirmCode" placeholder="" clearable style="width: 400px" :disabled="!canInputCode" @change="checkCode"/>
      </el-form-item>
      <el-form-item label="新密码"  align="left" >
        <el-input v-model="newPassword" placeholder="" clearable show-password style="width: 400px" :disabled="!canInputPassword"/>
        <el-button type="primary" @click="handleSetPassword" :disabled="newPassword==''">提交</el-button>
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
            step3: '步骤 3' ,

              email: '',
              canInputCode: false,
              canSendCode: false,
              canInputPassword: false,
              comfirmCode: '',
              code: '',
              newPassword: '',
          }
      },
      created(){
      },
      methods: {
        checkEmailForm(){
            if(!/^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.email)){
                this.canSendCode=false;
            }else{
                this.canSendCode=true;
            }
        },
        
        sendCode(){
        const url = "http://localhost:8083/login/code";
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
            this.step3='新密码'
            this.canInputPassword=true;
          }
        },
        handleSetPassword(){
            
            const url = "http://localhost:8083/login/user";
            this.axios
        .put(url, {
            email: this.email,
            password: this.newPassword,
        })
        .then((res) => {
            if(res.data==''){
            }else{
                if(res.data.message=='success'){
                    this.$alert('修改密码成功！用户名为：'+res.data.name, '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.go(-1);
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
  