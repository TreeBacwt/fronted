<template>
  <div>
    <el-descriptions direction="vertical" :column="1">
      <!-- 教师端 -->
      <template #extra v-if="userStore.user.role == 1">
        <el-button
          type="danger"
          class="extra-button"
          @click="handleDeleteQuestionnaireButton"
          >删除
        </el-button>
      </template>
      <!-- 家长端 -->
      <template #extra v-else-if="userStore.user.role == 3">
        <el-button type="primary" class="extra-button" @click="handleSubmitButton">
          提交
        </el-button>
      </template>
      <!-- 问卷信息 -->
      <el-descriptions-item>
        <template #label>
          <el-tag class="tag">简介</el-tag>
          <span class="text">{{ showQuestionnaire.questionnaire.information }}</span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item v-if="userStore.user.role == 1">
        <template #label>
          <el-tag class="tag">已完成份数</el-tag>
          <span class="text">{{ showQuestionnaire.questionnaire.respondent }}份</span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item v-if="userStore.user.role == 1">
        <template #label>
          <!--是否已经结束-->
          <el-tag class="tag">状态</el-tag>
          <span class="text">
            {{ showQuestionnaire.questionnaire.isOver == 1 ? "已结束" : "调查中" }}
          </span>
        </template>
      </el-descriptions-item>

      <!-- 题目 -->
      <el-descriptions-item
        v-for="(question, index) in showQuestionnaire.questions"
        :key="index"
      >
        <el-descriptions
          :title="question.question.description"
          direction="vertical"
          :column="1"
          class="description"
        >
          <template #extra v-if="userStore.user.role == 1">
            <el-button class="graph-button" @click="handleGraphButton(question.question)"
              >回答情况
            </el-button>
          </template>
          <!-- 选项 -->
          <el-descriptions-item>
            <!-- 教师端 -->
            <el-radio-group v-if="userStore.user.role == 1">
              <el-radio v-for="(option, index) in question.options" :key="index" disabled>
                {{ option.content }}
              </el-radio>
            </el-radio-group>

            <!-- 家长端 -->
            <el-radio-group
              v-else-if="userStore.user.role == 3"
              v-model="answers[index].questionOptionId"
            >
              <el-radio
                v-for="(option, index) in question.options"
                :key="index"
                :label="option.id"
              >
                {{ option.content }}
              </el-radio>
            </el-radio-group>
          </el-descriptions-item>
        </el-descriptions>
      </el-descriptions-item>
    </el-descriptions>

    <!-- 回答情况对话框 -->
    <el-dialog
      v-model="showSituationDialog"
      :title="questionAnswersSituation.question.description + '回答情况'"
      width="30%"
    >
      <p v-for="(value, key) in questionAnswersSituation.answers">
        "{{ key }}" 选择者 : {{ value.length != 0 ? value.toString() : "无" }}
      </p>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, onUpdated, inject } from "vue"
import { useUserStore } from "@/stores/user"
import { useParentStore } from "@/stores/parent"
import { useQuestionnaireStore } from "@/stores/questionnaire"

const userStore = useUserStore()
const parentStore = useParentStore()
const questionnaireStore = useQuestionnaireStore()
const axios = inject("axios")
const props = defineProps(["id"])
const showQuestionnaire = ref({
  questionnaire: {
    id: "",
    questionnaireName: "",
    questionnaireDate: "",
    information: "",
    respondent: "",
    isOver: "",
    overDate: "",
  },
  questions: [],
})

const answers = ref([])
/*初始化questionnaire */
onMounted(() => {
  axios({
    method: "get",
    url: "/questionnaire/getQuestionnaireWithQuestionsAndOptionsById/" + props.id,
  })
    .then((res) => {
      let data = res.data
      if (data.code == 1) {
        showQuestionnaire.value = data.data
        //初始化answers数组
        showQuestionnaire.value.questions.forEach((questionWithOpt) => {
          let answer = {
            questionId: questionWithOpt.question.id,
            parentId: parentStore.parent.id,
            questionOptionId: "",
          }
          answers.value.push(answer)
        })
      } else {
        ElMessage.error(data.message)
      }
    })
    .catch((res) => {
      ElMessage.error("出错了！")
    })
})
/*教师端功能 */
function handleDeleteQuestionnaireButton() {
  ElMessage.info("功能尚未完成")
}

/*展示题目回答情况 */
const questionAnswersSituation = ref({
  question: {},
  answers: {},
})
const showSituationDialog = ref(false)
function handleGraphButton(question) {
  axios({
    method: "get",
    url: "/answer/getAnswersSituationsByQuestionId/" + question.id,
  })
    .then((res) => {
      let data = res.data
      if (data.code == 1) {
        console.log(data.data)
        questionAnswersSituation.value.question = question
        questionAnswersSituation.value.answers = data.data
        showSituationDialog.value = true
        console.log(questionAnswersSituation.value)
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
}

/*家长端功能 */
function handleSubmitButton() {
  ElMessageBox.confirm("确认提交问卷吗？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(() => {
      axios({
        method: "post",
        url: "/answer/submit",
        data: answers.value,
      })
        .then((res) => {
          let data = res.data
          if (data.code == 1) {
            ElNotification({
              title: "成功",
              type: "success",
              message: data.message,
            })
            //刷新未完成问卷列表
            questionnaireStore.refreshUnDoneQuestionnairesList(
              axios,
              parentStore.parent.id
            )
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
      // console.log(answers.value)
    })
    .catch(() => {})
}
</script>
<style scoped>
.extra-button {
  position: relative;
  right: 15px;
}
.tag {
  position: relative;
  left: 15px;
}
.text {
  position: relative;
  left: 25px;
}
.description {
  position: relative;
  left: 15px;
}
.graph-button {
  position: relative;
  right: 30px;
}
</style>
