<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>个人信息</span>
            </div>
        </template>      
        <div class="text item">姓名：{{teacher.name}}</div>
        <div class="text item">性别：{{teacher.sex}}</div>
        <div class="text item">负责课程：{{teacher.subject}}</div>
        <div class="text item">个人简介：{{teacher.information}}</div>
    </el-card>
</template>
<script lang="ts" setup>
    import { reactive, ref, inject, computed } from 'vue'
    import { useUserStore } from '@/stores/user'
    import { useTeacherStore } from '@/stores/teacher'
    import { useRouter, useRoute } from 'vue-router'

    const router = useRouter()
    const route = useRoute()
    const axios = inject('axios')
    const userStore = useUserStore()
    const user = computed(() => userStore.user)
    const teacherStore = useTeacherStore()
    const teacher = computed(() => teacherStore.teacher)
    
    axios({
        method: 'get',
        url: '/teacher/queryByUid/' + user.value.id,
    }).then((res) => {
        let data = res.data
        if (data.code == 1) {
            /*success*/
            let t = data.data
            teacherStore.save(t)
        }else {
            ElMessage.error(data.message)
            router.push("/")
        }
    })
    
</script>
<style scoped>
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height:50px;
    }

    .text {
        font-size: 20px;
    }

    .item {
        display: flex;
        margin-bottom: 18px;
        text-align: left;
        height:30px;
        align-items: center;
    }
    .card-body{
        display: flex;
    }
</style>