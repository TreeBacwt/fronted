<template>
  <div>
    <el-form class="questionnaire-form">
      <el-form-item label="问卷名称">
        <el-input v-model="questionnaireStore.questionnaire.questionnaireName" />
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker
          type="date"
          placeholder="请选择截止时间"
          value-format="YYYY-MM-DD"
          v-model="questionnaireStore.questionnaire.overDate"
          :disabled-date="handleDisabledDate"
        />
      </el-form-item>
      <el-form-item label="简介">
        <el-input
          type="textarea"
          v-model="questionnaireStore.questionnaire.information"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handleAddQuestionnaireButton">提交</el-button>
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
        v-for="(questionWithOptions, index) in questionnaireStore.newQuestions"
        :key="index"
      >
        <template #title>
          <span class="text">
            <el-tag>{{ questionWithOptions.question.number }}</el-tag>
            {{ questionWithOptions.question.description }}
            <el-button
              type="danger"
              :icon="Delete"
              @click.stop="handleDeleteQuestionButton(questionWithOptions)"
              class="question-delete-button"
            />
          </span>
        </template>

        <div>
          <el-descriptions :column="1" class="description">
            <template #title>
              题目：
              <span v-if="!questionWithOptions.isEdit">{{
                questionWithOptions.question.description
              }}</span>
              <el-input v-else v-model="questionWithOptions.question.description" />
            </template>

            <template #extra>
              <div class="question-button">
                <el-button
                  @click="questionWithOptions.isEdit = !questionWithOptions.isEdit"
                >
                  {{ questionWithOptions.isEdit ? "保存" : "编辑题目" }}
                </el-button>
                <el-button @click="handleAddOptionButton(questionWithOptions)"
                  >添加选项</el-button
                >
              </div>
            </template>

            <el-descriptions-item
              v-for="(option, index) in questionWithOptions.options"
              :key="index"
            >
              <p>
                <el-tag>{{ option.number }}</el-tag>
                <el-input
                  v-model="option.content"
                  class="option-input"
                  :disabled="!option.isEdit"
                  placeholder="请输入选项"
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
                  @click="handleDeleteOptionButton(questionWithOptions, option)"
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

/*禁止选择比当天更早的日期 */
function handleDisabledDate(time) {
  return time.getTime() < Date.now()
}

const newQuestion = reactive({
  description: "",
})

function handleAddQuestionButton() {
  let questionWithOptions = {
    question: {
      number: questionnaireStore.newQuestions.length + 1,
      description: newQuestion.description,
      type: 1,
    },
    isEdit: false,
    options: [],
  }
  questionnaireStore.newQuestions.push(questionWithOptions)
  newQuestion.description = ""
}

function handleDeleteQuestionButton(question) {
  questionnaireStore.newQuestions = questionnaireStore.newQuestions.filter(
    (item) => item != question
  )
  //更新题号
  questionnaireStore.newQuestions.forEach((q, index) => {
    q.question.number = index + 1
  })
}

function handleAddOptionButton(question) {
  let option = {
    content: "",
    number: question.options.length + 1,
    isEdit: true,
  }
  question.options.push(option)
}

function handleDeleteOptionButton(question, option) {
  question.options = question.options.filter((item) => item != option)
  question.options.forEach((o, index) => {
    o.number = index + 1
  })
}

function handleAddQuestionnaireButton() {
  ElMessageBox.confirm("确认创建调查问卷吗？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(() => {
      //删除所有isEdit属性
      questionnaireStore.newQuestions.forEach((element) => {
        delete element.isEdit
        element.options.forEach((option) => {
          delete option.isEdit
        })
      })

      let data = {
        questionnaire: questionnaireStore.questionnaire,
        questions: questionnaireStore.newQuestions,
      }
      axios({
        method: "post",
        url: "/questionnaire/add/questionnaireWithQuestionsAndOptions",
        data,
      })
        .then((res) => {
          let data = res.data
          if (data.code == 1) {
            ElNotification({
              title: "成功",
              type: "success",
              message: data.message,
            })
            //清空各项表单
            questionnaireStore.newQuestions = []
            questionnaireStore.resetQuestionnaire()
          } else {
            ElNotification({
              title: "错误",
              type: "error",
              message: data.message,
            })
          }
        })
        .catch((res) => {
          ElNotification({
            title: "错误",
            type: "error",
            message: "出错了！",
          })
        })
      // console.log(JSON.stringify(data))
      // console.log(data)
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "创建已取消",
      })
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
  width: 200px;
}
.option-delete-button {
  position: relative;
  left: 25px;
}
</style>
