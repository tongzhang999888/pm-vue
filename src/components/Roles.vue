<template>
    <el-tabs @tab-click="handleTabClick" v-model="activeName" tab-position="top" stretch="true" style="height: 200px;">
  
    <template>
    <template>
 
          <el-row>
            <el-button v-permission="{action:'rpr'}" type="success" icon="el-icon-connection" circle @click="getPermissions" :disabled="toDelete||toEdit"></el-button>
            <el-button v-permission="{action:'updateroles'}" type="primary" icon="el-icon-edit" circle @click="toEdit=!toEdit" :disabled="toDelete||toEditPermission"></el-button>
            <el-button v-permission="{action:'deleteroles'}" type="danger" icon="el-icon-delete" circle @click="toDelete=!toDelete" :disabled="toEdit||toEditPermission"></el-button>
          </el-row>
    <div style="margin-top: 20px; margin-right: 20px" align="right">
      <el-button
      v-permission="{action:'deleteroles'}"
            size="mini"
            type="danger"
            @click="openDelete"
            v-if="toDelete">删除角色</el-button>
    </div>

    <el-input
  placeholder="输入关键字进行过滤"
  v-model="filterText">
</el-input>
<div align="left">
          <el-button
          v-permission="{action:'insertroles'}"
            @click="gotoNewRole(0)"
            type="text"
            icon="el-icon-circle-plus-outline">
            添加角色
          </el-button>
</div>
<el-tree
  class="filter-tree"
  :show-checkbox="toDelete"
  :draggable="toEdit"
  @node-drag-end="handleDragEnd"
  node-key="id"
  :data="treeData"
  :props="treeDefaultProps"
  default-expand-all
  :filter-node-method="filterNode"
  ref="roleTree">
  <span class="custom-tree-node" slot-scope="{ node }">
        <span>{{ node.label }}</span>
        <span>
          <el-popover
          placement="top-start"
          :title=node.label
          width="400"
          trigger="hover"
          :content=node.data>
          <el-button slot="reference" type="text" icon="el-icon-info">
            查看详情
          </el-button>
        </el-popover>
          <el-button
          v-permission="{action:'insertroles'}"
            @click="gotoNewRole(node.data.id)"
            type="text"
            icon="el-icon-circle-plus-outline">
            添加角色
          </el-button>
          <el-button
            v-if="toEdit"
            @click="handleEdit(node.data)"
            type="text"
            v-permission="{action:'updateroles'}"
            icon="el-icon-edit"
            >编辑角色</el-button>
              <el-button
              v-if="toEditPermission"
              v-permission="{action:'selectrpr'}"
              type="text"
              icon="el-icon-edit"
              @click="handleEditPermission(node.data)">编辑权限</el-button>
        </span>
  </span>
</el-tree>

    <el-dialog title="编辑角色权限" :visible.sync="dialogEditRPVisible" :before-close="handleClose">
    <el-tree
    ref="ptree"
    v-if="toEditPermission"
    :data="ptdata"
    show-checkbox
    node-key="id"
    :default-expanded-keys="[]"
    :default-checked-keys=rolePermissionId
    :props="ptProps">
    <span class="custom-tree-node" slot-scope="{ node }">
        <span>{{ node.label }}</span>
        <span>
          <el-popover
          placement="top-start"
          :title=node.label
          width="400"
          trigger="hover"
          :content=node.data>
          <el-button slot="reference" type="text" icon="el-icon-info">
            查看详情
          </el-button>
        </el-popover>
        </span>
  </span>
    </el-tree>
    
    <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submitEditRP">确 定</el-button>
    </div>
    </el-dialog>

  </template>
    </template>
    <template>
        <el-dialog title="编辑角色" :visible.sync="dialogEditFormVisible" :before-close="handleClose">
  <el-form :model="editForm" :rules="rules" ref="editForm" class="demo-ruleForm">
    <el-form-item label="角色 ID" :label-width="formLabelWidth" prop="id">
      <el-input v-model.number="editForm.id" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
      <el-input v-model="editForm.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" :label-width="formLabelWidth" prop="desc">
      <el-input v-model="editForm.desc" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="父级角色ID" :label-width="formLabelWidth" prop="pid">
      <el-input v-model.number="editForm.pid" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button v-permission="{action:'updateroles'}" type="primary" @click="submitForm('editForm')">确 定</el-button>
  </div>
</el-dialog>
    </template>
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
      <el-button v-permission="{action:'insertroles'}" type="primary" @click="submitFormRole('ruleFormRole')">立即创建</el-button>
      <el-button @click="resetForm('ruleFormRole')">重置</el-button>
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
          filterText: '',
          treeData: [],
          treeDefaultProps: {
          children: 'children',
          label: 'name'
          },
          maxId:0,
          activeName: 'role',
          tableData: [],
          ptdata:[],
          selectedRoleId:'',
          rolePermissionId:[],
          dialogEditRPVisible: false,
          role:[],
          ptProps: {
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
          desc: '',
          pid: '',
          o_id: '',
          o_name: '',
          o_desc: '',
          o_pid: '',
          },
          rules: {
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
          },
          editFormLabelWidth: '120px',
          
          dialogVisibleRole: false,
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
          },
          test1:[],
          test2:[],
        };
      },
      created(){
        this.getRoles();
        this.getRoleTree();
      },
      watch: {
      filterText(val) {
        this.$refs.roleTree.filter(val);
        }
      },
      methods:{
        filterNode(value, data) {
          if (!value) return true;
          return data.name.indexOf(value) !== -1;
        },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        console.log('tree drag end: ', dropNode && dropNode.label, dropType);
        if(dropType=='inner'){
          this.handleEdit(draggingNode.data)
          this.editForm.pid=dropNode.data.id
        }else if(dropType=='before'||dropType=='after'){
          this.handleEdit(draggingNode.data)
          this.editForm.pid=dropNode.data.pid
        }
      },
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
        handleEdit(data) {
            this.editForm.o_id = data.id;
            this.editForm.o_name = data.name;
            this.editForm.o_desc = data.desc;
            this.editForm.o_pid = data.pid;
            this.editForm.id = data.id;
            this.editForm.name = data.name;
            this.editForm.desc = data.desc;
            this.editForm.pid = data.pid;
            this.dialogEditFormVisible=true;
        },
        handleEditPermission(data) {
            const role_id = data.id;
            this.selectedRoleId = role_id;
            this.getRolePermissions(role_id);
            this.dialogEditRPVisible = true;
            // this.rolePermissionId.forEach(val => {
            //     this.$nextTick(()=>{
            //         this.$refs.ptree.setChecked(val,true,false)
            //     })
            // })
        },
        getPermissions(){
            this.toEditPermission=!this.toEditPermission;
            const url = "http://localhost:8083/permission-center/permissiontree";
        
            this.axios.get(url,{
              params: {
                
              }}).then(res => {
                this.ptdata = res.data.permissions;
            })
        .catch((error) => {
            this.$message.error(error);
        });
            
        },
        getRolePermissions(role_id) {
            const url = "http://localhost:8083/role-center/roles/"+role_id+"/permissions";
            this.axios.get(url).then(res => {
                this.rolePermissionId = res.data.permissions;
            })
        .catch((error) => {
            this.$message.error(error);
        });

        },
        submitEditRP(){
            const selected_role_id = this.selectedRoleId;
            const selected_permission_id = this.$refs.ptree.getCheckedKeys();
            let set_old = new Set(this.rolePermissionId), set_new = new Set(selected_permission_id);
            const add_permission_id = selected_permission_id.filter(item=>set_old.has(item)==false);
            const remove_permission_id = this.rolePermissionId.filter(item=>set_new.has(item)==false);
            // this.test1 = add_permission_id;
            // this.test2 = remove_permission_id;
            if((add_permission_id==undefined||add_permission_id.length<=0)&&(remove_permission_id==undefined||remove_permission_id.length<=0)){
                this.$message.error("没有需要更改的权限");
            }else{
                if(remove_permission_id==undefined||remove_permission_id.length<=0){
                //this.$message.error("没有需要移除的权限");
                const url = "http://localhost:8083/rpr/"+selected_role_id;
                this.axios
                .post(url, { 
                    permissionIdList: add_permission_id,
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

                    const url = "http://localhost:8083/rpr/"+selected_role_id;
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
                // this.$store.commit('logout')
                // this.$alert('会话已过期, 请重新登录', '系统信息', {
                // confirmButtonText: '确定',
                // callback: action => {
                //   this.$router.push('/login');
                // }
                // });
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
                    const url = "http://localhost:8083/rpr/"+selected_role_id;
                this.axios
                .post(url, { 
                    permissionIdList: add_permission_id,
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
                    permissionIdList: remove_permission_id,
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
            const url = "http://localhost:8083/role-center/roles";
            this.axios
            .put(url+"/"+this.editForm.o_id,{
                id: this.editForm.id,
                name: this.editForm.name,
                desc: this.editForm.desc,
                pid: this.editForm.pid,
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
                    this.$alert('编辑角色成功！', '', {
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
          this.$confirm('此操作将永久删除选中的角色, 是否继续?', '提示', {
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
          const url = "http://localhost:8083/role-center/roles";
          this.axios
          .delete(url, {
              params: {
                id: this.$refs.roleTree.getCheckedKeys(),
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
        getRoles(){
            const url = "http://localhost:8083/role-center/roles";
        
            this.axios.get(url,{
              params: {
                select: '',
                input:''
              }}).then(res => {
                this.tableData = res.data.roles;
            })
        .catch((error) => {
            this.$message.error(error);
        });
            
        },
        getRoleTree(){
            const url = "http://localhost:8083/role-center/roletree";
        
            this.axios.get(url,{
              params: {
                
              }}).then(res => {
                this.treeData = res.data.roles;
                this.maxId = res.data.maxId;
            })
        .catch((error) => {
            this.$message.error(error);
        });
            
        },
        searchRole(){
            if(this.input==''){
                this.$message.error("请输入查找内容");
            }else{
                const url = "http://localhost:8083/role-center/roles";
        
                this.axios.get(url,{
                  params: {
                    select: this.select,
                    input:this.input,

                  }}).then(res => {
                    this.tableData = res.data.roles;
                })
        .catch((error) => {
            this.$message.error(error);
        });
            }
        },
        gotoNewRole(pid){
          //this.$router.push('/permission-management-center/roles/new-role');
          this.ruleFormRole.pid=pid;
          this.ruleFormRole.id=this.maxId+1;
          this.dialogVisibleRole=true;
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
              // this.$store.commit('logout')
              // this.$alert('会话已过期, 请重新登录', '系统信息', {
              //   confirmButtonText: '确定',
              //   callback: action => {
              //     this.$router.push('/login');
              //   }
              // });
            }else{
                if(res.data.message=='success'){
                    this.$alert('新增角色成功！', '', {
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