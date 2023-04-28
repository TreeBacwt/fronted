<template>
  <div>
    <el-collapse
      accordion
      @change="
        examinationsListStore.getScoresOfExamination(
          axios,
          examinationsListStore.activeItemName
        )
      "
      v-model="examinationsListStore.activeItemName"
    >
      <el-collapse-item name="edit">
        <template #title>
          <el-tag class="date-tag" type="success">添加考试信息</el-tag>
        </template>
        <div>
          <AddExaminationForm />
        </div>
      </el-collapse-item>

      <el-collapse-item
        :name="item.id"
        v-for="(item, index) in examinationsList"
        :key="item.id"
      >
        <template #title>
          <span class="text">{{ item.examinationName }}</span>
          <el-tag class="date-tag">{{ item.examinationDate.slice(0, 10) }}</el-tag>
          <el-button
            class="echart-button"
            @click.stop="handleDialogShow(item.id)"
            v-if="userStore.user.role == 1"
            >成绩概览</el-button
          >
        </template>
        <ExaminationTable :examinationId="item.id" />
      </el-collapse-item>
    </el-collapse>

    <div class="paginationContainer">
      <el-pagination
        layout="prev, pager, next"
        :total="examinationsListStore.total"
        class="pagination"
        v-model:current-page="examinationsListStore.currentPage"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      title="班级成绩分布图"
      align-center
      v-model="dialogShow"
      :fullscreen="true"
      @opened="handleDialogOpen"
      @close="handleDialogClose"
    >
      <div class="class-echart-container">
        <div id="classEchart" class="class-echart"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, computed, onMounted } from "vue"
import { useExaminationsListStore } from "@/stores/examinationsList"
import { useSubjectsListStore } from "@/stores/subjectsList"
import ExaminationTable from "@/components/table/ExaminationTable.vue"
import AddExaminationForm from "@/components/form/AddExaminationForm.vue"
import * as echarts from "echarts"
import { useUserStore } from "@/stores/user"

const axios = inject("axios")
const examinationsListStore = useExaminationsListStore()
const examinationsList = computed(() => examinationsListStore.examinationsList)
examinationsListStore.refresh(axios, examinationsListStore.currentPage)
const subjectsListStore = useSubjectsListStore()
const userStore = useUserStore()

onMounted(() => {
  examinationsListStore.getTotal(axios)
  subjectsListStore.refresh(axios)
})

function handleCurrentChange() {
  examinationsListStore.refresh(axios, examinationsListStore.currentPage)
}
/*班级成绩可视化 */
const dialogShow = ref(false)
let chartDom = null
let classEchart = null
let option = {
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      saveAsImage: { show: true },
    },
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  yAxis: {
    type: "value",
  },
  xAxis: {
    type: "category",
    data: [],
  },
  series: [],
}
function handleDialogShow(eid) {
  dialogShow.value = true
  //调入数据
  axios({
    method: "get",
    url: "/score/getScoresOfExam/" + eid,
  }).then((res) => {
    let data = res.data
    if (data.code == 1) {
      let xData = []
      let seriesData = []
      let list = data.data
      list.forEach((element) => {
        xData.push(element.studentName) //x轴列表
      })
      option.xAxis.data = xData
      //数据格式化
      subjectsListStore.subjectsList.forEach((subject) => {
        let seriesItem = {
          name: subject.subjectName,
          type: "bar",
          stack: "total",
          label: {
            show: true,
          },
          emphasis: {
            focus: "series",
          },
          data: [],
        }
        list.forEach((element) => {
          seriesItem.data.push(
            element.scores[subject.id.toString()] != -1
              ? element.scores[subject.id.toString()]
              : 0
          )
        })
        seriesData.push(seriesItem)
      })
      option.series = seriesData
    }
  })
}
function handleDialogOpen() {
  //图表初始化
  if (chartDom == null) {
    chartDom = document.getElementById("classEchart")
  }
  if (classEchart == null) {
    classEchart = echarts.init(chartDom)
  }
  option && classEchart.setOption(option)
}
function handleDialogClose() {
  classEchart.clear()
}
</script>
<style scoped>
.text {
  position: relative;
  left: 15px;
}
.paginationContainer {
  display: flex;
  flex-direction: column;
}
.pagination {
  align-self: center;
}
.description {
  position: relative;
  left: 15px;
}
.edit-button {
  position: relative;
  right: 30px;
}
.date-tag {
  position: relative;
  left: 20px;
}
.echart-button {
  position: relative;
  left: 30px;
}
.class-echart-container {
  display: flex;
  justify-content: center;
}
.class-echart {
  width: 800px;
  height: 800px;
}
</style>
