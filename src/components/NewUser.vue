<template>
    <el-dialog
  title="新增用户"
  :visible.sync="dialogVisibleUser"
  width="40%"
  :before-close="handleClose">
<el-form :model="ruleFormUser" :rules="rulesuser" ref="ruleFormUser" label-width="100px" class="demo-ruleForm">
    <el-form-item label="用户ID" prop="id">
      <el-input v-model.number="ruleFormUser.id"></el-input>
    </el-form-item>
    <el-form-item label="用户名" prop="name">
      <el-input v-model="ruleFormUser.name"></el-input>
    </el-form-item>
    <el-form-item label="用户邮箱" prop="email">
      <el-input v-model="ruleFormUser.email"></el-input>
    </el-form-item>
    <el-form-item label="用户密码" prop="password">
      <el-input v-model="ruleFormUser.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitFormUser('ruleFormUser')">立即创建</el-button>
      <el-button @click="resetForm('ruleFormUser')">重置</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</template>
  <script>
    export default {
      data() {
        return {
            dialogVisibleUser: true,
          ruleFormUser: {
            id: '',
            name: '',
            email: '',
            password: '',
          },
          rulesuser: {
            id: [
              { required: true, message: '请输入用户ID', trigger: 'blur' },
              { type: 'number', message: '用户ID必须为数字值', trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
            ],
            email: [
              
            ],
            password: [
              { required: true, message: '请输入用户密码', trigger: 'blur' },
            ],

          }
        };
      },
      methods: {
        handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
            this.$router.go(-1);
          })
          .catch(_ => {});
      },
        submitFormUser(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              //alert('submit!');
              this.handleCreateUser();
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        handleCreateUser(){
            const url = "http://localhost:8083/user-center/users";
            this.axios
        .post(url, { 
            id: this.ruleFormUser.id,
            name: this.ruleFormUser.name,
            email: this.ruleFormUser.email,
            password: this.ruleFormUser.password,
        })
        .then((res) => {
            if(res.data==''){
              this.$store.commit('logout')
              this.$alert('会话已过期, 请重新登录', '系统信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push('/login');
                }
              });
            }else{
                if(res.data.message=='success'){
                    this.$alert('新增用户成功！', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.go(-1);
                    }
                    });
                }
                //this.$router.go(0);
            }
        })
        .catch((error) => {
            this.$message.error("错误");
        });
        }
      }
    }
  </script>