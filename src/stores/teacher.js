import { defineStore } from "pinia"
import { reactive, ref } from "vue"

export const useTeacherStore = defineStore('teacher', () => {
    const teacher = reactive({
        id: '',
        name: '',
        sex: '',
        subject: '',
        information: ''
    })

    function save(t) {
        teacher.name = t.teacherName
        teacher.sex = t.sex
        teacher.subject = t.subject
        teacher.information = t.information
        teacher.id = t.id
    }

    return { teacher, save }
}, {
    persist: {
        enabled: true
    }
})