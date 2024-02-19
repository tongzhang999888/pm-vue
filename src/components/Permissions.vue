<template>
    <el-tabs @tab-click="handleTabClick" v-model="activeName" tab-position="top" stretch="true" style="height: 200px;">
  
    <template>
    <template>

            <el-button v-permission="{action:'updatepermissions'}" type="primary" icon="el-icon-edit" circle @click="toEdit=!toEdit" :disabled="toDelete"></el-button>
            <el-button v-permission="{action:'deletepermissions'}" type="danger" icon="el-icon-delete" circle @click="toDelete=!toDelete" :disabled="toEdit"></el-button>

    <div style="margin-top: 20px; margin-right: 20px" align="right">

      <el-button
      v-permission="{action:'deletepermissions'}"
            size="mini"
            type="danger"
            @click="openDelete"
            v-if="toDelete">删除权限</el-button>
    </div>
  </template>

<el-input
  placeholder="输入关键字进行过滤"
  v-model="filterText">
</el-input>
<div align="left">
          <el-button
            @click="gotoNewPermission(0)"
            type="text"
            icon="el-icon-circle-plus-outline">
            添加权限
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
  ref="permissionTree">
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
            @click="gotoNewPermission(node.data.id)"
            type="text"
            icon="el-icon-circle-plus-outline">
            添加权限
          </el-button>
          <el-button
            v-if="toEdit"
            @click="handleEdit(node.data)"
            type="text"
            v-permission="{action:'updatepermissions'}"
            icon="el-icon-edit"
            >编辑权限</el-button>
        </span>
  </span>
</el-tree>
    </template>
    <template>
        <el-dialog title="编辑权限" :visible.sync="dialogEditFormVisible" :before-close="handleClose">
  <el-form :model="editForm" :rules="rules" ref="editForm" class="demo-ruleForm">
    <el-form-item label="权限 ID" :label-width="formLabelWidth" prop="id">
      <el-input v-model.number="editForm.id" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="权限名称" :label-width="formLabelWidth" prop="name">
      <el-input v-model="editForm.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="权限描述" :label-width="formLabelWidth" prop="desc">
      <el-input v-model="editForm.desc" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="父级权限ID" :label-width="formLabelWidth" prop="pid">
      <el-input v-model.number="editForm.pid" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="权限路径" :label-width="formLabelWidth" prop="path">
      <el-input v-model="editForm.path" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="权限操作" :label-width="formLabelWidth" prop="right">
      <el-input v-model="editForm.right" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button v-permission="{action:'updatepermissions'}" type="primary" @click="submitForm('editForm')">确 定</el-button>
  </div>
</el-dialog>
    </template>
    <template>
    <el-dialog
  title="新增权限"
  :visible.sync="dialogVisiblePermission"
  width="40%"
  :before-close="handleClose">
<el-form :model="ruleFormPermission" :rules="rulespermission" ref="ruleFormPermission" label-width="100px" class="demo-ruleForm">
    <el-form-item label="权限  ID" prop="id">
      <el-input v-model.number="ruleFormPermission.id" disabled></el-input>
    </el-form-item>
    <el-form-item label="权限名称" prop="name">
      <el-input v-model="ruleFormPermission.name"></el-input>
    </el-form-item>
    <el-form-item label="权限描述" prop="desc">
      <el-input type="textarea" v-model="ruleFormPermission.desc"></el-input>
    </el-form-item>
    <el-form-item label="父级权限ID" prop="pid">
      <el-input v-model.number="ruleFormPermission.pid" disabled></el-input>
    </el-form-item>
    <el-form-item label="权限路径" prop="path">
      <el-input v-model="ruleFormPermission.path"></el-input>
    </el-form-item>
    <el-form-item label="权限操作" prop="right">
      <el-input v-model="ruleFormPermission.right"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button v-permission="{action:'insertpermissions'}" type="primary" @click="submitFormPermission('ruleFormPermission')">立即创建</el-button>
      <el-button @click="resetForm('ruleFormPermission')">重置</el-button>
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
          activeName: 'permission',
          tableData: [],
          toEdit: false,
          toDelete: false,
          input:'',
          select:'name',
          dialogEditFormVisible: false,
          editForm: {
          id: '',
          name: '',
          desc: '',
          pid: '',
          path: '',
          right: '',
          o_id: '',
          o_name: '',
          o_desc: '',
          o_pid: '',
          o_path: '',
          o_right: '',
          },
          rules: {
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
          },
          editFormLabelWidth: '120px',
          dialogVisiblePermission: false,
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
          },
          test:'',
        };
      },
      created(){
        //this.getPermissions();
        this.getPermissionTree();
      },
      watch: {
      filterText(val) {
        this.$refs.permissionTree.filter(val);
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
          })
          .catch(_ => {});
        },
        handleEdit(data) {
            this.editForm.o_id = data.id;
            this.editForm.o_name = data.name;
            this.editForm.o_desc = data.desc;
            this.editForm.o_pid = data.pid;
            this.editForm.o_path = data.path;
            this.editForm.o_right = data.right;
            this.editForm.id = data.id;
            this.editForm.name = data.name;
            this.editForm.desc = data.desc;
            this.editForm.pid = data.pid;
            this.editForm.path = data.path;
            this.editForm.right = data.right;
            this.dialogEditFormVisible=true;
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
            const url = "http://localhost:8083/permission-center/permissions";
            this.axios
            .put(url+"/"+this.editForm.o_id,{
                id: this.editForm.id,
                name: this.editForm.name,
                desc: this.editForm.desc,
                pid: this.editForm.pid,
                path: this.editForm.path,
                right: this.editForm.right,
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
                    this.$alert('编辑权限成功！', '', {
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
          this.$confirm('此操作将永久删除选中的权限, 是否继续?', '提示', {
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
          const url = "http://localhost:8083/permission-center/permissions";
          this.axios
          .delete(url, {
              params: {
                id: this.$refs.permissionTree.getCheckedKeys(),
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
        getPermissions(){
            const url = "http://localhost:8083/permission-center/permissions";
        
            this.axios.get(url,{
              params: {
                select: '',
                input:''
              }}).then(res => {
                this.tableData = res.data.permissions;
            })
          .catch((error) => {
              this.$message.error(error);
          });
            
        },
        getPermissionTree(){
            const url = "http://localhost:8083/permission-center/permissiontree";
        
            this.axios.get(url,{
              params: {
                
              }}).then(res => {
                this.treeData = res.data.permissions;
                this.maxId = res.data.maxId;
            })
        .catch((error) => {
            this.$message.error(error);
        });
            
        },
        searchPermission(){
            if(this.input==''){
                this.$message.error("请输入查找内容");
            }else{
                const url = "http://localhost:8083/permission-center/permissions";
        
                this.axios.get(url,{
                  params: {
                    select: this.select,
                    input:this.input,

                  }}).then(res => {
                    this.tableData = res.data.permissions;
                })
          .catch((error) => {
              this.$message.error(error);
          });
            }
        },
        gotoNewPermission(pid){
          //this.$router.push('/permission-management-center/permissions/new-permission');
          this.ruleFormPermission.pid=pid;
          this.ruleFormPermission.id=this.maxId+1;
          this.dialogVisiblePermission=true;
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
              // this.$store.commit('logout')
              // this.$alert('会话已过期, 请重新登录', '系统信息', {
              //   confirmButtonText: '确定',
              //   callback: action => {
              //     this.$router.push('/login');
              //   }
              // });
            }else{
                if(res.data.message=='success'){
                    this.maxId++;
                    this.$alert('新增权限成功！', '', {
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