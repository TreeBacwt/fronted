<template>
  <div>
    <el-collapse accordion v-model="studentsListStore.activeStudentCollapseItem">
      <el-collapse-item v-if="studentsListStore.isEdit" name="edit">
        <template #title>
          <el-tag type="success" class="text">编辑学生档案</el-tag>
        </template>

        <el-row>
          <el-col :span="12"> <StudentForm class="description" /></el-col
        ></el-row>
      </el-collapse-item>

      <el-collapse-item
        :name="student.studentNum"
        v-for="(student, index) in studentsList"
        :key="student.studentNum"
      >
        <template #title>
          <span class="text">{{ student.studentName }}</span>
        </template>

        <div>
          <el-descriptions :column="1" class="description">
            <template #extra>
              <el-button type="primary" class="edit-button" @click="editStudent(student)"
                >编辑</el-button
              >
              <el-button
                @click="handleStudentIsLeader(student.userId, student.isLeader)"
                :type="student.isLeader == 1 ? 'warning' : 'success'"
                class="edit-button"
                >{{ student.isLeader == 1 ? "撤销班干部" : "设为班干部" }}</el-button
              >
            </template>
            <el-descriptions-item>
              <template #label>
                <el-tag>性别</el-tag>
              </template>
              {{ student.sex == 1 ? "男" : "女" }}</el-descriptions-item
            >
            <el-descriptions-item>
              <template #label> <el-tag>出生日期</el-tag> </template
              >{{ student.birthday.slice(0, 10) }}</el-descriptions-item
            >
            <el-descriptions-item>
              <template #label> <el-tag>家庭住址</el-tag> </template
              >{{ student.address }}</el-descriptions-item
            >
            <el-descriptions-item>
              <template #label>
                <el-tag>民族</el-tag>
              </template>
              {{ student.ethnic }}</el-descriptions-item
            >
            <el-descriptions-item>
              <template #label> <el-tag>个人简介</el-tag> </template
              >{{ student.information }}</el-descriptions-item
            >
            <el-descriptions-item>
              <template #label> <el-tag>是否为班干部</el-tag> </template
              >{{ student.isLeader == 1 ? "是" : "否" }}</el-descriptions-item
            >
          </el-descriptions>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, computed } from "vue"
import { useUserStore } from "@/stores/user"
import { useStudentsListStore } from "@/stores/studentsList"
import StudentForm from "@/components/form/StudentForm.vue"

const axios = inject("axios")
const user = computed(() => useUserStore().user)
const studentsListStore = useStudentsListStore()
const studentsList = computed(() => studentsListStore.studentsList)
studentsListStore.refresh(axios) //为防止没数据，先刷新一次

function handleStudentIsLeader(uid, oldIsLeader) {
  axios({
    method: "put",
    url: "/student/updateIsLeader",
    params: {
      uid,
      isLeader: oldIsLeader == 1 ? 0 : 1,
    },
  })
    .then((res) => {
      //更新一次
      studentsListStore.refresh(axios)
      let data = res.data
      if (data.code == 1) {
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
    })
    .catch((res) => {
      {
        ElNotification({
          title: "错误",
          type: "error",
          message: "出错了！",
        })
      }
    })
}

/*编辑学生档案 */
function editStudent(student) {
  studentsListStore.isEdit = true
  studentsListStore.activeStudentCollapseItem = "edit"
  console.log(JSON.stringify(student))
  studentsListStore.editStudent = JSON.parse(JSON.stringify(student))
}
</script>
<style scoped>
.text {
  position: relative;
  left: 15px;
}
.description {
  position: relative;
  left: 15px;
}
.edit-button {
  position: relative;
  right: 30px;
}
</style>
