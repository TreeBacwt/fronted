import { defineStore } from "pinia"
import { reactive } from "vue"

export const useUserStore = defineStore('user', () => {
    const user = reactive({
        id: 0,
        account: '',
        role: 0
    })

    function setId(id) {
        user.id = id
    }

    function setAccount(account) {
        user.account = account
    }

    function setRole(role) {
        user.role = role
    }

    function setUser(u) {
        user.id = u.id
        user.account = u.account
        user.role = u.role
    }

    function logout() {
        user.id = 0
        user.account = ''
        user.role = 0
    }

    return { user, setId, setAccount, setRole, setUser, logout }
}, {
    persist: {
        enabled: true
    }
})