<template>
  <div>
    <StudentsList />
  </div>
</template>
<script lang="ts" setup>
import StudentsList from "@/components/list/StudentsList.vue"
</script>
<style scoped>
.update-student-card-container {
  display: flex;
  flex-direction: column;
}
.update-student-card {
  align-self: center;
  position: relative;
  top: 40px;
  margin-bottom: 50px;
}
</style>
