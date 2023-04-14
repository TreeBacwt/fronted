<template>
  <el-table
    :data="filterTableData"
    style="width: 100%"
    highlight-current-row
    max-height="450"
  >
    <el-table-column label="ID" prop="id" />
    <el-table-column label="账户名" prop="account" />
    <el-table-column label="角色" prop="role">
      <template #default="scope">
        <el-tag :type="handleRoleType(scope.row.role)" disable-transitions>
          {{ handleRoleText(scope.row.role) }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="搜索账户名" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="resetPassword">重置密码</el-button>
        <el-button
          size="small"
          type="danger"
          @click="deleteUser(scope.row.id)"
          :disabled="handleButtonState(scope.row.id)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { computed, ref, inject } from "vue"
import { useUserStore } from "@/stores/user"
import { useUsersListStore } from "@/stores/usersList"

const axios = inject("axios")
const search = ref("")
const user = computed(() => useUserStore().user)
const usersListStore = useUsersListStore()
const tableData = computed(() => usersListStore.usersList)
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value || data.account.toLowerCase().includes(search.value.toLowerCase())
  )
)

usersListStore.refresh(axios)

function handleRoleType(role) {
  if (role == 1) {
    return ""
  } else if (role == 2) {
    return "success"
  } else return "info"
}
function handleRoleText(role) {
  if (role == 1) {
    return "教师"
  } else if (role == 2) {
    return "学生"
  } else return "家长"
}
function deleteUser(id) {
  ElMessageBox.confirm("确认删除用户吗？", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      axios({
        method: "delete",
        url: "/user/delete",
        params: {
          id,
        },
      }).then((res) => {
        let data = res.data
        if (data.code == 1) {
          ElNotification({
            title: "成功",
            message: data.message,
            type: "success",
          })
        } else {
          ElNotification({
            title: "错误",
            message: data.message,
            type: "error",
          })
        }
        usersListStore.refresh(axios)
      })
    })
    .catch(() => {
      ElNotification({
        title: "提示",
        message: "删除已取消",
        type: "info",
      })
    })
}
function handleButtonState(id) {
  if (user.value.id == id) {
    return true
  } else return false
}
function resetPassword() {
  ElMessage("功能尚未完成")
}
</script>
