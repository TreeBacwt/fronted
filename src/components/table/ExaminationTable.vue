<template>
  <div>
    <el-table
      stripe
      style="width: 100%"
      table-layout="fixed"
      :data="userStore.user.role == 1 ? examinationsListStore.scores : personalScore"
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
            <el-button text bg @click="handleScoreButton(scope)">
              {{ handleScoreText(scope.row.scores[scope.column.property]) }}</el-button
            >
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
            v-if="!scope.row.isEdit && userStore.user.role == 1"
            >编辑</el-button
          >
          <el-button
            v-else
            type="primary"
            @click="handleSubmitButton(scope.row.studentNum)"
            v-if="userStore.user.role == 1"
            >提交</el-button
          >
          <el-button v-if="scope.row.isEdit" @click="handleCancelButton(scope)"
            >取消</el-button
          >
          <el-button @click="handleShowEcharts(scope)">成绩分布</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="个人成绩分布图"
      align-center
      v-model="dialogShow"
      @opened="handleDialogOpen"
      @close="handleDialogClose"
      :fullscreen="true"
      :destroy-on-close="true"
    >
      <div class="person-echart-container">
        <div id="personEchart" class="person-echart"></div>
      </div>
    </el-dialog>
    <el-dialog
      title="单科纵向对比图"
      align-center
      v-model="scoreDialog"
      @opened="handleScoreDialogOpen"
      @close="handleScoreDialogClose"
      :fullscreen="true"
      :destroy-on-close="true"
    >
      <div class="person-echart-container">
        <div id="scoreEchart" class="person-echart"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  inject,
  ref,
  reactive,
  computed,
  onMounted,
  getCurrentInstance,
  onBeforeMount,
} from "vue"
import { useExaminationsListStore } from "@/stores/examinationsList"
import { useSubjectsListStore } from "@/stores/subjectsList"
import * as echarts from "echarts"
import { useUserStore } from "@/stores/user"
import { useStudentStore } from "@/stores/student"
import { useParentStore } from "@/stores/parent"

const axios = inject("axios")
const props = defineProps(["examinationId"])
const examinationsListStore = useExaminationsListStore()

const subjectsListStore = useSubjectsListStore()

const userStore = useUserStore()
const studentStore = useStudentStore()
const parentStore = useParentStore()

let personalScore
onMounted(() => {
  subjectsListStore.refresh(axios)
})

if (userStore.user.role == 2) {
  studentStore.refreshStudent(axios, userStore.user.id)
  personalScore = computed(() =>
    examinationsListStore.scores.filter(
      (element) => element.studentNum == studentStore.student.studentNum
    )
  )
} else if (userStore.user.role == 3) {
  parentStore.refresh(axios, userStore.user.id)
  personalScore = computed(() =>
    examinationsListStore.scores.filter(
      (element) => element.studentNum == parentStore.parent.studentNum
    )
  )
}

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
let personEchartDom = null
let personEchart = null

let option = {
  legend: {
    top: "bottom",
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      saveAsImage: { show: true },
    },
  },
  series: [
    {
      label: {
        formatter(score) {
          return score.name + ":" + score.value + "分"
        },
      },
      name: "学生成绩",
      type: "pie",
      radius: [50, 250],
      center: ["50%", "50%"],
      roseType: "area",
      itemStyle: {
        borderRadius: 8,
      },
      data: [],
    },
  ],
}
function handleShowEcharts(scope) {
  dialogShow.value = true
  option.series[0].name = scope.row.studentName
  let scores = []
  for (let key in scope.row.scores) {
    let name = subjectsListStore.subjectsList.filter((data) => data.id == key)[0]
      .subjectName
    let value = scope.row.scores[key] != -1 ? scope.row.scores[key] : 0
    scores.push({
      name,
      value,
    })
  }
  option.series[0].data = scores
}
function handleDialogOpen() {
  //图表初始化
  personEchartDom = document.getElementById("personEchart")
  personEchart = echarts.init(personEchartDom)
  option && personEchart.setOption(option)
}
function handleDialogClose() {
  personEchart.dispose() //dialog关闭时清空echart实例
}
const scoreDialog = ref(false)
let scoreEchartDom = null
let scoreEchart = null

// prettier-ignore
const data = [["2000-06-05", 116], ["2000-06-06", 129], ["2000-06-07", 135], ["2000-06-08", 86], ["2000-06-09", 73], ["2000-06-10", 85], ["2000-06-11", 73], ["2000-06-12", 68], ["2000-06-13", 92], ["2000-06-14", 130], ["2000-06-15", 245], ["2000-06-16", 139], ["2000-06-17", 115], ["2000-06-18", 111], ["2000-06-19", 309], ["2000-06-20", 206], ["2000-06-21", 137], ["2000-06-22", 128], ["2000-06-23", 85], ["2000-06-24", 94], ["2000-06-25", 71], ["2000-06-26", 106], ["2000-06-27", 84], ["2000-06-28", 93], ["2000-06-29", 85], ["2000-06-30", 73], ["2000-07-01", 83], ["2000-07-02", 125], ["2000-07-03", 107], ["2000-07-04", 82], ["2000-07-05", 44], ["2000-07-06", 72], ["2000-07-07", 106], ["2000-07-08", 107], ["2000-07-09", 66], ["2000-07-10", 91], ["2000-07-11", 92], ["2000-07-12", 113], ["2000-07-13", 107], ["2000-07-14", 131], ["2000-07-15", 111], ["2000-07-16", 64], ["2000-07-17", 69], ["2000-07-18", 88], ["2000-07-19", 77], ["2000-07-20", 83], ["2000-07-21", 111], ["2000-07-22", 57], ["2000-07-23", 55], ["2000-07-24", 60]];
const dateList = data.map(function (item) {
  return item[0]
})
const valueList = data.map(function (item) {
  return item[1]
})
let scoreOption = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: "line",
      label: {
        show: true,
        position: "left",
        textStyle: {
          color: "black",
          fontsize: 16,
        },
        formatter: function (params) {
          return params.value
        },
      },
    },
  ],
}
let scoreStudentNum
let scoreSubjectId
function handleScoreButton(scope) {
  scoreDialog.value = true
  axios({
    method: "get",
    url:
      "/examination/getSubjectScores/" +
      scope.row.studentNum +
      "/" +
      scope.column.property,
  }).then((res) => {
    let data = res.data
    if (data.code == 1) {
      let xData = data.data.map(function (item) {
        return item["examinationName"]
      })
      let yData = data.data.map(function (item) {
        return item["score"]
      })
      scoreOption.xAxis.data = xData
      scoreOption.series[0].data = yData
      console.log(xData)
    }
  })
}
function handleScoreDialogOpen() {
  //图表初始化
  scoreEchartDom = document.getElementById("scoreEchart")
  scoreEchart = echarts.init(scoreEchartDom)
  scoreOption && scoreEchart.setOption(scoreOption)
}
function handleScoreDialogClose() {
  scoreEchart.dispose() //dialog关闭时清空echart实例
}
</script>
<style scoped>
.button {
  position: relative;
  left: 30px;
}
.person-echart-container {
  display: flex;
  justify-content: center;
}
.person-echart {
  width: 800px;
  height: 800px;
}
</style>
