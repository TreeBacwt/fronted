<template>
    <el-card class="box-card">
        <template #header>
        <div class="card-header">
            <span>修改密码</span>
            <el-button type="primary" class="button" text @click="updatePassword">提交</el-button>
        </div>
        </template>

        <el-form
            label-position="left"
            label-width="100px"
            :model="form"
        >
            <el-form-item label="账户名">
                <el-input v-model="user.account" disabled/>
            </el-form-item>
            <el-form-item label="旧密码">
                <el-input type="password" v-model="form.oldPassword" show-password/>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input type="password" v-model="form.newPassword" show-password/>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script lang="ts" setup>
    import { reactive, ref, inject, computed } from 'vue'
    import { useUserStore } from '@/stores/user'
    import { useTeacherStore } from '@/stores/teacher'
    import { useRouter } from 'vue-router'

    const userStore = useUserStore()
    const user = computed(() => userStore.user)
    const teacherStore = useTeacherStore()
    const teacher = computed(() => teacherStore.teacher)
    const axios = inject('axios')
    const router = useRouter()

    const form = reactive({
        id: user.value.id,
        oldPassword: '',
        newPassword: ''
    })

    function updatePassword(){
        ElMessageBox.confirm(
            '确认修改密码？',
            '提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            if (form.oldPassword === '' || form.newPassword === '') {
                ElNotification({
                    title: '错误',
                    message: '不能为空！',
                    type: 'error',
                })
            }else {
                axios({
                    method: 'put',
                    url: '/user/upd/psw',
                    params: form,
                }).then((res) => {
                    let data = res.data            
                    if (data.code == 1) {
                        ElNotification({
                            title: '成功',
                            message: data.message,
                            type: 'success',
                        })
                    } else if (data.code == -1) {
                        ElNotification({
                            title: '错误',
                            message: data.message,
                            type: 'error',
                        })
                        router.push('/')
                    }else {
                        ElNotification({
                            title: '错误',
                            message: data.message,
                            type: 'error',
                        })
                    }
                    form.oldPassword = ''
                    form.newPassword = ''
                })
            }
        }).catch(() => {
            ElNotification({
                title: '警告',
                message: '修改已取消',
                type: 'warning',
            })
        })
    }
    
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