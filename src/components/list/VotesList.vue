<template>
  <div>
    <el-collapse accordion v-model="activeName"> </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, inject } from "vue"

const activeName = ref("")
</script>
<style scoped>
.text {
  position: relative;
  left: 15px;
}
</style>
