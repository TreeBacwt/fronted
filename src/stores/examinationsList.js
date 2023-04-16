import { defineStore } from "pinia"
import { ref } from "vue"

export const useExaminationsListStore = defineStore('examinationsList', () => {
    const examinationsList = ref([])
    const currentPage = ref(1)
    const editExamination = ref({})

    function refresh(axios, page) {
        axios({
            method: "get",
            url: "/examination/list/" + page,
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                examinationsList.value = data.data
            } else {
                ElMessage.info(data.message)
            }
        })
    }
    return { examinationsList, refresh, currentPage, editExamination }
})