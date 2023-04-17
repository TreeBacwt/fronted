<template>
  <div>
    <el-form :inline="true" :model="examinationForm">
      <el-form-item label="考试名称">
        <el-input
          placeholder="请输入考试名称"
          v-model="examinationForm.examinationName"
        />
      </el-form-item>
      <el-form-item label="考试日期">
        <el-date-picker
          type="date"
          placeholder="请选择考试日期"
          v-model="examinationForm.examinationDate"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
    </el-form>
    <el-form
      :inline="true"
      v-for="(item, index) in studentsListStore.studentsList"
      :key="item.studentNum"
    >
      <el-form-item :label="item.studentName" />
      <el-form-item label="英语">
        <el-input
          placeholder="请输入分数"
          v-model="studentsListStore.scores[item.studentNum].english"
          type="number"
          step="0.5"
          max="100"
          min="0"
          @input="limitEnglishScore(item.studentNum)"
        />
      </el-form-item>
      <el-form-item label="数学">
        <el-input
          placeholder="请输入分数"
          v-model="studentsListStore.scores[item.studentNum].math"
          type="number"
          step="0.5"
          max="100"
          min="0"
          @input="limitMathScore(item.studentNum)"
        />
      </el-form-item>
      <el-form-item label="语文">
        <el-input
          placeholder="请输入分数"
          v-model="studentsListStore.scores[item.studentNum].chinese"
          type="number"
          step="0.5"
          max="100"
          min="0"
          @input="limitChineseScore(item.studentNum)"
        />
      </el-form-item>
      <el-form-item label="计算机科学与技术">
        <el-input
          placeholder="请输入分数"
          v-model="studentsListStore.scores[item.studentNum].computer"
          type="number"
          step="0.5"
          max="100"
          min="0"
          @input="limitComputerScore(item.studentNum)"
        />
      </el-form-item>
    </el-form>
    <el-button type="success" @click="AddExaminationWithScores">提交</el-button>
  </div>
</template>
<script setup>
import { inject, ref, reactive, computed } from "vue"
import { useStudentsListStore } from "@/stores/studentsList"
import { useExaminationsListStore } from "@/stores/examinationsList"

const axios = inject("axios")
const studentsListStore = useStudentsListStore()
studentsListStore.refresh(axios)

const examinationForm = reactive({
  examinationName: "",
  examinationDate: "",
})

console.log(studentsListStore.scores.value)
const examinationsListStore = useExaminationsListStore()
/**限制分数输入 */
function limitMathScore(index) {
  if (studentsListStore.scores[index].math > 100) {
    studentsListStore.scores[index].math = 100
  } else if (studentsListStore.scores[index].math < 0) {
    studentsListStore.scores[index].math = 0
  }
}
function limitEnglishScore(index) {
  if (studentsListStore.scores[index].english > 100) {
    studentsListStore.scores[index].english = 100
  } else if (studentsListStore.scores[index].english < 0) {
    studentsListStore.scores[index].english = 0
  }
}
function limitChineseScore(index) {
  if (studentsListStore.scores[index].chinese > 100) {
    studentsListStore.scores[index].chinese = 100
  } else if (studentsListStore.scores[index].chinese < 0) {
    studentsListStore.scores[index].chinese = 0
  }
}
function limitComputerScore(index) {
  if (studentsListStore.scores[index].computer > 100) {
    studentsListStore.scores[index].computer = 100
  } else if (studentsListStore.scores[index].computer < 0) {
    studentsListStore.scores[index].computer = 0
  }
}
console.log(studentsListStore.scores)
function AddExaminationWithScores() {
  let list = []
  //创建list
  studentsListStore.scores.forEach((score) => {
    if (score != null) {
      list.push({
        studentNum: score.studentNum,
        subjectId: 1,
        score: parseFloat(score.english),
      })
      list.push({
        studentNum: score.studentNum,
        subjectId: 2,
        score: parseFloat(score.math),
      })
      list.push({
        studentNum: score.studentNum,
        subjectId: 3,
        score: parseFloat(score.computer),
      })
      list.push({
        studentNum: score.studentNum,
        subjectId: 4,
        score: parseFloat(score.chinese),
      })
    }
  })
  axios({
    method: "post",
    url: "/examination/addExamWithScores",
    data: {
      examination: {
        examinationName: examinationForm.examinationName,
        examinationDate: examinationForm.examinationDate,
      },
      scores: list,
    },
  })
    .then((res) => {
      let data = res.data
      if (data.code == 1) {
        examinationsListStore.refresh(axios, 1)
        ElNotification({
          title: "成功",
          type: "success",
          message: data.message,
        })
        studentsListStore.refresh(axios) //重置表单
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
<style></style>
