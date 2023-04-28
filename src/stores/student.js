import { ElNotification } from "element-plus"
import { defineStore } from "pinia"
import { ref, reactive } from "vue"

export const useStudentStore = defineStore('student', () => {
    const student = ref({
        studentNum: '',
        studentName: '',
        sex: '',
        birthday: '',
        address: '',
        ethnic: '',
        information: '',
        isLeader: ''
    })

    function refreshStudent(axios, uid) {
        axios({
            method: 'get',
            url: '/student/getStudentByUserId/' + uid
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                student.value = data.data
            } else {
                // ElNotification({
                //     title: '错误',
                //     type: 'error',
                //     message: data.message
                // })
            }
        }).catch((res) => {
            ElNotification({
                title: '错误',
                type: 'error',
                message: "出错了！"
            })
        })
    }
    return { student, refreshStudent }
}, {
    persist: {
        enabled: true
    }
})