<template>
  <div>
    <el-descriptions direction="vertical" :column="1">
      <template #extra>
        <el-button
          type="danger"
          class="delete-button"
          @click="handleDeleteQuestionnaireButton"
          >删除
        </el-button>
      </template>
      <!-- 问卷信息 -->
      <el-descriptions-item>
        <template #label>
          <el-tag class="tag">简介</el-tag>
          <span class="text">{{ showQuestionnaire.questionnaire.information }}</span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <el-tag class="tag">已完成份数</el-tag>
          <span class="text">{{ showQuestionnaire.questionnaire.respondent }}份</span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
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
            <el-button class="graph-button" @click="handleGraphButton"
              >回答情况
            </el-button>
          </template>
          <!-- 选项 -->
          <el-descriptions-item>
            <!-- 老师角色 -->
            <el-radio-group v-if="userStore.user.role == 1">
              <el-radio v-for="(option, index) in question.options" :key="index" disabled>
                {{ option.content }}
              </el-radio>
            </el-radio-group>
          </el-descriptions-item>
        </el-descriptions>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, onUpdated, inject } from "vue"
import { useUserStore } from "@/stores/user"

const userStore = useUserStore()
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
      } else {
        ElMessage.error(data.message)
      }
    })
    .catch((res) => {
      ElMessage.error("出错了！")
    })
})

function handleDeleteQuestionnaireButton() {
  ElMessage.info("功能尚未完成")
}

function handleGraphButton() {
  ElMessage.info("功能尚未完成")
}
</script>
<style scoped>
.delete-button {
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
