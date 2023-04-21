import { ElMessage, ElNotification } from "element-plus"
import { defineStore } from "pinia"
import { ref, reactive } from "vue"

/*当天日期格式化 */
Date.prototype.format = function (format) {
    let d = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
    }
    if (/(y+)/.test(format)) {
        format = format.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        )
    }
    for (let k in d) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? d[k] : ("00" + d[k]).substr(("" + d[k]).length)
            )
        }
    }
    return format
}

export const useQuestionnaireStore = defineStore('questionnaire', () => {
    //新建问卷
    const newQuestions = ref([])
    const questionnaire = reactive({
        questionnaireName: "",
        questionnaireDate: new Date().format("yyyy-MM-dd"),
        information: "",
        overDate: "",
        respondent: 0,
        isOver: 0
    })

    //问卷列表
    const questionnairesList = ref([])
    const currentPage = ref(1)
    const total = ref(0)
    const unDoneQuestionnairesList = ref([])

    function resetQuestionnaire() {
        questionnaire.questionnaireName = ""
        questionnaire.questionnaireDate = new Date().format("yyyy-MM-dd")
        questionnaire.information = ""
        questionnaire.overDate = ""
        questionnaire.respondent = 0
        questionnaire.isOver = 0
    }

    function refreshQuestionnairesList(axios, page) {
        axios({
            method: 'get',
            url: '/questionnaire/list/' + page,
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                questionnairesList.value = data.data
            } else {
                ElNotification({
                    title: '错误',
                    type: "error",
                    message: data.message
                })
            }
        }).catch((res) => {
            ElNotification({
                title: '错误',
                type: "error",
                message: "出错了！"
            })
        })
    }

    function getTotal(axios) {
        axios({
            method: 'get',
            url: '/questionnaire/getTotal',
        }).then((res) => {
            let data = res.data
            total.value = data.data
        }).catch((res) => {
            ElMessage.error("出错了！")
        })
    }

    function refreshUnDoneQuestionnairesList(axios, pid) {
        axios({
            method: 'get',
            url: '/questionnaire/getQuestionnairesByParentId/' + pid,
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                unDoneQuestionnairesList.value = data.data
            } else {
                ElNotification({
                    title: '错误',
                    type: "error",
                    message: data.message
                })
            }
        }).catch((res) => {
            ElNotification({
                title: '错误',
                type: "error",
                message: "出错了！"
            })
        })
    }

    return {
        newQuestions,
        questionnaire,
        resetQuestionnaire,
        currentPage,
        questionnairesList,
        refreshQuestionnairesList,
        total,
        getTotal,
        unDoneQuestionnairesList,
        refreshUnDoneQuestionnairesList
    }
}, {
    persist: {
        enabled: true
    }
})