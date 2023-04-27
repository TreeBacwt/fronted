<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>个人信息</span>
        <el-button type="primary" text @click="handleEditButton">
          {{ isEdit ? "提交" : "编辑" }}</el-button
        >
        <el-button type="info" text @click="isEdit = !isEdit" v-if="isEdit"
          >取消</el-button
        >
      </div>
    </template>
    <div v-if="!isEdit">
      <div class="text item">姓名：{{ parentStore.parent.name }}</div>
      <div class="text item">个人简介：{{ parentStore.parent.information }}</div>
    </div>
    <div v-else>
      <div class="text item">
        姓名： <el-input v-model="editParent.parentName" class="information-input" />
      </div>
      <div class="text item">
        个人简介：<el-input
          v-model="editParent.information"
          class="information-input"
          type="textarea"
        />
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { reactive, ref, inject, computed, onMounted } from "vue"
import { useUserStore } from "@/stores/user"
import { useParentStore } from "@/stores/parent"

const axios = inject("axios")
const userStore = useUserStore()
const user = computed(() => userStore.user)
const parentStore = useParentStore()

onMounted(() => {
  parentStore.refresh(axios, user.value.id)
})

const isEdit = ref(false)
const editParent = ref()
function handleEditButton() {
  if (isEdit.value) {
    if (editParent.value.parentName !== "" && editParent.value.information !== "") {
      axios({
        method: "put",
        url: "/parent/upd",
        params: editParent.value,
      })
        .then((res) => {
          let data = res.data
          if (data.code == 1) {
            ElNotification({
              title: "成功",
              type: "success",
              message: data.message,
            })
            isEdit.value = false
            parentStore.refresh(axios, user.value.id)
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
    } else {
      ElNotification({
        title: "警告",
        type: "warning",
        message: "输入信息不能为空！",
      })
    }
  } else {
    isEdit.value = true
    editParent.value = {
      id: parentStore.parent.id,
      parentName: parentStore.parent.name,
      information: parentStore.parent.information,
    }
  }
}
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}

.text {
  font-size: 20px;
}

.item {
  display: flex;
  margin-bottom: 18px;
  text-align: left;
  height: 30px;
  align-items: center;
}
.card-body {
  display: flex;
}
.information-input {
  width: 40%;
}
</style>
