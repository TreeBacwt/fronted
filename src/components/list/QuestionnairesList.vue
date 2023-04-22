<template>
  <div>
    <el-collapse accordion v-model="activeName">
      <!-- 教师端 -->
      <el-collapse-item
        v-if="userStore.user.role == 1"
        v-for="(questionnaire, index) in questionnaireStore.questionnairesList"
        :key="index"
        :name="questionnaire.id"
      >
        <template #title>
          <span class="text">{{ questionnaire.questionnaireName }}</span>
          <span class="start-date">
            开始时间
            <el-tag class="date-tag">
              {{ questionnaire.questionnaireDate.slice(0, 10) }}
            </el-tag>
          </span>
          <span class="over-date">
            结束时间
            <el-tag class="date-tag" type="info">
              {{ questionnaire.overDate.slice(0, 10) }}
            </el-tag>
          </span>
        </template>

        <QuestionnaireForm :id="questionnaire.id" />
      </el-collapse-item>

      <!-- 家长端 -->
      <el-collapse-item
        v-else-if="userStore.user.role == 3"
        v-for="(questionnaire, index) in questionnaireStore.unDoneQuestionnairesList"
        :key="questionnaire.id"
        :name="questionnaire.id"
      >
        <template #title>
          <span class="text">{{ questionnaire.questionnaireName }}</span>
          <span class="start-date">
            开始时间
            <el-tag class="date-tag">
              {{ questionnaire.questionnaireDate.slice(0, 10) }}
            </el-tag>
          </span>
          <span class="over-date">
            结束时间
            <el-tag class="date-tag" type="info">
              {{ questionnaire.overDate.slice(0, 10) }}
            </el-tag>
          </span>
        </template>

        <QuestionnaireForm :id="questionnaire.id" />
      </el-collapse-item>
    </el-collapse>
    <div class="paginationContainer" v-if="userStore.user.role == 1">
      <el-pagination
        layout="prev, pager, next"
        class="pagination"
        v-model:current-page="questionnaireStore.currentPage"
        :total="questionnaireStore.total"
        @current-change="handleCurrentChange"
      />
    </div>
    <div v-if="userStore.user.role == 3 && questionnaireStore.unDoneIsEmpty">
      <el-empty description="暂无未完成问卷" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, inject, onMounted } from "vue"
import { useQuestionnaireStore } from "@/stores/questionnaire"
import { useUserStore } from "@/stores/user"
import { useParentStore } from "@/stores/parent"
import QuestionnaireForm from "@/components/form/QuestionnaireForm.vue"

const axios = inject("axios")
const questionnaireStore = useQuestionnaireStore()
const userStore = useUserStore()
const parentStore = useParentStore()
onMounted(() => {
  if (userStore.user.role == 1) {
    questionnaireStore.refreshQuestionnairesList(axios, questionnaireStore.currentPage)
    questionnaireStore.getTotal(axios)
  } else if (userStore.user.role == 3) {
    questionnaireStore.refreshUnDoneQuestionnairesList(axios, parentStore.parent.id)
  }
})

function handleCurrentChange() {
  questionnaireStore.refreshQuestionnairesList(axios, questionnaireStore.currentPage)
}
const activeName = ref("")
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
.paginationContainer {
  display: flex;
  flex-direction: column;
}
.pagination {
  align-self: center;
}
</style>
