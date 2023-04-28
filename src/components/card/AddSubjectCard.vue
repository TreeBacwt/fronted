<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>添加课程</span>
        </div>
      </template>
      <div class="text item">
        <el-input placeholder="请输入课程名" v-model="newSubject" />
        <el-button :icon="Check" circle class="edit-button" @click="handleSubmitButton" />
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { Edit, Check } from "@element-plus/icons-vue"
import { useSubjectsListStore } from "@/stores/subjectsList"
import { ref, inject } from "vue"

const axios = inject("axios")
const subjectsListStore = useSubjectsListStore()

const newSubject = ref("")
function handleSubmitButton() {
  ElMessageBox.confirm("确认添加课程吗？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(() => {
      axios({
        method: "post",
        url: "/subject/add",
        params: {
          subjectName: newSubject.value,
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
  left: 10px;
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
