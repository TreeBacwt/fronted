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
        {{ scope.row.english != -1 ? scope.row.english : "暂无数据" }}
      </template>
    </el-table-column>
    <el-table-column label="数学" prop="math">
      <template #default="scope">
        {{ scope.row.math != -1 ? scope.row.math : "暂无数据" }}
      </template>
    </el-table-column>
    <el-table-column label="语文" prop="chinese">
      <template #default="scope">
        {{ scope.row.chinese != -1 ? scope.row.chinese : "暂无数据" }}
      </template>
    </el-table-column>
    <el-table-column label="计算机科学与技术" prop="computer">
      <template #default="scope">
        {{ scope.row.computer != -1 ? scope.row.computer : "暂无数据" }}
      </template>
    </el-table-column>
    <el-table-column label="总分">
      <template #default="scope">
        {{
          calculateTotal(
            scope.row.english,
            scope.row.math,
            scope.row.chinese,
            scope.row.computer
          )
        }}
      </template>
    </el-table-column>
    <el-table-column>
      <template #default="scope">
        <el-button type="primary">编辑</el-button>
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
</script>
<style scoped>
.button {
  position: relative;
  left: 30px;
}
</style>
