<template>
  <div class="menu">
    <el-menu
      id="aside"
      class="el-menu-vertical-demo emenu"
      :collapse="store.isCollapse"
      :collapse-transition="false"
      :default-active="activeIndex"
    >
      <el-menu-item index="personalInformation" @click="handleItemClick">
        <el-icon><postcard /></el-icon>
        <template #title>个人信息</template>
      </el-menu-item>

      <el-menu-item index="classAffairsManagement" @click="handleItemClick">
        <el-icon><document /></el-icon>
        <template #title> 班级事务</template>
      </el-menu-item>

      <el-menu-item index="scoresManagement" @click="handleItemClick">
        <el-icon><EditPen /></el-icon>
        <template #title>成绩查看</template>
      </el-menu-item>

      <el-sub-menu index="votes" v-if="studentStore.student.isLeader == 1">
        <template #title>
          <el-icon><Finished /></el-icon>
          <span>投票管理</span>
        </template>
        <el-menu-item index="newVote" @click="handleItemClick"> 发起投票 </el-menu-item>
        <el-menu-item index="votesManagement" @click="handleItemClick">
          已有投票
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item index="votesManagement" @click="handleItemClick" v-else>
        <el-icon><Finished /></el-icon>
        <template #title>参与投票</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue"
import {
  User,
  Location,
  Document,
  Menu as IconMenu,
  Setting,
  Postcard,
  EditPen,
  Reading,
  Tickets,
  Finished,
  ChatLineSquare,
} from "@element-plus/icons-vue"
import { useCollapseStore } from "@/stores/collapse"
import { useStudentStore } from "@/stores/student"
import { useUserStore } from "@/stores/user"
import { useRouter, useRoute } from "vue-router"
import { onMounted, inject } from "vue"

const store = useCollapseStore()
const studentStore = useStudentStore()
const userStore = useUserStore()

const axios = inject("axios")
const router = useRouter()
const route = useRoute()
const activeIndex = computed(() => route.path.slice(6))

function handleItemClick(item) {
  router.push({ name: item.index })
}

onMounted(() => {
  studentStore.refreshStudent(axios, userStore.user.id)
})
</script>
<style scoped>
.menu,
.el-menu {
  height: 100%;
}
#aside {
  border-right: 0px;
}
</style>
