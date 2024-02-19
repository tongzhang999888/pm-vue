<template>
    <el-dialog
  title="发布商品"
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
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>

    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即发布</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</template>
  <script>
    export default {
      data() {
        return {
            dialogVisible: true,
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
          imageurls: []
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
          this.$refs[formName].resetFields();
        },
        handleCreate(){
            const url = "http://localhost:8083/user/items";
            this.axios
        .post(url, {
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
                  this.submitFile(res.data.itemId)
                    this.$alert('发布商品成功！', '', {
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
            getImages() {
                this.axios.get("http://localhost:8083/file/images")
                    .then(response => {
                        this.imageurls = response.data
                        console.log("获取图片列表成功")
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
      }
    }
  </script>