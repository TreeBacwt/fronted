<template>
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
import { useSubjectsListStore } from "@/stores/subjectsList"

const axios = inject("axios")
const props = defineProps(["examinationId"])
const examinationsListStore = useExaminationsListStore()

const subjectsListStore = useSubjectsListStore()
subjectsListStore.refresh(axios)

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
}
function handleSubmitButton(studentNum) {
  console.log(updateScoreReactive)
}
</script>
<style scoped>
.button {
  position: relative;
  left: 30px;
}
</style>
