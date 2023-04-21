<template>
  <el-row :gutter="40">
    <el-col :span="12">
      <TeacherInformationCard v-if="userStore.user.role == 1" />
      <ParentInformationCard v-else-if="userStore.user.role == 3" />
    </el-col>
    <el-col :span="12">
      <UpdateInformationCard />
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import TeacherInformationCard from "@/components/card/TeacherInformationCard.vue"
import UpdateInformationCard from "@/components/card/UpdateInformationCard.vue"
import ParentInformationCard from "@/components/card/ParentInformationCard.vue"
import { useUserStore } from "@/stores/user"

const userStore = useUserStore()
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
</style>
