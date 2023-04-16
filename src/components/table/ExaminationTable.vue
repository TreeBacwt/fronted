<template>
  <el-table stripe style="width: 100%" table-layout="fixed">
    <el-table-column label="姓名" />
    <el-table-column label="英语" />
    <el-table-column label="数学" />
    <el-table-column label="语文" />
    <el-table-column label="计算机科学与技术" />
    <el-table-column label="总分" />
  </el-table>
</template>

<script lang="ts" setup>
import { inject, ref, reactive, computed } from "vue"
import { useStudentsListStore } from "@/stores/studentsList"

const axios = inject("axios")
const studentsListStore = useStudentsListStore()
studentsListStore.refresh(axios)
</script>
<style scoped>
.button {
  position: relative;
  left: 30px;
}
</style>
