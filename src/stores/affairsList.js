import { defineStore } from "pinia"
import { ref, reactive } from "vue"

export const useAffairsListStore = defineStore('affairsList', () => {
    const affairsList = ref([])
    const currentPage = ref(1)
    const editAffair = ref({})

    function refresh(axios, page) {
        axios({
            method: "get",
            url: "/affair/list/" + page,
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                affairsList.value = data.data
            } else {
                ElMessage.info(data.message)
            }
        })
    }
    return { affairsList, refresh, currentPage, editAffair }
})