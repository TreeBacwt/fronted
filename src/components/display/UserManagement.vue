<template>
  <div>
    <el-row>
      <el-col :span="24">
        <UsersList />
      </el-col>
    </el-row>
    <el-row :gutter="20" style="top: 50px">
      <el-col :span="12"><AddStudentCard /></el-col
      ><el-col :span="12"><AddParentCard /></el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import UsersList from "@/components/list/UsersList.vue"
import AddStudentCard from "@/components/card/AddStudentCard.vue"
import AddParentCard from "@/components/card/AddParentCard.vue"
</script>
<style></style>
