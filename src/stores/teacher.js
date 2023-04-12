import { defineStore } from "pinia"
import { reactive } from "vue"

export const useTeacherStore = defineStore('teacher', () => {
    const teacher = reactive({
        name: '',
        sex: '',
        subject: '',
        information: ''
    })

    function save(t){
        teacher.name = t.teacherName
        teacher.sex = t.sex == 1 ? '男' : '女'
        teacher.subject = t.subject
        teacher.information = t.information
    }

    return { teacher, save }
}, {
    persist: {
        enabled: true
    }
})