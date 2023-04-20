import { defineStore } from "pinia"
import { ref } from "vue"

export const useQuestionnaireStore = defineStore('questionnaire', () => {
    const newQuestions = ref([])

    return { newQuestions }
}, {
    persist: {
        enabled: true
    }
})