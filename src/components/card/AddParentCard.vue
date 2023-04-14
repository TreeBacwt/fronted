<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <span>添加家长账户</span>
        <el-button type="primary" class="button" text @click="addParent">提交</el-button>
      </div>
    </template>

    <el-form label-position="left" label-width="100px" :model="form">
      <el-form-item label="账户名">
        <el-tooltip placement="top-start" :content="accountTipContent" effect="light">
          <el-input v-model="form.account" @input="handleAccountInputChange"
        /></el-tooltip>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.parentName" />
      </el-form-item>
      <el-form-item label="学生">
        <el-select
          v-model="studentName"
          placeholder="请选择该家长的孩子"
          @click="studentsListStore.refresh(axios)"
        >
          <el-option
            @click="handleStudentNum"
            v-for="(item, index) in studentsList"
            :key="index"
            :value="item.studentName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input v-model="form.information" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script lang="ts" setup>
import { reactive, ref, inject, computed, unref } from "vue"
import { useUserStore } from "@/stores/user"
import { useUsersListStore } from "@/stores/usersList"
import { useStudentsListStore } from "@/stores/studentsList"
import { useRouter } from "vue-router"

const user = computed(() => useUserStore().user)
const usersListStore = useUsersListStore()
const studentsListStore = useStudentsListStore()
const axios = inject("axios")
const router = useRouter()

const accountTipContent = ref("请输入用户名")

const studentsList = computed(() => studentsListStore.studentsList)
const studentName = ref("")
const studentSelected = computed(
  () => studentsList.value.filter((data) => data.studentName === studentName.value)[0]
)

const form = reactive({
  account: "",
  parentName: "",
  studentNum: 1,
  information: "这个人很懒，什么都没留下",
})

function handleStudentNum() {
  form.studentNum = studentSelected.value.studentNum
}

function addParent() {
  axios({
    method: "post",
    url: "/user/register/par",
    params: form,
  })
    .then((res) => {
      let data = res.data
      if (data.code == 1) {
        //重置数据
        form.account = ""
        form.parentName = ""
        studentName.value = ""
        form.information = "这个人很懒，什么都没留下"
        ElNotification({
          title: "成功",
          type: "success",
          message: data.message,
        })
      } else {
        ElNotification({
          title: "错误",
          type: "error",
          message: data.message,
        })
      }
      //刷新用户列表
      usersListStore.refresh(axios)
    })
    .catch((res) =>
      ElNotification({
        title: "错误",
        type: "error",
        message: "出错了！",
      })
    )
}

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
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}

.text {
  font-size: 20px;
}

.item {
  display: flex;
  margin-bottom: 18px;
  text-align: left;
  height: 30px;
  align-items: center;
}
.card-body {
  display: flex;
}
</style>
