<template>
  <div>
    <el-row :gutter="40">
      <el-col :span="12">
        <SubjectsCard />
      </el-col>
      <el-col :span="12">
        <AddSubjectCard />
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import SubjectsCard from "@/components/card/SubjectsCard.vue"
import AddSubjectCard from "@/components/card/AddSubjectCard.vue"
</script>
<style scoped></style>
