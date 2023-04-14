import { defineStore } from "pinia"
import { ref } from "vue"

export const useStudentsListStore = defineStore('studentsList', () => {
    const studentsList = ref([])

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
    return { studentsList, refresh }
})