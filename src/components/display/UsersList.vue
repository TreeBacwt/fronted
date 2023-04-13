<template>
  <el-table
    :data="filterTableData"
    style="width: 100%"
    highlight-current-row
    max-height="500"
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
        <el-button size="small" type="danger" @click="handleDelete(scope.row.id)"
          >Delete</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { computed, ref, inject } from "vue"

const axios = inject("axios")
const search = ref("")
const tableData = ref([])
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value || data.account.toLowerCase().includes(search.value.toLowerCase())
  )
)

axios({
  method: "get",
  url: "/user/all",
}).then((res) => {
  let data = res.data
  if (data.code == 1) {
    tableData.value = data.data
  } else {
    ElMessage.error(data.message)
  }
})

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
function handleDelete(id) {
  console.log(id)
}
</script>
