import { defineStore } from "pinia"
import { ref } from "vue"

export const useExaminationsListStore = defineStore('examinationsList', () => {
    const examinationsList = ref([])
    const currentPage = ref(1)
    const scores = ref([])
    const activeItemName = ref("")

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
    function getScoresOfExamination(axios, eid) {
        if (typeof eid === 'number') {
            axios({
                method: "get",
                url: '/score/getScoresOfExam/' + eid,
            }).then((res) => {
                let data = res.data
                if (data.code == 1) {
                    scores.value = data.data
                } else {
                    ElMessage.info(data.message)
                }
            }).catch((res) => {
            })
        }

    }
    return { examinationsList, refresh, currentPage, getScoresOfExamination, scores, activeItemName }
})