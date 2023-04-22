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

export const useVoteStore = defineStore('vote', () => {

    //新建投票
    const newVote = reactive({
        voteName: '',
        information: '',
        voteDate: new Date().format("yyyy-MM-dd"),
        overDate: '',
        isOver: 0,
        participant: 0,
        optionsNumber: 1
    })
    //新建投票的选项数组
    const newVoteOptions = ref([])


    return { newVote, newVoteOptions }
}, {
    persist: {
        enabled: true
    }
})