<template>
  <div>
    <el-row
      ><el-col :span="24"> <AffairsList /></el-col>
    </el-row>
    <el-row
      :gutter="20"
      style="top: 50px"
      v-if="
        userStore.user.role == 1 ||
        (userStore.user.role == 2 && studentStore.student.isLeader == 1)
      "
    >
      <el-col :span="12"><AddAffairCard /></el-col
      ><el-col :span="12"><UpdateAffairCard /></el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import AffairsList from "@/components/list/AffairsList.vue"
import UpdateAffairCard from "@/components/card/UpdateAffairCard.vue"
import { useUserStore } from "@/stores/user"
import { useStudentStore } from "@/stores/student"

const userStore = useUserStore()
const studentStore = useStudentStore()
</script>
<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  position: relative;
  top: 50px;
}
.add-affair-card {
  align-self: center;
}
</style>
