<template>
  <el-table
    stripe
    style="width: 100%"
    table-layout="fixed"
    :data="examinationsListStore.scores"
  >
    <el-table-column label="姓名" prop="studentName" />
    <el-table-column label="英语" prop="english">
      <template #default="scope">
        <div v-if="!scope.row.isEdit">
          {{ scope.row.english != -1 ? scope.row.english : "暂无数据" }}
        </div>
        <div v-else>
          <el-input
            placeholder="请输入分数"
            v-model="updateScores.english"
            type="number"
            step="0.5"
            max="100"
            min="0"
            @input="limitInputScore"
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="数学" prop="math">
      <template #default="scope">
        <div v-if="!scope.row.isEdit">
          {{ scope.row.math != -1 ? scope.row.math : "暂无数据" }}
        </div>
        <div v-else>
          <el-input
            placeholder="请输入分数"
            v-model="updateScores.math"
            type="number"
            step="0.5"
            max="100"
            min="0"
            @input="limitInputScore"
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="语文" prop="chinese">
      <template #default="scope">
        <div v-if="!scope.row.isEdit">
          {{ scope.row.chinese != -1 ? scope.row.chinese : "暂无数据" }}
        </div>
        <div v-else>
          <el-input
            placeholder="请输入分数"
            v-model="updateScores.chinese"
            type="number"
            step="0.5"
            max="100"
            min="0"
            @input="limitInputScore"
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="计算机科学与技术" prop="computer">
      <template #default="scope">
        <div v-if="!scope.row.isEdit">
          {{ scope.row.computer != -1 ? scope.row.computer : "暂无数据" }}
        </div>
        <div v-else>
          <el-input
            placeholder="请输入分数"
            v-model="updateScores.computer"
            type="number"
            step="0.5"
            max="100"
            min="0"
            @input="limitInputScore"
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="总分">
      <template #default="scope">
        <div v-if="!scope.row.isEdit">
          {{
            calculateTotal(
              scope.row.english,
              scope.row.math,
              scope.row.chinese,
              scope.row.computer
            )
          }}
        </div>
        <div v-else>
          {{
            parseFloat(updateScores.english) +
            parseFloat(updateScores.math) +
            parseFloat(updateScores.chinese) +
            parseFloat(updateScores.computer)
          }}
        </div>
      </template>
    </el-table-column>
    <el-table-column>
      <template #default="scope">
        <el-button
          type="primary"
          @click="handleEditButton(scope)"
          v-if="!scope.row.isEdit"
          >编辑</el-button
        >
        <el-button v-else type="primary" @click="handleSubmitButton(scope.row.studentNum)"
          >提交</el-button
        >
        <el-button v-if="scope.row.isEdit" @click="handleCancelButton(scope)"
          >取消</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { inject, ref, reactive, computed } from "vue"
import { useExaminationsListStore } from "@/stores/examinationsList"

const axios = inject("axios")
const props = defineProps(["examinationId"])
const examinationsListStore = useExaminationsListStore()

function calculateTotal(english, math, chinese, computer) {
  if (english == -1 || math == -1 || chinese == -1 || computer == -1) {
    return "分数缺失"
  } else {
    return english + math + chinese + computer
  }
}

const updateScores = reactive({
  english: 0,
  math: 0,
  chinese: 0,
  computer: 0,
})

function handleEditButton(scope) {
  scope.row.isEdit = 1
}
let i = 1
function handleCancelButton(scope) {
  scope.row.isEdit = 0
  updateScores.english = 0
  updateScores.math = 0
  updateScores.chinese = 0
  updateScores.computer = 0
  ElMessage.info("编辑已取消")
}
function handleSubmitButton(studentNum) {
  let data = []
  data.push({
    subjectId: 1,
    studentNum,
    examinationId: props.examinationId,
    score: updateScores.english,
  })
  data.push({
    subjectId: 2,
    studentNum,
    examinationId: props.examinationId,
    score: updateScores.math,
  })
  data.push({
    subjectId: 3,
    studentNum,
    examinationId: props.examinationId,
    score: updateScores.computer,
  })
  data.push({
    subjectId: 4,
    studentNum,
    examinationId: props.examinationId,
    score: updateScores.chinese,
  })
  axios({
    method: "put",
    url: "/score/updMulti",
    data,
  })
    .then((res) => {
      examinationsListStore.getScoresOfExamination(axios, props.examinationId)
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
      ElNotification({
        title: "错误",
        type: "error",
        message: "出错了！",
      })
    })
}
function limitInputScore() {
  if (updateScores.english > 100) {
    updateScores.english = 100
  } else if (updateScores.english < 0) {
    updateScores.english = 0
  }

  if (updateScores.math > 100) {
    updateScores.math = 100
  } else if (updateScores.math < 0) {
    updateScores.math = 0
  }

  if (updateScores.chinese > 100) {
    updateScores.chinese = 100
  } else if (updateScores.chinese < 0) {
    updateScores.chinese = 0
  }

  if (updateScores.computer > 100) {
    updateScores.computer = 100
  } else if (updateScores.computer < 0) {
    updateScores.computer = 0
  }
}
</script>
<style scoped>
.button {
  position: relative;
  left: 30px;
}
</style>
