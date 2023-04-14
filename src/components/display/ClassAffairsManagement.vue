<template>
  <div>
    <el-row
      ><el-col :span="24"> <AffairsList /></el-col>
    </el-row>
    <div class="card-container"><AddAffairCard class="add-affair-card" /></div>
  </div>
</template>
<script lang="ts" setup>
import AffairsList from "@/components/list/AffairsList.vue"
import AddAffairCard from "@/components/card/AddAffairCard.vue"
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
