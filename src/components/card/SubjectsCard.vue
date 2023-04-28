<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>课程列表</span>
        </div>
      </template>
      <div
        v-for="(subject, index) in subjectsListStore.subjectsList"
        :key="index"
        class="text item"
      >
        <span> {{ index + 1 }}. </span>
        <span v-if="!subject.isEdit">
          {{ subject.subjectName }}
        </span>
        <el-input v-else class="subject-input" v-model="editSubject.subjectName" />
        <el-button
          :icon="Edit"
          circle
          class="edit-button"
          v-if="!subject.isEdit"
          @click="handleEditButton(subject)"
        />
        <el-button
          :icon="Check"
          circle
          class="edit-button"
          v-if="subject.isEdit"
          @click="handleCheckButton"
        />
        <el-button
          :icon="Delete"
          circle
          type="danger"
          class="delete-button"
          @click="handleDeleteButton(subject)"
        />
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { Edit, Delete, Check } from "@element-plus/icons-vue"
import { useSubjectsListStore } from "@/stores/subjectsList"
import { ref, inject, onMounted, reactive } from "vue"

const axios = inject("axios")
const subjectsListStore = useSubjectsListStore()

onMounted(() => {
  subjectsListStore.refresh(axios)
})

const editSubject = reactive({
  id: "",
  subjectName: "",
})
function handleCheckButton() {
  if (editSubject.subjectName !== "") {
    axios({
      method: "put",
      url: "/subject/upd",
      params: editSubject,
    })
      .then((res) => {
        let data = res.data
        if (data.code == 1) {
          ElNotification({
            title: "成功",
            type: "success",
            message: data.message,
          })
          subjectsListStore.refresh(axios)
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

function handleEditButton(subject) {
  subjectsListStore.subjectsList.forEach((element) => {
    element.isEdit = false
  })
  subject.isEdit = true
  editSubject.subjectName = subject.subjectName
  editSubject.id = subject.id
}

function handleDeleteButton(subject) {
  ElMessageBox.confirm("确认删除课程吗？", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      axios({
        method: "delete",
        url: "/subject/delete",
        params: {
          id: subject.id,
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
            subjectsListStore.refresh(axios)
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
    })
    .catch(() => {})
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
.edit-button {
  position: relative;
  left: 15px;
}
.delete-button {
  position: relative;
  left: 10px;
}
.subject-input {
  width: 150px;
  position: relative;
  left: 10px;
}
</style>
