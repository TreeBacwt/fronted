<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>个人信息</span>
      </div>
    </template>
    <div class="text item">姓名：{{ parentStore.parent.name }}</div>
    <div class="text item">个人简介：{{ parentStore.parent.information }}</div>
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
</style>
