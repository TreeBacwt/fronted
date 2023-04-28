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

const axios = inject("axios")
const props = defineProps(["examinationId"])
const examinationsListStore = useExaminationsListStore()

const subjectsListStore = useSubjectsListStore()

const userStore = useUserStore()
const studentStore = useStudentStore()

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
