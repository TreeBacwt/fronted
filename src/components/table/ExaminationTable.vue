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
        {{ handleScoreText(scope.row.scores[scope.column.property]) }}
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
</script>
<style scoped>
.button {
  position: relative;
  left: 30px;
}
</style>
