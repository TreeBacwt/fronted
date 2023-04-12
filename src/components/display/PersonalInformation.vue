<template>
    <el-row :gutter="40">
        <el-col :span="12">
            <TeacherInformationCard/>
        </el-col>
        <el-col :span="12">
            <UpdateInformationCard/>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
    import TeacherInformationCard from '@/components/card/TeacherInformationCard.vue'
    import UpdateInformationCard from '@/components/card/UpdateInformationCard.vue'
</script>
<style scoped>
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height:50px;
    }

    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }
</style>