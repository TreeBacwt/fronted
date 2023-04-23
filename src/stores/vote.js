import { ElNotification } from "element-plus"
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

    //投票列表
    const votesList = ref([])
    const currentPage = ref(1)
    const total = ref(0)

    function refreshVotesList(axios) {
        axios({
            method: 'get',
            url: '/vote/list/' + currentPage.value,
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                votesList.value = data.data
            } else {
                ElNotification({
                    title: '错误',
                    type: 'error',
                    message: data.message
                })
            }
        }).catch((res) => {
            ElNotification({
                title: '错误',
                type: 'error',
                message: "出错了！"
            })
        })
    }

    function getTotal(axios) {
        axios({
            method: 'get',
            url: '/vote/getTotal'
        }).then((res) => {
            let data = res.data
            total.value = data.data
        }).catch((res) => {
            ElNotification({
                title: '错误',
                type: 'error',
                message: "出错了！"
            })
        })
    }

    //评论数据
    const commentsList = ref([])

    function refreshCommentsList(axios, id) {
        axios({
            method: 'get',
            url: '/vote/getCommentsByVoteId/' + id,
        }).then((res) => {
            let data = res.data
            if (data.code == 1) {
                commentsList.value = data.data
            } else {
                commentsList.value = []
            }
        }).catch((res) => {
            ElNotification({
                title: '错误',
                type: 'error',
                message: "出错了！"
            })
        })
    }
    return {
        newVote,
        newVoteOptions,
        votesList,
        refreshVotesList,
        getTotal,
        total,
        commentsList,
        refreshCommentsList
    }
}, {
    persist: {
        enabled: true
    }
})