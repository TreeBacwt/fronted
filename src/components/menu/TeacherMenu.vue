<template>
    <div class="menu">

        <el-menu
            id="aside"
            default-active="home/personalInformation"
            class="el-menu-vertical-demo emenu"
            :collapse="store.isCollapse"
            :collapse-transition="false"
            :router="true"
        >
            <el-menu-item index="home/personalInformation">
                <el-icon><user/></el-icon>
                <template #title>个人信息</template>
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
    import { useRouter } from 'vue-router'

    const store = useCollapseStore()
    const router = useRouter()

    function handleItemClick(item) {
        router.push({name: item.index})
    }
</script>
<style scoped>  
    .menu, .el-menu{
        height: 100%;
    }
    #aside{
        border-right:0px;
    }
</style>