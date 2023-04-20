<template>
  <div>
    <el-form class="questionnaire-form">
      <el-form-item label="问卷名称">
        <el-input v-model="questionnaire.questionnaireName" />
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker
          type="date"
          placeholder="请选择截止时间"
          value-format="YYYY-MM-DD"
          v-model="questionnaire.overDate"
          :disabled-date="handleDisabledDate"
        />
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" v-model="questionnaire.information" />
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
              @click.stop="handleDeleteQuestionButton(question)"
              class="question-delete-button"
            />
          </span>
        </template>

        <div>
          <el-descriptions :column="1" class="description">
            <template #title>
              题目：
              <span v-if="!question.isEdit">{{ question.description }}</span>
              <el-input v-else v-model="question.description" />
            </template>

            <template #extra>
              <div class="question-button">
                <el-button @click="question.isEdit = !question.isEdit">
                  {{ question.isEdit ? "保存" : "编辑题目" }}
                </el-button>
                <el-button @click="handleAddOptionButton(question)">添加选项</el-button>
              </div>
            </template>

            <el-descriptions-item
              v-for="(option, index) in question.options"
              :key="index"
            >
              <p>
                <el-tag>{{ option.number }}</el-tag>
                <el-input
                  v-model="option.content"
                  class="option-input"
                  :disabled="!option.isEdit"
                />
                <el-button
                  :icon="Edit"
                  @click="option.isEdit = !option.isEdit"
                  class="option-delete-button"
                  circle
                  text
                />
                <el-button
                  type="danger"
                  :icon="Delete"
                  @click="handleDeleteOptionButton(question, option)"
                  class="option-delete-button"
                  circle
                  text
                />
              </p>
            </el-descriptions-item>
          </el-descriptions>
        </div>
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
/*当天日期格式化 */
Date.prototype.format = function (format) {
  let d = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    )
  }
  for (let k in d) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? d[k] : ("00" + d[k]).substr(("" + d[k]).length)
      )
    }
  }
  return format
}

/*禁止选择比当天更早的日期 */
function handleDisabledDate(time) {
  return time.getTime() < Date.now()
}
const questionnaire = reactive({
  questionnaireName: "",
  questionnaireDate: new Date().format("yyyy-MM-dd"),
  information: "",
  overDate: "",
})

const newQuestion = reactive({
  description: "",
})

function handleAddQuestionButton() {
  let question = {
    number: questionnaireStore.newQuestions.length + 1,
    description: newQuestion.description,
    type: 1,
    isEdit: false,
    options: [],
  }
  questionnaireStore.newQuestions.push(question)
  newQuestion.description = ""
}

function handleDeleteQuestionButton(question) {
  questionnaireStore.newQuestions = questionnaireStore.newQuestions.filter(
    (item) => item != question
  )
  //更新题号
  questionnaireStore.newQuestions.forEach((q, index) => {
    q.number = index + 1
  })
}

function handleAddOptionButton(question) {
  let option = {
    content: "",
    number: question.options.length + 1,
    isEdit: false,
  }
  question.options.push(option)
}

function handleDeleteOptionButton(question, option) {
  question.options = question.options.filter((item) => item != option)
  question.options.forEach((o, index) => {
    o.number = index + 1
  })
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
.description {
  position: relative;
  left: 15px;
}
.question-button {
  position: relative;
  right: 30px;
}
.option-input {
  position: relative;
  left: 15px;
  width: 100px;
}
.option-delete-button {
  position: relative;
  left: 25px;
}
</style>
