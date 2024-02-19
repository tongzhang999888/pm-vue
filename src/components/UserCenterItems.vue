<template>
    <div>
      <el-empty description="还没有发布商品" v-if="tableData.length==0" v-permission="{action:'selectitems'}">
            <el-button
            type="text" size="medium" class="button"
            @click="gotoNewItems"
            v-permission="{action:'insertitems'}"
            >前往发布商品</el-button>
          </el-empty>
    <el-table
    v-if="!tableData.length==0"
      ref="multipleTable"
      :data="tableData"
      stripe
      style="width: 100%"
      max-height="600"
      @selection-change="handleSelectionChange"
      v-permission="{action:'selectitems'}">
      <el-table-column
        type="selection"
        width="55" v-if="toDelete">
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.type }}</span>
            </el-form-item>
            <el-form-item label="商品品相">
              <span>{{ props.row.appearance }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.itemId }}</span>
            </el-form-item>
            <el-form-item label="用户 ID">
              <span>{{ props.row.userId }}</span>
            </el-form-item>
            <el-form-item label="商品数量">
              <span>{{ props.row.amount }}</span>
            </el-form-item>
            <el-form-item label="发布时间">
              <span>{{ props.row.time }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.info }}</span>
            </el-form-item>
            <el-form-item label="商品图片">
              <el-button type="text" class="button" @click="viewImages(props.$index)">查看</el-button>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="发布时间"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="itemId"
        label="商品ID"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名">
      </el-table-column>
      <el-table-column label="操作" align="right" width="280">
        <template slot="header" slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" circle @click="toEdit=!toEdit" :disabled="toDelete" v-permission="{action:'updateitems'}"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="toDelete=!toDelete" :disabled="toEdit" v-permission="{action:'deleteitems'}"></el-button>
          </el-row>
        </template>
        <template slot-scope="scope" v-if="toEdit">
          <div style=" margin-right: 15px" align="right">
            <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            v-permission="{action:'updateitems'}">编辑</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
  title=""
  :visible.sync="imageDrawer"
  :with-header="false">
  <span v-if="!toDeleteImages">
            <el-row v-for="url in imageurls" :key="url" :span="6">
                <el-image
                style="width: 300px; height: 300px"
                :src="url"
                fit="contain"></el-image>
                        
            </el-row>
            <el-empty description="没有图片" v-if="imageurls==[]"></el-empty>
  </span>
  <span v-if="toDeleteImages">
    <el-table
    ref="multipleImageTable"
    :data="imageurls"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleImageSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      label="商品图片">
      <template slot-scope="scope">
        <el-image
                style="width: 300px; height: 300px"
                :src="scope.row"
                fit="contain"></el-image>
      </template>
    </el-table-column>
    <el-table-column
      label="" align="right" width="50px">
      <template slot="header" slot-scope="scope">
      <el-button size="mini" type="danger" icon="el-icon-delete" @click="openDeleteImages" circle></el-button>
    </template>
    </el-table-column>
  </el-table>
    <el-empty description="没有图片" v-if="imageurls==[]"></el-empty>
  </span>
</el-drawer>
    <div style="margin-top: 20px; margin-right: 20px" align="right">
        <el-button
            size="medium"
            type="primary"
            @click="gotoNewItems"
            v-permission="{action:'insertitems'}"
            v-if="!tableData.length==0"
            >新增商品</el-button>
        <el-button
            size="medium"
            type="danger"
            @click="openDelete"
            v-permission="{action:'deleteitems'}"
            v-if="toDelete">删除商品</el-button>
    </div>
    
    <div>
        <el-dialog
  title="修改商品信息"
  :visible.sync="dialogVisible"
  width="40%"
  :before-close="handleClose">
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="商品名称" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="商品分类" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择商品分类">
        <el-option label="图书" value="图书"></el-option>
        <el-option label="百货" value="百货"></el-option>
        <el-option label="电器" value="电器"></el-option>
        <el-option label="食品" value="食品"></el-option>
        <el-option label="服饰" value="服饰"></el-option>
        <el-option label="其他" value="其他"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="商品数量" prop="amount">
        <el-input v-model.number="ruleForm.amount"></el-input>
    </el-form-item>
    <el-form-item label="个人闲置" prop="personal">
      <el-switch v-model="ruleForm.personal"></el-switch>
    </el-form-item>
    <el-form-item label="商品品相" prop="appearance">
      <el-radio-group v-model="ruleForm.appearance">
        <el-radio label="全新"></el-radio>
        <el-radio label="轻微使用痕迹"></el-radio>
        <el-radio label="明显使用痕迹"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="商品描述" prop="info">
      <el-input type="textarea" v-model="ruleForm.info"></el-input>
    </el-form-item>
    <el-form-item label="商品图片" prop="info">
      <el-upload
                multiple
                :limit="3"
                class="file-box"
                ref="upload"
                action="http://localhost:8083/file/images"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :on-exceed="handleExceed"
                :file-list="images"
                list-type="picture"
                :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="danger" @click="deleteImage" v-if="imageurls!=[]">删除图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-row :gutter="20">
            <el-col v-for="url in imageurls" :key="url" :span="6">
              
                <el-image
                        style="width: 100px; height: 100px"
                        :src="url"
                        fit="fill"></el-image>
                        
            </el-col>
        </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
    </div>
  </div>
  
  </template>
  
  <style>
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
    export default {
      data () {
        return {
          tableData: [],
          multipleSelection: [],
          toEdit: false,
          toDelete: false,
          dialogVisible: false,
          selectedIndex: '',
          ruleForm: {
            name: '',
            amount: '',
            personal: false,
            type: '',
            appearance: '',
            info: ''
          },
          rules: {
            name: [
              { required: true, message: '请输入商品名称', trigger: 'blur' },
              { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
            ],
            amount: [
              { required: true, message: '请输入商品数量', trigger: 'blur' },
              { type: 'number', message: '商品数量必须为数字值', trigger: 'blur' }
            ],
            type: [
              { required: true, message: '请选择商品分类', trigger: 'change' }
            ],
            appearance: [
              { required: true, message: '请选择商品品相', trigger: 'change' }
            ],
            info: [
              
            ]
          },
          images: [],
          imageurls: [],
          imageDrawer: false,
          toDeleteImages: false,
          deleteImageurls: [],
        };
      },
      created(){
        this.loadItem();
          
      },
      methods:{
        
        handleEdit(index, row) {
          this.getImages(this.tableData[index].itemId)
            this.ruleForm.name=this.tableData[index].name
            this.ruleForm.amount=this.tableData[index].amount
            if(this.tableData[index].personal=='true'){this.ruleForm.personal=true;}
            else{this.ruleForm.personal=false;}
            this.ruleForm.type=this.tableData[index].type
            this.ruleForm.appearance=this.tableData[index].appearance
            this.ruleForm.info=this.tableData[index].info
            this.selectedIndex=index;
            this.dialogVisible=true;
          //console.log(index, row);
        },
        gotoNewItems(){
            this.$router.push('/user-center/new-item')
        },
        openDelete() {
            if(this.multipleSelection.length!=0){
          this.$confirm('此操作将永久删除选中的商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.handleDelete();
            
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        }
        },
        openDeleteImages() {
            if(this.deleteImageurls.length!=0){
          this.$confirm('此操作将永久删除选中的图片, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.handleDeleteImages();
            
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        }
        },
        handleDelete() {
        const url = "http://localhost:8083/user/items";
        var temp = [];
        for(var i = 0 ; i < this.multipleSelection.length ; i++){
          temp.push(this.multipleSelection[i].itemId);
        }

        this.axios
        .delete(url, {
            params: {
              itemId: temp,
            },
            paramsSerializer: params => {
              return qs.stringify(params, {indices: false})
            }
        })
        .then((res) => {
            if(res.data==''){
            }else{
              if(res.data.message=='success'){
                    this.$alert('删除商品成功！', '', {
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
      },
        handleDeleteImages() {
        const url = "http://localhost:8083/file/images";
        this.axios
        .delete(url, {
            params: {
              urls: this.deleteImageurls,
            },
            paramsSerializer: params => {
              return qs.stringify(params, {indices: false})
            }
        })
        .then((res) => {
            if(res.data==''){
            }else{
              if(res.data.message=='success'){
                    this.$alert('删除图片成功！', '', {
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
      },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        loadItem(){
            
            const url = "http://localhost:8083/user";
        
                this.axios.get(url,{
                  params: {

                  }}).then(res => {
                    this.tableData = res.data.items;
                })
        .catch((error) => {
            this.$message.error(error);
        });
        },
        handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
            this.$router.go(0);
          })
          .catch(_ => {});
      },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              //alert('submit!');
              this.handleCreate();
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
            this.ruleForm.name=this.tableData[this.selectedIndex].name
            this.ruleForm.amount=this.tableData[this.selectedIndex].amount
            if(this.tableData[this.selectedIndex].personal=='true'){this.ruleForm.personal=true;}
            else{this.ruleForm.personal=false;}
            this.ruleForm.type=this.tableData[this.selectedIndex].type
            this.ruleForm.appearance=this.tableData[this.selectedIndex].appearance
            this.ruleForm.info=this.tableData[this.selectedIndex].info
          //this.$refs[formName].resetFields();
        },
        handleCreate(){
            const url = "http://localhost:8083/user/items";
            this.axios
        .put(url, {
            itemId: this.tableData[this.selectedIndex].itemId,
            name: this.ruleForm.name,
            amount: this.ruleForm.amount,
            info: this.ruleForm.info,
            appearance: this.ruleForm.appearance,
            type: this.ruleForm.type,
            personal: this.ruleForm.personal,
        })
        .then((res) => {
            if(res.data==''){
            }else{
                if(res.data.message=='success'){
                  this.submitFile(this.tableData[this.selectedIndex].itemId)
                    this.$alert('修改商品信息成功！', '', {
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
        },
        submitUpload () {
      this.$refs.upload.submit()
    },
    submitFile(id) {
                if (this.images.length === 0) {
                    //this.$message.warning("请选择文件")
                    return
                }
                let formData = new FormData() //创建一个表单
                this.images.forEach(file => {
                    formData.append("files", file.raw) //将文件传到表单中，files属性是后端接受的参数名
                    
                })
                formData.append("itemId", id)
                this.axios.post(
                    'http://localhost:8083/file/images',
                    formData,
                    {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
                    this.$message.success("文件上传成功")
                    this.images = []
                }).catch(error => {
                    this.$message.error(error)
                })
            },
            //移除文件列表时的钩子
            handleRemove(file, fileList) {
                this.images = fileList
                console.log("移除文件列表时的钩子", file);
            },
            //点击某个文件时的钩子
            handlePreview(file) {
                console.log("点击某个文件时的钩子", file);
            },
            //添加到上传列表时的钩子
            handleChange(file, fileList) {
                this.images = fileList
                console.log("添加到上传列表时的钩子", file)
            },
            //文件超出个数限制时的钩子
            handleExceed() {
                this.$message.warning("文件超出3个")
                console.log("文件超出个数限制时的钩子")
            },
            getImages(itemId) {
                this.axios.get("http://localhost:8083/file/images",{
                  params: {
                    itemId: itemId,
                  }})
                    .then(response => {
                        this.imageurls = response.data
                        console.log("获取图片列表成功")
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            viewImages(index){
              this.getImages(this.tableData[index].itemId)
              this.imageDrawer=true
            },
            deleteImage(){
              this.toDeleteImages=true;
              this.imageDrawer=true;
            },
            handleImageSelectionChange(val) {
              this.deleteImageurls = val;
              console.log(this.deleteImageurls);
            }
      }
    }
  </script>