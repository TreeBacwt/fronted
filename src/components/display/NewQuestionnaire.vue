<template>
  <div>
    <el-form class="questionnaire-form">
      <el-form-item label="问卷名称">
        <el-input />
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker
          type="date"
          placeholder="请选择截止时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="success">提交</el-button>
      </el-form-item>
    </el-form>

    <el-collapse accordion>
      <el-collapse-item name="edit">
        <template #title>
          <span class="text"><el-tag type="success">添加题目</el-tag></span>
        </template>
        <el-form :inline="true">
          <el-form-item label="题号">
            {{ questionnaireStore.newQuestions.length + 1 }}
          </el-form-item>
          <el-form-item label="题目描述">
            <el-input type="textarea" rows="1" v-model="newQuestion.description" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleAddQuestionButton">添加</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item
        v-for="(question, index) in questionnaireStore.newQuestions"
        :key="index"
      >
        <template #title>
          <span class="text">
            <el-tag>{{ question.number }}</el-tag>
            {{ question.description }}
            <el-button
              type="danger"
              :icon="Delete"
              @click.stop=""
              class="question-delete-button"
            />
          </span>
        </template>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, inject } from "vue"
import { useQuestionnaireStore } from "@/stores/questionnaire"
import { Delete, Edit } from "@element-plus/icons-vue"

const axios = inject("axios")
const questionnaireStore = useQuestionnaireStore()

const newQuestion = reactive({
  description: "",
})
function handleAddQuestionButton() {
  let question = {
    number: questionnaireStore.newQuestions.length + 1,
    description: newQuestion.description,
    type: 1,
    isEdit: false,
  }
  questionnaireStore.newQuestions.push(question)
  newQuestion.description = ""
}
</script>
<style scoped>
.questionnaire-form {
  padding: 15px;
  background: #ffffff;
}
.text {
  position: relative;
  left: 15px;
}
.question-delete-button {
  position: relative;
  left: 30px;
}
</style>
