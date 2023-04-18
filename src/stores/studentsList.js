import { defineStore } from "pinia"
import { ref } from "vue"

export const useStudentsListStore = defineStore('studentsList', () => {
    const studentsList = ref([])
    const editStudent = ref({})
    const activeStudentCollapseItem = ref('')
    const isEdit = ref(false)

    function refresh(axios) {
        axios({
            method: "get",
            url: "/student/all",
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                studentsList.value = data.data
            } else {
                ElMessage.error(data.message)
            }
        })
    }
    return { studentsList, refresh, editStudent, activeStudentCollapseItem, isEdit }
}, {
    persist: {
        enabled: true
    }
})