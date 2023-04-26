<template>
  <div>
    <el-descriptions direction="vertical" :column="1">
      <template #extra>
        <!-- 教师端 -->
        <el-button
          type="danger"
          class="extra-button"
          @click="handleDeleteVoteButton"
          v-if="userStore.user.role == 1"
          >删除
        </el-button>
        <!-- 学生端 -->
        <div v-else>
          <el-button
            type="success"
            class="extra-button"
            @click="handleVoteButton"
            :disabled="isVoted"
            >投票</el-button
          >
          <el-button
            type="danger"
            class="extra-button"
            @click="handleDeleteVoteButton"
            v-if="studentStore.student.isLeader == 1"
            >删除
          </el-button>
        </div>
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
        <div v-if="userStore.user.role == 1" class="vote-percentage">
          <el-progress
            v-for="(value, index) in voteSituation"
            :percentage="value"
            :stroke-width="20"
            class="vote-percentage-item"
          >
            {{ index }} : {{ value }}%
          </el-progress>
        </div>

        <!-- 学生端 -->
        <div v-else>
          <el-checkbox-group
            v-if="!isVoted && showVote.vote.isOver == 1"
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
          <div v-else class="vote-percentage">
            <el-progress
              v-for="(value, index) in voteSituation"
              :percentage="value"
              :stroke-width="20"
              class="vote-percentage-item"
            >
              {{ index }} : {{ value }}%
            </el-progress>
          </div>
        </div>
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
            </div>

            <div v-else class="comment-table-container">
              <el-table
                :data="voteStore.commentsList"
                max-height="250"
                :default-sort="{ prop: 'voteComment.commentDate', order: 'descending' }"
              >
                <el-table-column prop="studentName" label="姓名" />
                <el-table-column prop="voteComment.comment" label="评论内容" />
                <el-table-column prop="voteComment.commentDate" label="评论日期" sortable>
                  <template #default="scope">
                    <el-tag class="comment-date-tag">
                      {{
                        scope.row.voteComment.commentDate.slice(0, 10) +
                        " " +
                        scope.row.voteComment.commentDate.slice(11, 16)
                      }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="userStore.user.role == 1 || studentStore.student.isLeader == 1"
                  label="管理"
                >
                  <template #default="scope">
                    <el-button
                      type="danger"
                      :icon="Delete"
                      plain
                      @click="handleDeleteCommentButton(scope.row.voteComment.id)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

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
          </el-descriptions-item>
        </el-descriptions>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, inject, onMounted, onBeforeMount } from "vue"
import { useUserStore } from "@/stores/user"
import { useVoteStore } from "@/stores/vote"
import { useStudentStore } from "@/stores/student"

import { Delete } from "@element-plus/icons-vue"

const axios = inject("axios")
const props = defineProps(["id"])
const userStore = useUserStore()
const voteStore = useVoteStore()
const studentStore = useStudentStore()

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
onMounted(() => {})

onBeforeMount(() => {
  refreshVote()
  isStudentVoted()
  getPercentage()
  voteStore.refreshCommentsList(axios, props.id)
})

function refreshVote() {
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
}

/*投票情况 */
const voteSituation = ref({})
function getPercentage() {
  axios({
    method: "get",
    url: "/vote/queryOptionsPercentageByVoteId/" + props.id,
  })
    .then((res) => {
      let data = res.data
      if (data.code == 1) {
        voteSituation.value = data.data
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

/*删除投票功能 */
function handleDeleteVoteButton() {
  ElMessageBox.confirm("确认删除投票吗？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(() => {
      axios({
        method: "delete",
        url: "/vote/delete",
        params: {
          id: props.id,
        },
      })
        .then((res) => {
          let data = res.data

          if (data.code == 1) {
            ElNotification({
              title: "成功",
              type: "success",
              message: data.message,
            })
            voteStore.refreshVotesList(axios)
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
    })
    .catch(() => {})
}

/*学生投票功能 */
const checkedOptions = ref([])

function handleVoteButton() {
  if (checkedOptions.value.length == 0) {
    ElNotification({
      title: "警告",
      type: "warning",
      message: "至少选择一项！",
    })
  } else {
    let data = []
    checkedOptions.value.forEach((option) => {
      data.push({
        studentNum: studentStore.student.studentNum,
        voteOptionId: option,
      })
    })

    axios({
      method: "post",
      url: "/vote/addMultiStudentVotes",
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
          refreshVote()
          isVoted.value = true
          getPercentage()
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
    console.log(data)
  }
}

//是否已经投过票
const isVoted = ref(false)
function isStudentVoted() {
  if (userStore.user.role == 2) {
    axios({
      method: "get",
      url:
        "/vote/queryIsStudentVoted/" + studentStore.student.studentNum + "/" + props.id,
    }).then((res) => {
      let data = res.data
      if (data.data == 1) {
        isVoted.value = true
      } else isVoted.value = false
    })
  }
}
/*评论功能 */
const commentInput = ref("")

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

function handleCommentButton() {
  let data = {
    studentNum: studentStore.student.studentNum,
    voteId: props.id,
    comment: commentInput.value,
    commentDate: new Date().format("yyyy-MM-dd hh:mm"),
  }
  axios({
    method: "post",
    url: "/vote/addComment",
    params: data,
  })
    .then((res) => {
      let data = res.data
      if (data.code == 1) {
        ElNotification({
          title: "成功",
          type: "success",
          message: data.message,
        })
        commentInput.value = ""
        //刷新评论列表
        voteStore.refreshCommentsList(axios, props.id)
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

function handleDeleteCommentButton(id) {
  ElMessageBox.confirm("确认删除评论吗？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(() => {
      axios({
        method: "delete",
        url: "/vote/deleteComment",
        params: {
          id,
        },
      })
        .then((res) => {
          let data = res.data
          if (data.code == 1) {
            ElNotification({
              title: "成功",
              type: "success",
              message: data.message,
            })
            voteStore.refreshCommentsList(axios, props.id)
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
    })
    .catch(() => {})
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
.vote-percentage {
  position: relative;
  left: 15px;
  width: 350px;
  margin-top: 5px;
}
.vote-percentage-item {
  margin-bottom: 15px;
}
.comment-table-container {
  width: 100%;
  position: relative;
  left: 15px;
  margin-bottom: 50px;
}
.comment-date-tag {
  width: 130px;
}
</style>
