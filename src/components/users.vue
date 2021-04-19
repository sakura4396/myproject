<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" :offset="0">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="30%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.roleName}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页数
        pagesize: 2 // 当前每页显示数据
      },
      userlist: [
        {
          id: 1,
          username: 'admin1',
          email: '123@163.com',
          mobile: '1322222222',
          roleName: '管理员'
        }
      ],
      addDialogVisible: false, // 控制添加用户对话框的显示与隐藏
      editDialogVisible: false, // 控制修改用户对话框的显示与隐藏
      addForm: { // 添加用户的表单数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {}, // 查询到用户信息保存
      addFormRules: { // 添加表单的验证规则对象
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRules: { // 修改表单的验证规则对象
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      setRoleDialogVisible: false, // 控制分配角色对话框的显示与隐藏
      userInfo: {}, // 需要被分配角色的用户信息
      rolesList: [
        {
          id: 1,
          roleName: '超级管理员'
        },
        {
          id: 2,
          roleName: '管理员'
        },
        {
          id: 3,
          roleName: '普通用户'
        }
      ], // 所有角色的数据列表
      selectedRoleId: '', // 已选中的角色id值
      changedata: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      this.total = this.userlist.length
      /* const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据列表失败')
      }
      this.userlist = res.data.users */
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击添加新用户
    addUser () {
      const username = this.addForm.username
      const password = this.addForm.password
      const email = this.addForm.email
      const mobile = this.addForm.mobile
      const info = {
        username,
        password,
        email,
        mobile,
        roleName: '普通用户',
        id: new Date().getTime()
      }
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        this.userlist.push(info)
        this.$message.success('添加用户成功！')
        this.addDialogVisible = false // 隐藏对话框
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      for (let i = 0; i < this.userlist.length; i++) {
        if (id === this.userlist[i].id) {
          this.editForm = this.userlist[i]
        }
      }
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUser () {
      const email = this.editForm.email
      const mobile = this.editForm.mobile
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        for (let i = 0; i < this.userlist.length; i++) {
          if (this.editForm.id === this.userlist[i].id) {
            const id = this.editForm.id
            const username = this.userlist[i].username
            const roleName = this.userlist[i].roleName
            const info = {
              id,
              username,
              email,
              mobile,
              roleName
            }
            this.userlist.splice(i, 1, info)
          }
        }
        this.$message.success('更新用户信息成功！')
        this.editDialogVisible = false // 隐藏对话框
        this.getUserList()
      })
    },
    // 依据ID删除对应用户信息
    async removeUserById (id) {
      const confirmResult = await this.$confirm('是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消删除，返回值为cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      for (let i = 0; i < this.userlist.length; i++) {
        if (id === this.userlist[i].id) {
          this.userlist.splice(i, 1)
        }
      }
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 展示分配角色对话框
    setRole (userInfo) {
      this.userInfo = userInfo
      this.setRoleDialogVisible = true
    },
    // 点击按钮分配角色
    saveRoleInfo () {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      for (let i = 0; i < this.userlist.length; i++) {
        if (this.userInfo.id === this.userlist[i].id) {
          for (let j = 0; j < this.rolesList.length; j++) {
            if (this.selectedRoleId === this.rolesList[j].id) {
              this.userlist[i].roleName = this.rolesList[j].roleName
              console.log(this.userInfo.id)
              this.$message.success('更新角色成功！')
            }
          }
        }
      }
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style lang="less" scoped>
</style>
