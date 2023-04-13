<template>
  <div class="container">
	  <div class="card">
      <form class="card-form">
        
        <div class="input">
          <input type="text" class="input-field" required v-model="form.account"/>
          <label class="input-label">Account</label>
        </div>

        <div class="input">
          <input type="password" class="input-field" required v-model="form.password"/>
          <label class="input-label">Password</label>
        </div>

        <div class="action">
          <input type="button" class="action-button" @click="login" value="登录"/>
        </div>

      </form>

      <div class="card-info">
        <p>中职班级管理系统</p>
      </div>
	</div>
</div>
</template>

<script lang="ts" setup>
  import { reactive, ref, inject } from 'vue'
  import { useUserStore } from '@/stores/user'
  import { ElNotification } from 'element-plus'
  import { useRouter, useRoute } from 'vue-router'

  import '@/assets/login.css'

  const axios = inject('axios')
  const router = useRouter()
  const route = useRoute()

  const form = reactive({
    account: '',
    password: '',
  })

  const store = useUserStore()

  async function login() {
    let res = await axios({
      method: 'post',
      url: '/user/login',
      params: form
    })
    let data = res.data
    console.log(data);
    
    if (data.code == 1) {
      /*success*/
      ElMessage.success(data.message)
      let user = data.data
      store.setUser(user)
      router.push('/information')//todo 不同角色
    }else{
      /*error*/
      ElMessage.error(data.message)
    }
  }

</script>

<style scoped>
  .container{
    display: flex;
    height: 100%
  }
</style>