<template>
  <div class="container">
    <div class="card">
      <form class="card-form">
        <div class="input">
          <el-tooltip
            class="box-item"
            effect="light"
            :content="accountTipContent"
            placement="top"
          >
            <input
              @input="handleAccountInputChange"
              type="text"
              class="input-field"
              required
              v-model="form.account"
            />
          </el-tooltip>
          <label class="input-label">账户名</label>
        </div>

        <div class="input">
          <input type="password" class="input-field" required v-model="form.password" />
          <label class="input-label">密码</label>
        </div>

        <div class="input">
          <input type="text" class="input-field" required v-model="teacher.teacherName" />
          <label class="input-label">姓名</label>
        </div>

        <div class="input">
          <el-radio-group v-model="teacher.sex" class="sex-radio">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
          <label class="input-label">性别</label>
        </div>

        <div class="action">
          <input type="button" class="action-button" @click="register" value="注册" />
        </div>
      </form>

      <div class="card-info">
        <p>中职班级管理系统</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, inject } from "vue"
import { useUserStore } from "@/stores/user"
import { ElNotification } from "element-plus"
import { useRouter, useRoute } from "vue-router"
import { useSubjectsListStore } from "@/stores/subjectsList"

import "@/assets/login.css"

const axios = inject("axios")
const router = useRouter()
const route = useRoute()

const form = reactive({
  account: "",
  password: "",
})

const teacher = reactive({
  teacherName: "",
  sex: "",
  information: "这个人很懒，什么都没留下",
  subject: "",
})

const store = useUserStore()

function register() {
  //非空校验
  if (
    form.account === "" ||
    form.password === "" ||
    teacher.teacherName === "" ||
    teacher.sex === ""
  ) {
    ElMessage.warning("账户信息不能为空！")
  } else {
    axios({
      method: "post",
      url: "/user/register/teacher",
      params: {
        teacherName: teacher.teacherName,
        sex: teacher.sex,
        information: teacher.information,
        subject: teacher.subject,
        account: form.account,
        password: form.password,
      },
    })
      .then((res) => {
        let data = res.data
        if (data.code == 1) {
          ElNotification({
            title: "成功",
            type: "success",
            message: data.message,
          })
          router.push("/login")
        } else {
          ElNotification({
            title: "错误",
            type: "error",
            message: data.message,
          })
        }
      })
      .catch((res) => {
        ElNotification({
          title: "错误",
          type: "error",
          message: "出错了！",
        })
      })
  }
}

/*用户名重复检验 */
const accountTipContent = ref("请输入账户名")
function handleAccountInputChange() {
  if (form.account !== "") {
    axios({
      method: "get",
      url: "/user/checkAccount/" + form.account,
    })
      .then((res) => {
        let data = res.data
        if (data.code == 1) {
          accountTipContent.value = data.message
        } else {
          accountTipContent.value = data.message
        }
      })
      .catch((res) => {
        ElNotification({
          title: "错误",
          type: "error",
          message: res.data,
        })
      })
  } else {
    accountTipContent.value = "账户名不能为空！"
  }
}
</script>

<style scoped>
.container {
  display: flex;
  height: 100%;
}
.sex-radio {
  position: relative;
  left: 50px;
  bottom: 3px;
}
</style>
