<template>
  <div>
    <el-descriptions direction="vertical" :column="1">
      <template #extra>
        <el-button class="extra-button" @click="handleShowVoteSituationButton"
          >查看投票情况
        </el-button>
        <!-- 教师端 -->
        <el-button
          type="danger"
          class="extra-button"
          @click="handleDeleteVoteButton"
          v-if="userStore.user.role == 1"
          >删除
        </el-button>
      </template>

      <el-descriptions-item>
        <template #label>
          <el-tag class="tag">简介</el-tag>
          <span class="text">{{ showVote.vote.information }}</span>
        </template>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <el-tag class="tag">已参与人数</el-tag>
          <span class="text">{{ showVote.vote.participant }}份</span>
        </template>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <!--是否已经结束-->
          <el-tag class="tag">状态</el-tag>
          <span class="text">
            {{ showVote.vote.isOver == 1 ? "已结束" : "投票中" }}
          </span>
        </template>
      </el-descriptions-item>

      <!-- 选项 -->
      <el-descriptions-item>
        <template #label>
          <el-tag class="tag"> 投票选项</el-tag>
        </template>
        <!-- 教师端 -->
        <el-checkbox-group v-if="userStore.user.role == 1" class="text">
          <el-checkbox v-for="(option, index) in showVote.options" :key="index" disabled>
            {{ option.content }}
          </el-checkbox>
        </el-checkbox-group>

        <!-- 学生端 -->
        <el-checkbox-group
          v-else
          class="text"
          v-model="checkedOptions"
          :max="parseInt(showVote.vote.optionsNumber)"
        >
          <el-checkbox
            v-for="(option, index) in showVote.options"
            :key="index"
            :label="option.id"
          >
            {{ option.content }}
          </el-checkbox>
        </el-checkbox-group>
      </el-descriptions-item>

      <!-- 评论区 -->
      <el-descriptions-item>
        <el-descriptions>
          <template #title>
            <span class="text"><el-tag type="info" size="large">评论区</el-tag></span>
          </template>
          <!-- 评论列表 -->
          <el-descriptions-item>
            <div v-if="voteStore.commentsList.length == 0">
              <el-empty description="暂无评论" />
              <div v-if="userStore.user.role == 2">
                <el-input
                  type="textarea"
                  :rows="3"
                  class="comment-input"
                  v-model="commentInput"
                />
                <el-button
                  class="comment-button"
                  size="large"
                  type="primary"
                  plain
                  @click="handleCommentButton"
                  >发表评论</el-button
                >
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, inject, onMounted } from "vue"
import { useUserStore } from "@/stores/user"
import { useVoteStore } from "@/stores/vote"

const axios = inject("axios")
const props = defineProps(["id"])
const userStore = useUserStore()
const voteStore = useVoteStore()

const showVote = ref({
  vote: {
    id: "",
    voteName: "",
    voteDate: "",
    information: "",
    participant: "",
    isOver: "",
    overDate: "",
    optionsNumber: "",
  },
  options: [],
})

/*初始化Vote、Comment */
onMounted(() => {
  axios({
    method: "get",
    url: "/vote/getVoteWithOptionsByVoteId/" + props.id,
  })
    .then((res) => {
      let data = res.data
      if (data.code == 1) {
        showVote.value = data.data
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
  voteStore.refreshCommentsList(axios, props.id)
})

function handleShowVoteSituationButton() {
  ElMessage.info("功能尚未完成")
}
/*教师端功能 */
function handleDeleteVoteButton() {
  ElMessage.info("功能尚未完成")
}

/*学生投票功能 */
const checkedOptions = ref([])
/*评论功能 */
const commentInput = ref("")

function handleCommentButton() {
  ElMessage.info("功能尚未完成")
}
</script>
<style scoped>
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
.comment-input {
  position: relative;
  width: 50%;
  left: 15px;
}
.comment-button {
  position: relative;
  left: 30px;
}
.extra-button {
  position: relative;
  right: 15px;
}
</style>
