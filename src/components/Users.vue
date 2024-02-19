<template>
    <el-tabs @tab-click="handleTabClick" v-model="activeName" tab-position="top" stretch="true" style="height: 200px;">
  
    <template>
    
    <div style="margin-top: 15px;" v-permission="{action:'selectusers'}">
    <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
    <el-select v-model="select" slot="prepend" placeholder="请选择">
        <el-option label="用户ID" value="id"></el-option>
        <el-option label="用户名" value="name"></el-option>
    </el-select>
    <el-button slot="append" icon="el-icon-search" @click="searchUser">查找用户</el-button>
    </el-input>
    </div>

<template>
<el-table
  ref="multipleTable"
  :data="tableData"
  stripe
  max-height="500"
  @selection-change="handleSelectionChange">
  <el-table-column
    type="selection" v-if="toDelete">
  </el-table-column>
  <el-table-column type="expand" >
    <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item label="用户名">
        <span>{{ props.row.name }}</span>
      </el-form-item>
      <el-form-item label="用户ID">
        <span>{{ props.row.id }}</span>
      </el-form-item>
      <el-form-item label="用户邮箱">
        <span>{{ props.row.email }}</span>
      </el-form-item>
      <el-form-item label="用户密码">
        <span>{{ props.row.password }}</span>
      </el-form-item>
    </el-form>
    </template>
  </el-table-column>
  <el-table-column
  prop="id"
  label="用户ID"
  sortable>
</el-table-column>
<el-table-column
  prop="name"
  label="用户名"
  sortable>
</el-table-column>
<el-table-column
  prop="email"
  label="用户邮箱"
  sortable>
</el-table-column>
  <el-table-column label="操作" align="right">
    <template slot="header" slot-scope="scope">
      <el-row>
        <el-button v-permission="{action:'urr'}" type="success" icon="el-icon-connection" circle @click="getRoles" :disabled="toDelete||toEdit"></el-button>
        <el-button v-permission="{action:'updateusers'}" type="primary" icon="el-icon-edit" circle @click="toEdit=!toEdit" :disabled="toDelete||toEditPermission"></el-button>
        <el-button v-permission="{action:'deleteusers'}" type="danger" icon="el-icon-delete" circle @click="toDelete=!toDelete" :disabled="toEdit||toEditPermission"></el-button>
      </el-row>
    </template>
    <template slot-scope="scope">
        <div style=" margin-right: 15px" align="right" v-if="toEdit">
          <el-button
          v-permission="{action:'updateusers'}"
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑用户</el-button>
        </div>
        <div style=" margin-right: 15px" align="right" v-if="toEditPermission">
          <el-button
          v-permission="{action:'selecturr'}"
          size="mini"
          @click="handleEditRole(scope.$index, scope.row)">查看角色</el-button>
        </div>
        <div style=" margin-right: 15px" align="right" v-if="toEditPermission">
          <el-button
          v-permission="{action:'selectupr'}"
          size="mini"
          @click="handleEditPermission(scope.$index, scope.row)">查看权限</el-button>
        </div>
    </template>
  </el-table-column>
</el-table>
<div style="margin-top: 20px; margin-right: 20px" align="right">
  <el-button
  v-permission="{action:'insertusers'}"
        size="mini"
        type="primary"
        @click="gotoNewUser"
        >新增用户</el-button>
  <el-button
  v-permission="{action:'deleteusers'}"
        size="mini"
        type="danger"
        @click="openDelete"
        v-if="toDelete">删除用户</el-button>
</div>

<el-dialog title="编辑用户角色" :visible.sync="dialogEditURVisible" :before-close="handleClose">
<el-tree
ref="urTree"
v-if="toEditPermission"
:data="urData"
show-checkbox
node-key="id"
:default-expanded-keys="[]"
:default-checked-keys=userRoleId
:props="treeProps">
</el-tree>
<div slot="footer" class="dialog-footer">
<el-button type="primary" @click="submitEditUR">确 定</el-button>
</div>
</el-dialog>
<el-dialog title="编辑用户权限" :visible.sync="dialogEditUPVisible" :before-close="handleClose">
<el-tree
ref="upTree"
v-if="toEditPermission"
:data="upData"
show-checkbox
node-key="id"
:default-expanded-keys="[]"
:default-checked-keys=userPermissionId
:props="treeProps">
</el-tree>
<div slot="footer" class="dialog-footer">
<el-button type="primary" @click="submitEditUP">确 定</el-button>
</div>
</el-dialog>

</template>
</template>
<template>
    <el-dialog title="编辑用户" :visible.sync="dialogEditFormVisible" :before-close="handleClose">
<el-form :model="editForm" :rules="rules" ref="editForm" class="demo-ruleForm">
<el-form-item label="用户ID" :label-width="formLabelWidth" prop="id">
  <el-input v-model.number="editForm.id" autocomplete="off"></el-input>
</el-form-item>
<el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
  <el-input v-model="editForm.name" autocomplete="off"></el-input>
</el-form-item>
<el-form-item label="用户邮箱" :label-width="formLabelWidth" prop="email">
  <el-input v-model="editForm.email" autocomplete="off"></el-input>
</el-form-item>
<el-form-item label="用户密码" :label-width="formLabelWidth" prop="password">
  <el-input v-model="editForm.password" autocomplete="off"></el-input>
</el-form-item>
</el-form>
<div slot="footer" class="dialog-footer">
<el-button v-permission="{action:'updateusers'}" type="primary" @click="submitForm('editForm')">确 定</el-button>
</div>
</el-dialog>
</template>
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
      <el-button v-permission="{action:'insertusers'}" type="primary" @click="submitFormUser('ruleFormUser')">立即创建</el-button>
      <el-button @click="resetForm('ruleFormUser')">重置</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</template>
  </el-tabs>
  </template>
  
  <style>

    .el-select .el-input {
      width: 130px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
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
import router from '@/router';
    export default {
      data () {
        return {
          activeName: 'user',
          tableData: [],
          multipleSelection: [],
          urData:[],
          upData:[],
          selectedUserId:'',
          userRoleId:[],
          userPermissionId:[],
          dialogEditURVisible: false,
          dialogEditUPVisible: false,
          user:[],
          treeProps: {
          label: 'name',
          children: 'children'
          },
          toEdit: false,
          toDelete: false,
          toEditPermission: false,
          input:'',
          select:'name',
          dialogEditFormVisible: false,
          editForm: {
          id: '',
          name: '',
          email: '',
          password: '',
          o_id: '',
          o_name: '',
          o_email: '',
          o_password: '',
          },
          rules: {
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

          },
          editFormLabelWidth: '120px',
            dialogVisibleUser: false,
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

          },
        };
      },
      created(){
        this.getUsers();
      },
      methods:{
        handleTabClick(tab){
            if(tab.name==='return'){
                this.$router.push('/permission-management-center');
            }else if(tab.name==='settings'){
                this.$router.push('/permission-management-center/settings');
            }
        },
        handleClose(done) {
          this.$confirm('确认关闭？')
          .then(_ => {
            done();
            this.$router.go(0);
          })
          .catch(_ => {});
        },
        handleEdit(index, row) {
            this.editForm.o_id = this.tableData[index].id;
            this.editForm.o_name = this.tableData[index].name;
            this.editForm.o_email = this.tableData[index].email;
            this.editForm.o_password = this.tableData[index].password;
            this.editForm.id = this.tableData[index].id;
            this.editForm.name = this.tableData[index].name;
            this.editForm.email = this.tableData[index].email;
            this.editForm.password = this.tableData[index].password;
            this.dialogEditFormVisible=true;
        },
        handleEditRole(index, row) {
            const user_id = this.tableData[index].id;
            this.selectedUserId = user_id;
            this.getUserRoles(user_id);
            this.dialogEditURVisible = true;
        },
        handleEditPermission(index, row) {
            const user_id = this.tableData[index].id;
            this.selectedUserId = user_id;
            this.getUserPermissions(user_id);
            this.dialogEditUPVisible = true;
        },
        getRoles(){
            this.toEditPermission=!this.toEditPermission;
            const url = "http://localhost:8083/role-center/roletree";
        
            this.axios.get(url,{
              params: {
                
              }}).then(res => {
                this.urData = res.data.roles;
            })
        .catch((error) => {
            this.$message.error(error);
        });
            this.getPermissions();
        },
        getPermissions(){
            const url = "http://localhost:8083/permission-center/permissiontree";
        
            this.axios.get(url,{
              params: {
                
              }}).then(res => {
                this.upData = res.data.permissions;
            })
        .catch((error) => {
            this.$message.error(error);
        });
            
        },
        getUserRoles(user_id) {
            const url = "http://localhost:8083/user-center/users/"+user_id+"/roles";
            this.axios.get(url).then(res => {
                this.userRoleId = res.data.roles;
            })
        .catch((error) => {
            this.$message.error(error);
        });

        },
        getUserPermissions(user_id) {
            const url = "http://localhost:8083/user-center/users/"+user_id+"/permissions";
            this.axios.get(url).then(res => {
                this.userPermissionId = res.data.permissions;
            })
        .catch((error) => {
            this.$message.error(error);
        });

        },
        submitEditUR(){
            const selected_user_id = this.selectedUserId;
            const selected_role_id = this.$refs.urTree.getCheckedKeys();
            let set_old = new Set(this.userRoleId), set_new = new Set(selected_role_id);
            const add_role_id = selected_role_id.filter(item=>set_old.has(item)==false);
            const remove_role_id = this.userRoleId.filter(item=>set_new.has(item)==false);
            if((add_role_id==undefined||add_role_id.length<=0)&&(remove_role_id==undefined||remove_role_id.length<=0)){
                this.$message.error("没有需要更改的角色");
            }else{
                if(remove_role_id==undefined||remove_role_id.length<=0){
                //this.$message.error("没有需要移除的角色");
                const url = "http://localhost:8083/urr/"+selected_user_id;
                this.axios
                .post(url, { 
                    roleIdList: add_role_id,
                })
                .then((res) => {
                if(res.data==''){
                // this.$store.commit('logout')
                // this.$alert('会话已过期, 请重新登录', '系统信息', {
                // confirmButtonText: '确定',
                // callback: action => {
                //   this.$router.push('/login');
                // }
                // });
                }else{
                if(res.data.message=='success'){
                    this.$alert('添加角色成功！', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.go(0);
                    }
                    });
                }
            }
            })
            .catch((error) => {
            this.$message.error(error);
            });

                }else if(add_role_id==undefined||add_role_id.length<=0){

                    const url = "http://localhost:8083/urr/"+selected_user_id;
                this.axios
                .delete(url, {
                params: {
                    roleIdList: remove_role_id,
                },
                paramsSerializer: params => {
                return qs.stringify(params, {indices: false})
                }
                })
                .then((res) => {
                if(res.data==''){
                // this.$store.commit('logout')
                // this.$alert('会话已过期, 请重新登录', '系统信息', {
                // confirmButtonText: '确定',
                // callback: action => {
                //   this.$router.push('/login');
                // }
                // });
                }else{
                if(res.data.message=='success'){
                    this.$alert('移除角色成功！', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.go(0);
                    }
                    });
                }
            }
            })
            .catch((error) => {
            this.$message.error(error);
            });
                }else{
                    const url = "http://localhost:8083/urr/"+selected_user_id;
                this.axios
                .post(url, { 
                    roleIdList: add_role_id,
                })
                .then((res) => {
                if(res.data==''){
                // this.$store.commit('logout')
                // this.$alert('会话已过期, 请重新登录', '系统信息', {
                // confirmButtonText: '确定',
                // callback: action => {
                //   this.$router.push('/login');
                // }
                // });
                }else{
                if(res.data.message=='success'){
                }
            }
            })
            .catch((error) => {
            this.$message.error(error);
            });

            this.axios
                .delete(url, {
                params: {
                    roleIdList: remove_role_id,
                },
                paramsSerializer: params => {
                return qs.stringify(params, {indices: false})
                }
                })
                .then((res) => {
                if(res.data==''){
                // this.$store.commit('logout')
                // this.$alert('会话已过期, 请重新登录', '系统信息', {
                // confirmButtonText: '确定',
                // callback: action => {
                //   this.$router.push('/login');
                // }
                // });
                }else{
                if(res.data.message=='success'){
                    this.$alert('更改角色成功！', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.go(0);
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
            
            
        },
        submitEditUP(){
            const selected_user_id = this.selectedUserId;
            const selected_permission_id = this.$refs.upTree.getCheckedKeys();
            let set_old = new Set(this.userPermissionId), set_new = new Set(selected_permission_id);
            const add_permission_id = selected_permission_id.filter(item=>set_old.has(item)==false);
            const remove_permission_id = this.userPermissionId.filter(item=>set_new.has(item)==false);
            if((add_permission_id==undefined||add_permission_id.length<=0)&&(remove_permission_id==undefined||remove_permission_id.length<=0)){
                this.$message.error("没有需要更改的权限");
            }else{
                if(remove_permission_id==undefined||remove_permission_id.length<=0){
                const url = "http://localhost:8083/upr/"+selected_user_id;
                this.axios
                .post(url, { 
                    permissionIdList: add_permission_id,
                })
                .then((res) => {
                if(res.data==''){
                }else{
                if(res.data.message=='success'){
                    this.$alert('添加权限成功！', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.go(0);
                    }
                    });
                }
            }
            })
            .catch((error) => {
            this.$message.error(error);
            });

                }else if(add_permission_id==undefined||add_permission_id.length<=0){

                    const url = "http://localhost:8083/upr/"+selected_user_id;
                this.axios
                .delete(url, {
                params: {
                    permissionIdList: remove_permission_id,
                },
                paramsSerializer: params => {
                return qs.stringify(params, {indices: false})
                }
                })
                .then((res) => {
                if(res.data==''){
                }else{
                if(res.data.message=='success'){
                    this.$alert('移除权限成功！', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.go(0);
                    }
                    });
                }
            }
            })
            .catch((error) => {
            this.$message.error(error);
            });
                }else{
                    const url = "http://localhost:8083/upr/"+selected_user_id;
                this.axios
                .post(url, { 
                    permissionIdList: add_permission_id,
                })
                .then((res) => {
                if(res.data==''){
                }else{
                if(res.data.message=='success'){
                }
            }
            })
            .catch((error) => {
            this.$message.error(error);
            });

            this.axios
                .delete(url, {
                params: {
                    permissionIdList: remove_permission_id,
                },
                paramsSerializer: params => {
                return qs.stringify(params, {indices: false})
                }
                })
                .then((res) => {
                if(res.data==''){
                }else{
                if(res.data.message=='success'){
                    this.$alert('更改权限成功！', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.go(0);
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
            
            
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.submitEdit();
            } else {
              this.$message.error("无效信息");
              return false;
            }
          });
        },
        submitEdit(){
            const url = "http://localhost:8083/user-center/users";
            this.axios
            .put(url+"/"+this.editForm.o_id,{
                id: this.editForm.id,
                name: this.editForm.name,
                email: this.editForm.email,
                password: this.editForm.password,
            }).then((res)=>{
                if(res.data==''){
                // this.$store.commit('logout')
                // this.$alert('会话已过期, 请重新登录', '系统信息', {
                //   confirmButtonText: '确定',
                //   callback: action => {
                //     this.$router.push('/login');
                //   }
                // });
              }else{
                if(res.data.message=='success'){
                    this.$alert('编辑用户成功！', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.go(0);
                    }
                    });
                    this.dialogEditFormVisible=false;
                }else{
                    this.$message.error(res.data.message);
                }
              }
            })
            .catch((error) => {
              this.$message.error(error);
            });
        },
        openDelete() {
          this.$confirm('此操作将永久删除选中的用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.handleDelete();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        },
        handleDelete() {
          const url = "http://localhost:8083/user-center/users";
          var temp = [];
          for(var i = 0 ; i < this.multipleSelection.length ; i++){
            temp.push(this.multipleSelection[i].id);
          }
  
          this.axios
          .delete(url, {
              params: {
                id: temp,
              },
              paramsSerializer: params => {
                return qs.stringify(params, {indices: false})
              }
          })
          .then((res) => {
              if(res.data==''){
                // this.$store.commit('logout')
                // this.$alert('会话已过期, 请重新登录', '系统信息', {
                //   confirmButtonText: '确定',
                //   callback: action => {
                //     this.$router.push('/login');
                //   }
                // });
              }else{
                  //this.$router.go(0);
              }
          })
          .catch((error) => {
              this.$message.error(error);
          });
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        getUsers(){
            const url = "http://localhost:8083/user-center/users";
        
            this.axios.get(url,{
              params: {
                select: '',
                input:''
              }}).then(res => {
                this.tableData = res.data.users;
            })
        .catch((error) => {
            this.$message.error(error);
        });
            
        },
        searchUser(){
            if(this.input==''){
                this.$message.error("请输入查找内容");
            }else{
                const url = "http://localhost:8083/user-center/users";
        
                this.axios.get(url,{
                  params: {
                    select: this.select,
                    input:this.input,

                  }}).then(res => {
                    this.tableData = res.data.users;
                })
        .catch((error) => {
            this.$message.error(error);
        });
            }
        },
        gotoNewUser(){
          //this.$router.push('/permission-management-center/users/new-user');
          this.dialogVisibleUser=true;
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
              // this.$store.commit('logout')
              // this.$alert('会话已过期, 请重新登录', '系统信息', {
              //   confirmButtonText: '确定',
              //   callback: action => {
              //     this.$router.push('/login');
              //   }
              // });
            }else{
                if(res.data.message=='success'){
                    this.$alert('新增用户成功！', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.go(0);
                    }
                    });
                }
                //this.$router.go(0);
            }
        })
        .catch((error) => {
            this.$message.error(error);
        });
        }
      }
    }
  </script>