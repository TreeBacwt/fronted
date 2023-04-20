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
    const newQuestions = ref([])
    const questionnaire = reactive({
        questionnaireName: "",
        questionnaireDate: new Date().format("yyyy-MM-dd"),
        information: "",
        overDate: "",
        respondent: 0,
        isOver: 0
    })

    function resetQuestionnaire() {
        questionnaire.questionnaireName = ""
        questionnaire.questionnaireDate = new Date().format("yyyy-MM-dd")
        questionnaire.information = ""
        questionnaire.overDate = ""
        questionnaire.respondent = 0
        questionnaire.isOver = 0
    }
    return { newQuestions, questionnaire, resetQuestionnaire }
}, {
    persist: {
        enabled: true
    }
})