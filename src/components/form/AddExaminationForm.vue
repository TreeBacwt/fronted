<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="考试名称">
        <el-input v-model="newExamination.examinationName" />
      </el-form-item>
      <el-form-item label="考试时间">
        <el-date-picker
          type="date"
          placeholder="请选择考试时间"
          value-format="YYYY-MM-DD"
          v-model="newExamination.examinationDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handleSubmitButton">提交</el-button>
      </el-form-item>
    </el-form>
    <el-table
      stripe
      style="width: 100%"
      table-layout="fixed"
      :data="subjectsListStore.examinationForm"
      row-key="studentNum"
    >
      <el-table-column label="姓名" prop="studentName" />
      <el-table-column
        v-for="(item, index) in subjectsListStore.subjectsList"
        :key="index"
        :label="item.subjectName"
        :prop="item.id.toString()"
      >
        <template #default="scope">
          <el-input
            placeholder="请输入分数"
            type="number"
            step="0.5"
            max="100"
            min="0"
            v-model="
              subjectsListStore.examinationForm[scope.$index][scope.column.property]
            "
            @input="handleLimitInputScore(scope)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, reactive, computed } from "vue"
import { useExaminationsListStore } from "@/stores/examinationsList"
import { useSubjectsListStore } from "@/stores/subjectsList"

const axios = inject("axios")
const examinationsListStore = useExaminationsListStore()

const subjectsListStore = useSubjectsListStore()
subjectsListStore.refresh(axios)

function handleLimitInputScore(scope) {
  if (subjectsListStore.examinationForm[scope.$index][scope.column.property] > 100)
    subjectsListStore.examinationForm[scope.$index][scope.column.property] = 100
  else if (subjectsListStore.examinationForm[scope.$index][scope.column.property] < 0)
    subjectsListStore.examinationForm[scope.$index][scope.column.property] = 0
}

const newExamination = reactive({
  examinationName: "",
  examinationDate: "",
})

function handleSubmitButton() {
  let scores = []
  subjectsListStore.examinationForm.forEach((item) => {
    subjectsListStore.subjectsList.forEach((subject) => {
      let element = {
        subjectId: subject.id,
        studentNum: item.studentNum,
        score: parseFloat(item[subject.id.toString()]),
      }
      scores.push(element)
    })
  })
  //console.log(scores)
  axios({
    method: "post",
    url: "/examination/addExamWithScores",
    data: {
      examination: {
        examinationName: newExamination.examinationName,
        examinationDate: newExamination.examinationDate,
      },
      scores,
    },
  })
    .then((res) => {
      let data = res.data
      if (data.code == 1) {
        examinationsListStore.refresh(axios, examinationsListStore.currentPage)
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
      ElNotification({
        title: "错误",
        type: "error",
        message: "出错了！",
      })
    })
}
</script>
<style scoped>
.button {
  position: relative;
  left: 30px;
}
</style>
