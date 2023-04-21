import { ElMessage } from "element-plus"
import { defineStore } from "pinia"
import { reactive } from "vue"

export const useParentStore = defineStore('parent', () => {
    const parent = reactive({
        id: '',
        name: '',
        information: '',
        studentNum: ''
    })

    function refresh(axios, uid) {
        axios({
            method: 'get',
            url: '/parent/getParentByUserId/' + uid,
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                parent.id = data.data.id
                parent.name = data.data.parentName
                parent.information = data.data.information
                parent.studentNum = data.data.studentNum
            } else {
                ElMessage.error(data.message)
            }
        }).catch((res) => {
            ElMessage.error("出错了！")
        })
    }
    return { parent, refresh }
}, {
    persist: {
        enabled: true
    }
})