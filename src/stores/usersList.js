import { defineStore } from "pinia"
import { ref } from "vue"

export const useUsersListStore = defineStore('usersList', () => {
    const usersList = ref([])

    function refresh(axios) {
        axios({
            method: "get",
            url: "/user/all",
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                usersList.value = data.data
                console.log(usersList.value);
            } else {
                ElMessage.error(data.message)
            }
        })
    }
    return { usersList, refresh }
})