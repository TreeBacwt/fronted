<template>
  <div>
    <el-table
      stripe
      style="width: 100%"
      table-layout="fixed"
      :data="examinationsListStore.scores"
    >
      <el-table-column label="姓名" prop="studentName" />
      <el-table-column
        v-for="(item, index) in subjectsListStore.subjectsList"
        :key="index"
        :label="item.subjectName"
        :prop="item.id.toString()"
      >
        <template #default="scope">
          <div v-if="!scope.row.isEdit">
            {{ handleScoreText(scope.row.scores[scope.column.property]) }}
          </div>
          <div v-else>
            <el-input
              placeholder="请输入分数"
              type="number"
              step="0.5"
              max="100"
              min="0"
              v-model="updateScoreReactive[scope.column.property]"
              @input="handleLimitInputScore(scope)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="总分">
        <template #default="scope">
          {{ handleTotalText(scope) }}
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
          <el-button
            v-else
            type="primary"
            @click="handleSubmitButton(scope.row.studentNum)"
            >提交</el-button
          >
          <el-button v-if="scope.row.isEdit" @click="handleCancelButton(scope)"
            >取消</el-button
          >
          <el-button @click="handleShowEcharts">图表 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="成绩可视化图"
      align-center
      v-model="dialogShow"
      @opened="handleDialogOpen"
      :fullscreen="true"
    >
      <div id="personEchart" style="width: 800px; height: 800px"></div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, reactive, computed, onMounted, getCurrentInstance } from "vue"
import { useExaminationsListStore } from "@/stores/examinationsList"
import { useSubjectsListStore } from "@/stores/subjectsList"
import * as echarts from "echarts"

const axios = inject("axios")
const props = defineProps(["examinationId"])
const examinationsListStore = useExaminationsListStore()

const subjectsListStore = useSubjectsListStore()

onMounted(() => {
  subjectsListStore.refresh(axios)
})

function handleScoreText(score) {
  return score != -1 ? score : "暂无数据"
}
function handleTotalText(scope) {
  let total = 0
  if (scope.row.isEdit == 0) {
    subjectsListStore.subjectsList.forEach((subject) => {
      total +=
        scope.row.scores[subject.id.toString()] != -1
          ? scope.row.scores[subject.id.toString()]
          : 0
    })
  } else {
    for (let prop in updateScoreReactive) {
      total += parseFloat(updateScoreReactive[prop])
    }
  }

  return total
}

const updateScoreReactive = reactive(subjectsListStore.updateScore)
function handleLimitInputScore(scope) {
  if (updateScoreReactive[scope.column.property] > 100)
    updateScoreReactive[scope.column.property] = 100
  else if (updateScoreReactive[scope.column.property] < 0)
    updateScoreReactive[scope.column.property] = 0
}
function handleEditButton(scope) {
  scope.row.isEdit = 1
  for (let prop in updateScoreReactive) {
    //编辑时显示原有数据
    updateScoreReactive[prop] = scope.row.scores[prop] != -1 ? scope.row.scores[prop] : 0
  }
}
function handleCancelButton(scope) {
  scope.row.isEdit = 0
  for (let prop in updateScoreReactive) {
    updateScoreReactive[prop] = 0
  }
  ElMessage.info("已取消")
}
function handleSubmitButton(studentNum) {
  let scores = []
  for (let prop in updateScoreReactive) {
    console.log(prop)
    scores.push({
      subjectId: parseInt(prop),
      examinationId: props.examinationId,
      studentNum,
      score: parseFloat(updateScoreReactive[prop]),
    })
  }
  console.log(scores)
  axios({
    method: "put",
    url: "/score/updMulti",
    data: scores,
  })
    .then((res) => {
      let data = res.data
      if (data.code == 1) {
        examinationsListStore.getScoresOfExamination(axios, props.examinationId)
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
/*学生个人成绩可视化 */
const dialogShow = ref(false)
const context = getCurrentInstance().appContext.config.globalProperties
let personEchartDom
function handleShowEcharts() {
  dialogShow.value = true
}
function handleDialogOpen() {
  personEchartDom = document.getElementById("personEchart")
  let personEchart = echarts.init(personEchartDom)
  let option
  option = {
    legend: {
      top: "bottom",
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: "Nightingale Chart",
        type: "pie",
        radius: [50, 250],
        center: ["50%", "50%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 8,
        },
        data: [
          { value: 40, name: "rose 1" },
          { value: 38, name: "rose 2" },
          { value: 32, name: "rose 3" },
          { value: 30, name: "rose 4" },
          { value: 28, name: "rose 5" },
          { value: 26, name: "rose 6" },
          { value: 22, name: "rose 7" },
          { value: 18, name: "rose 8" },
        ],
      },
    ],
  }
  option && personEchart.setOption(option)
}
</script>
<style scoped>
.button {
  position: relative;
  left: 30px;
}
</style>
