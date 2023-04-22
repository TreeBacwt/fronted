<template>
  <div>
    <el-form class="vote-form">
      <el-form-item label="投票名称">
        <el-input v-model="voteStore.newVote.voteName" placeholder="请输入投票名称" />
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker
          type="date"
          placeholder="请选择截止时间"
          value-format="YYYY-MM-DD"
          :disabled-date="handleDisabledDate"
          v-model="voteStore.newVote.overDate"
        />
      </el-form-item>
      <el-form-item label="简介">
        <el-input
          type="textarea"
          v-model="voteStore.newVote.information"
          placeholder="请输入投票简介"
        />
      </el-form-item>
      <el-form-item label="最多可选">
        <el-input-number v-model="voteStore.newVote.optionsNumber" :min="1" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handleSubmitVoteButton">提交</el-button>
      </el-form-item>
    </el-form>

    <el-collapse accordion>
      <el-collapse-item name="edit">
        <template #title>
          <span class="text"><el-tag type="success">添加选项</el-tag></span>
        </template>
        <el-form :inline="true">
          <el-form-item label="选项序号">
            {{ voteStore.newVoteOptions.length + 1 }}
          </el-form-item>
          <el-form-item label="选项内容">
            <el-input type="textarea" rows="1" v-model="newOptionContent" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleAddOptionButton">添加</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>

      <el-collapse-item
        v-for="(option, index) in voteStore.newVoteOptions"
        :key="index"
        :name="index"
      >
        <template #title>
          <span class="text">
            <el-tag>{{ option.number }}</el-tag>
            {{ option.content }}
          </span>
        </template>
        <div class="option-container">
          <p>
            <el-input
              class="option-input"
              v-model="option.content"
              type="textarea"
              rows="1"
            />
            <el-button
              :icon="Delete"
              circle
              text
              type="danger"
              class="option-delete-button"
              @click="handleDeleteOptionButton(option)"
            ></el-button>
          </p>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, inject } from "vue"
import { useVoteStore } from "@/stores/vote"
import { Delete, Edit } from "@element-plus/icons-vue"

const axios = inject("axios")
const voteStore = useVoteStore()

/*禁止选择比当天更早的日期 */
function handleDisabledDate(time) {
  return time.getTime() < Date.now()
}

const newOptionContent = ref("")

function handleAddOptionButton() {
  let option = {
    content: newOptionContent.value,
    number: voteStore.newVoteOptions.length + 1,
  }
  voteStore.newVoteOptions.push(option)
  newOptionContent.value = ""
}

function handleDeleteOptionButton(option) {
  voteStore.newVoteOptions = voteStore.newVoteOptions.filter((item) => item != option)
  voteStore.newVoteOptions.forEach((element, index) => {
    element.number = index + 1
  })
}

function handleSubmitVoteButton() {
  //非空校验
  if (
    voteStore.newVote.voteName === "" ||
    voteStore.newVote.overDate === "" ||
    voteStore.newVote.information === ""
  ) {
    ElNotification({
      title: "警告",
      type: "warning",
      message: "投票信息不能为空！",
    })
  } else if (voteStore.newVoteOptions.length < 2) {
    ElNotification({
      title: "警告",
      type: "warning",
      message: "投票选项数量至少为2！",
    })
  } else {
    let flag = true
    voteStore.newVoteOptions.forEach((item) => {
      if (item.content === "") {
        flag = false
      }
    })
    if (!flag) {
      ElNotification({
        title: "警告",
        type: "warning",
        message: "选项内容均不能为空！",
      })
    } else {
      ElMessageBox.confirm("确认发起投票吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          let data = {
            vote: voteStore.newVote,
            options: voteStore.newVoteOptions,
          }
          console.log(data)
          axios({
            method: "post",
            url: "/vote/addVoteWithOptions",
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
                voteStore.newVote.voteName = ""
                voteStore.newVote.overDate = ""
                voteStore.newVote.information = ""
                voteStore.newVote.optionsNumber = 1
                voteStore.newVoteOptions = []
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
        .catch(() => {
          ElMessage({
            type: "info",
            message: "提交已取消",
          })
        })
    }
  }
}
</script>
<style scoped>
.vote-form {
  padding: 15px;
  background: #ffffff;
}
.text {
  position: relative;
  left: 15px;
}
.option-input {
  width: 200px;
}
.option-edit-button {
  position: relative;
  left: 10px;
}
.option-delete-button {
  position: relative;
  left: 0px;
}
.option-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
