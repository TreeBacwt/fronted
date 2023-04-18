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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, computed, onMounted } from "vue"
import { useExaminationsListStore } from "@/stores/examinationsList"
import ExaminationTable from "@/components/table/ExaminationTable.vue"
import AddExaminationForm from "@/components/form/AddExaminationForm.vue"

const axios = inject("axios")
const examinationsListStore = useExaminationsListStore()
const examinationsList = computed(() => examinationsListStore.examinationsList)
examinationsListStore.refresh(axios, examinationsListStore.currentPage)

onMounted(() => {
  examinationsListStore.getTotal(axios)
})

function handleCurrentChange() {
  examinationsListStore.refresh(axios, examinationsListStore.currentPage)
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
</style>
