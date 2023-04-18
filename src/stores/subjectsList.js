import { defineStore } from "pinia"
import { ref } from "vue"

export const useSubjectsListStore = defineStore('subjectsList', () => {
    const subjectsList = ref([])

    function refresh(axios) {
        axios({
            method: "get",
            url: "/subject/all",
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                subjectsList.value = data.data
            } else {
                ElMessage.info(data.message)
            }
        })
    }
    return { subjectsList, refresh }
})