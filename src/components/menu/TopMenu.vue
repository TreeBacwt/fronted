<template>
    <el-menu
        id="top-menu"
        class="el-menu-demo"
        mode="horizontal"
    >
        <el-icon :size="30" class="collapse" @click="store.handleCollapse">
            <expand v-if="store.isCollapse"/>
            <fold v-else/>
        </el-icon>
        <el-text class="title" size="large">中职班级管理系统</el-text>
        <div class="flex-grow" />
        <el-menu-item index="1">Info</el-menu-item>
    </el-menu>
</template>
<script lang="ts" setup>
    import { reactive, ref } from 'vue'
    import { Fold, Expand } from '@element-plus/icons-vue'
    import { useCollapseStore } from '@/stores/collapse'

    const store = useCollapseStore()
</script>
<style scoped>
    .collapse{
        left:16px;
        top:15px;
    }
    .flex-grow {
        flex-grow: 1;
    }
    #top-menu{
        height:60px;
    }
    .title{
        margin:40px;
    }
</style>