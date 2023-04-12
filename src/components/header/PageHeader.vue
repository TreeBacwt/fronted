<template>
    <el-page-header :icon="Fold" title=" ">
        <template #content>
            <div class="flex items-center">
                <span class="text-large font-600 mr-3"> Title </span>
                <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
                Sub title
                </span>
                <el-tag>Default</el-tag>
            </div>
        </template>
        <template #extra>
            <div class="flex items-center">
                <el-button>Print</el-button>
                <el-button type="primary" class="ml-2">Edit</el-button>
            </div>
        </template>
  </el-page-header>
</template>
<script lang="ts" setup>
    import { Fold, Expand } from '@element-plus/icons-vue'
</script>
<style scoped>
    .el-page-header{
        height:60px;
    }
</style>