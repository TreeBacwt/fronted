<template>
  <div>
    <el-collapse accordion>
      <el-collapse-item
        v-for="(questionnaire, index) in questionnaireStore.questionnairesList"
        :key="index"
      >
        <template #title>
          <span class="text">{{ questionnaire.questionnaireName }}</span>
          <span class="start-date">
            开始时间<el-tag class="date-tag">{{
              questionnaire.questionnaireDate.slice(0, 10)
            }}</el-tag>
          </span>
          <span class="over-date">
            结束时间<el-tag class="date-tag" type="info">{{
              questionnaire.overDate.slice(0, 10)
            }}</el-tag>
          </span>
        </template>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, inject, onMounted } from "vue"
import { useQuestionnaireStore } from "@/stores/questionnaire"

const axios = inject("axios")
const questionnaireStore = useQuestionnaireStore()
onMounted(() => {
  questionnaireStore.refreshQuestionnairesList(axios, questionnaireStore.currentPage)
})
</script>
<style scoped>
.text {
  position: relative;
  left: 15px;
}
.start-date {
  position: relative;
  left: 25px;
}
.over-date {
  position: relative;
  left: 50px;
}
.date-tag {
  position: relative;
  left: 10px;
}
</style>
