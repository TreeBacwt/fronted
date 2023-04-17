import { defineStore } from "pinia"
import { ref } from "vue"

export const useStudentsListStore = defineStore('studentsList', () => {
    const studentsList = ref([])
    const editStudent = ref({})
    const activeStudentCollapseItem = ref('')
    const isEdit = ref(false)
    const scores = ref([])

    function refresh(axios) {
        axios({
            method: "get",
            url: "/student/all",
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                studentsList.value = data.data
                data.data.forEach((student) => {
                    scores.value[student.studentNum] = {
                        studentNum: student.studentNum,
                        english: 0,
                        math: 0,
                        chinese: 0,
                        computer: 0,
                    }
                })
            } else {
                ElMessage.error(data.message)
            }
        })
    }
    return { studentsList, refresh, editStudent, activeStudentCollapseItem, isEdit, scores }
}, {
    persist: {
        enabled: true
    }
})