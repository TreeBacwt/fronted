<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>个人信息</span>
      </div>
    </template>
    <div class="text item">姓名：{{ studentStore.student.studentName }}</div>
    <div class="text item">学号：{{ studentStore.student.studentNum }}</div>
    <div class="text item">性别：{{ studentStore.student.sex == 1 ? "男" : "女" }}</div>
    <div class="text item">生日：{{ studentStore.student.birthday.slice(0, 10) }}</div>
    <div class="text item">住址：{{ studentStore.student.address }}</div>
    <div class="text item">民族：{{ studentStore.student.ethnic }}</div>
    <div class="text item">
      是否为班干部：{{ studentStore.student.isLeader == 1 ? "是" : "否" }}
    </div>
    <div class="text item">个人简介：{{ studentStore.student.information }}</div>
  </el-card>
</template>
<script lang="ts" setup>
import { reactive, ref, inject, computed, onMounted } from "vue"
import { useUserStore } from "@/stores/user"
import { useStudentStore } from "@/stores/student"

const axios = inject("axios")
const userStore = useUserStore()
const user = computed(() => userStore.user)
const studentStore = useStudentStore()

onMounted(() => {
  studentStore.refreshStudent(axios, user.value.id)
})
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
