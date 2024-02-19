<template>
    <el-dialog
  title="新增角色"
  :visible.sync="dialogVisibleRole"
  width="40%"
  :before-close="handleClose">
<el-form :model="ruleFormRole" :rules="rulesrole" ref="ruleFormRole" label-width="100px" class="demo-ruleForm">
    <el-form-item label="角色  ID" prop="id">
      <el-input v-model.number="ruleFormRole.id"></el-input>
    </el-form-item>
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="ruleFormRole.name"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="desc">
      <el-input type="textarea" v-model="ruleFormRole.desc"></el-input>
    </el-form-item>
    <el-form-item label="父级角色ID" prop="pid">
      <el-input v-model.number="ruleFormRole.pid"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitFormRole('ruleFormRole')">立即创建</el-button>
      <el-button @click="resetForm('ruleFormRole')">重置</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</template>
  <script>
    export default {
      data() {
        return {
            dialogVisibleRole: true,
          ruleFormRole: {
            id: '',
            name: '',
            desc: '',
            pid: '',
          },
          rulesrole: {
            id: [
              { required: true, message: '请输入角色 ID', trigger: 'blur' },
              { type: 'number', message: '角色 ID必须为数字值', trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入角色名称', trigger: 'blur' },
              { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
            ],
            desc: [
              
            ],
            pid: [
              { required: true, message: '请输入父级角色ID', trigger: 'blur' },
              { type: 'number', message: '父级角色ID必须为数字值', trigger: 'blur' }
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
        submitFormRole(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              //alert('submit!');
              this.handleCreateRole();
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        handleCreateRole(){
            const url = "http://localhost:8083/role-center/roles";
            this.axios
        .post(url, { 
            id: this.ruleFormRole.id,
            name: this.ruleFormRole.name,
            desc: this.ruleFormRole.desc,
            pid: this.ruleFormRole.pid,
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
                    this.$alert('新增角色成功！', '', {
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