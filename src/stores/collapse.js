import { defineStore } from "pinia"
import { ref } from "vue"

export const useCollapseStore = defineStore('collapse', () => {
    const isCollapse = ref(true)

    function handleCollapse() {
        isCollapse.value = !isCollapse.value
    }

    return { isCollapse, handleCollapse }
}, {
    persist: {
        enabled: true
    }
})