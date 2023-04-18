import { defineStore } from "pinia"
import { ref } from "vue"

export const useSubjectsListStore = defineStore('subjectsList', () => {
    const subjectsList = ref([])
    let updateScore = {}
    function refresh(axios) {
        axios({
            method: "get",
            url: "/subject/all",
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                subjectsList.value = data.data
                data.data.forEach((subject) => {
                    updateScore[subject.id.toString()] = 0 //初始化编辑分数
                })
            } else {
                ElMessage.info(data.message)
            }
        })
    }
    return { subjectsList, refresh, updateScore }
})