<template>
  <el-menu id="top-menu" class="el-menu-demo" mode="horizontal">
    <el-icon :size="30" class="collapse" @click="store.handleCollapse">
      <expand v-if="store.isCollapse" />
      <fold v-else />
    </el-icon>
    <el-text class="title" size="large">中职班级管理系统</el-text>
    <div class="flex-grow" />
    <el-sub-menu index="more">
      <template #title
        ><el-icon><more /></el-icon>
      </template>
      <el-menu-item index="logout" @click="logout"
        ><template #title>
          <el-icon><SwitchButton /> </el-icon>
          <span>登出</span>
        </template></el-menu-item
      ></el-sub-menu
    >
  </el-menu>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { Fold, Expand, More, SwitchButton } from "@element-plus/icons-vue"
import { useCollapseStore } from "@/stores/collapse"
import { useUserStore } from "@/stores/user"

const store = useCollapseStore()
const userStore = useUserStore()
const router = useRouter()
function logout() {
  userStore.logout()
  router.push("/login")
  ElMessage.warning("请重新登录")
  console.log(111)
}
</script>
<style scoped>
.collapse {
  left: 16px;
  top: 15px;
}
.flex-grow {
  flex-grow: 1;
}
#top-menu {
  height: 60px;
}
.title {
  margin: 40px;
}
</style>
