<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>个人信息</span>
        <el-button type="primary" text @click="handleEditButton">
          {{ isEdit ? "提交" : "编辑" }}</el-button
        >
        <el-button type="info" text @click="isEdit = !isEdit" v-if="isEdit"
          >取消</el-button
        >
      </div>
    </template>
    <div class="text item">
      姓名：<span v-if="!isEdit">{{ teacher.name }}</span>
      <el-input v-else class="information-input" v-model="editTeacher.teacherName" />
    </div>
    <div class="text item">
      性别：<span v-if="!isEdit">{{ teacher.sex == 1 ? "男" : "女" }}</span>
      <el-radio-group v-model="editTeacher.sex" class="ml-4" v-else>
        <el-radio :label="1" size="large">男</el-radio>
        <el-radio :label="0" size="large">女</el-radio>
      </el-radio-group>
    </div>
    <div class="text item">
      负责课程：<span v-if="!isEdit">{{ teacher.subject }}</span>
      <el-select v-model="editTeacher.subject" placeholder="选择任教课程" v-else>
        <el-option
          v-for="item in subjectsListStore.subjectsList"
          :label="item.subjectName"
          :value="item.subjectName"
        />
      </el-select>
    </div>
    <div class="text item">
      个人简介：<span v-if="!isEdit">{{ teacher.information }}</span>
      <el-input
        v-else
        class="information-input"
        type="textarea"
        v-model="editTeacher.information"
      />
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { reactive, ref, inject, computed, onMounted } from "vue"
import { useUserStore } from "@/stores/user"
import { useTeacherStore } from "@/stores/teacher"
import { useSubjectsListStore } from "@/stores/subjectsList"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()
const axios = inject("axios")
const userStore = useUserStore()
const user = computed(() => userStore.user)
const teacherStore = useTeacherStore()
const teacher = computed(() => teacherStore.teacher)

const subjectsListStore = useSubjectsListStore()

onMounted(() => {
  axios({
    method: "get",
    url: "/teacher/queryByUid/" + user.value.id,
  }).then((res) => {
    let data = res.data
    if (data.code == 1) {
      /*success*/
      let t = data.data
      teacherStore.save(t)
    } else {
      ElMessage.error(data.message)
      router.push("/")
    }
  })

  subjectsListStore.refresh(axios)
})

/*编辑教师信息 */
const isEdit = ref(false)

const editTeacher = ref()

function handleEditButton() {
  if (isEdit.value) {
    //提交
    axios({
      method: "put",
      url: "/teacher/upd",
      params: editTeacher.value,
    })
      .then((res) => {
        let data = res.data
        if (data.code == 1) {
          ElNotification({
            title: "成功",
            type: "success",
            message: data.message,
          })
          isEdit.value = false
          axios({
            method: "get",
            url: "/teacher/queryByUid/" + user.value.id,
          }).then((res) => {
            let data = res.data
            if (data.code == 1) {
              /*success*/
              let t = data.data
              teacherStore.save(t)
            } else {
              ElMessage.error(data.message)
            }
          })
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
  } else {
    //进入编辑状态
    isEdit.value = true
    editTeacher.value = {
      id: teacher.value.id,
      teacherName: teacher.value.name,
      sex: teacher.value.sex,
      subject: teacher.value.subject,
      information: teacher.value.information,
    }
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
.information-input {
  width: 40%;
}
</style>
