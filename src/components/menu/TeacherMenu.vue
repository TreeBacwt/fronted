<template>
    <div class="menu">

        <el-menu
            id="aside"
            default-active="userlist"
            class="el-menu-vertical-demo emenu"
            :collapse="store.isCollapse"
            :collapse-transition="false"
        >
            <el-menu-item index="userList">
                <el-icon><user/></el-icon>
                <template #title>用户列表</template>
            </el-menu-item>

            <el-menu-item index="other1">
                <el-icon><icon-menu /></el-icon>
                <template #title>其他页面1</template>
            </el-menu-item>

            <el-menu-item index="other2">
                <el-icon><document /></el-icon>
                <template #title>其他页面2</template>
            </el-menu-item>
            <el-menu-item index="other3">
                <el-icon><setting /></el-icon>
                <template #title>其他页面3</template>
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script lang="ts" setup>
    import { ref,computed } from 'vue'
    import {
        User,
        Location,
        Document,
        Menu as IconMenu,
        Setting,
    } from '@element-plus/icons-vue'
    import { useCollapseStore } from '@/stores/collapse'

    const store = useCollapseStore()
</script>
<style scoped>  
    .menu, .el-menu{
        height: 100%;
    }
    #aside{
        border-right:0px;
    }
</style>