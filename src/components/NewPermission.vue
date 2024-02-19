<template>
    <el-dialog
  title="新增权限"
  :visible.sync="dialogVisiblePermission"
  width="40%"
  :before-close="handleClose">
<el-form :model="ruleFormPermission" :rules="rulespermission" ref="ruleFormPermission" label-width="100px" class="demo-ruleForm">
    <el-form-item label="权限  ID" prop="id">
      <el-input v-model.number="ruleFormPermission.id"></el-input>
    </el-form-item>
    <el-form-item label="权限名称" prop="name">
      <el-input v-model="ruleFormPermission.name"></el-input>
    </el-form-item>
    <el-form-item label="权限描述" prop="desc">
      <el-input type="textarea" v-model="ruleFormPermission.desc"></el-input>
    </el-form-item>
    <el-form-item label="父级权限ID" prop="pid">
      <el-input v-model.number="ruleFormPermission.pid"></el-input>
    </el-form-item>
    <el-form-item label="权限路径" prop="path">
      <el-input v-model="ruleFormPermission.path"></el-input>
    </el-form-item>
    <el-form-item label="权限操作" prop="right">
      <el-input v-model="ruleFormPermission.right"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitFormPermission('ruleFormPermission')">立即创建</el-button>
      <el-button @click="resetForm('ruleFormPermission')">重置</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</template>
  <script>
    export default {
      data() {
        return {
            dialogVisiblePermission: true,
          ruleFormPermission: {
            id: '',
            name: '',
            desc: '',
            pid: '',
            path: '',
            right: ''
          },
          rulespermission: {
            id: [
              { required: true, message: '请输入权限 ID', trigger: 'blur' },
              { type: 'number', message: '权限 ID必须为数字值', trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入权限名称', trigger: 'blur' },
              { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
            ],
            desc: [
              
            ],
            pid: [
              { required: true, message: '请输入父级权限ID', trigger: 'blur' },
              { type: 'number', message: '父级权限 ID必须为数字值', trigger: 'blur' }
            ],
            path: [
              
            ],
            right: [
              
            ]
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
        submitFormPermission(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              //alert('submit!');
              this.handleCreatePermission();
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        handleCreatePermission(){
            const url = "http://localhost:8083/permission-center/permissions";
            this.axios
        .post(url, { 
            id: this.ruleFormPermission.id,
            name: this.ruleFormPermission.name,
            desc: this.ruleFormPermission.desc,
            pid: this.ruleFormPermission.pid,
            path: this.ruleFormPermission.path,
            right: this.ruleFormPermission.right,
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
                    this.$alert('新增权限成功！', '', {
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