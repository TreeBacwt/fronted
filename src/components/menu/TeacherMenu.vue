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

      <el-menu-item index="userManagement" @click="handleItemClick">
        <el-icon><user /></el-icon>
        <template #title>用户管理</template>
      </el-menu-item>

      <el-sub-menu index="documents">
        <template #title>
          <el-icon><document /></el-icon>
          <span>档案管理</span>
        </template>

        <el-menu-item index="classAffairsManagement" @click="handleItemClick">
          班级事务
        </el-menu-item>
        <el-menu-item index="studentManagement" @click="handleItemClick">
          学生档案
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="examination">
        <template #title>
          <el-icon><EditPen /></el-icon>
          <span>考试管理</span>
        </template>

        <el-menu-item index="scoresManagement" @click="handleItemClick">
          <template #title>成绩管理</template>
        </el-menu-item>

        <el-menu-item index="subjectManagement" @click="handleItemClick">
          <template #title>课程管理</template>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="questionnaire">
        <template #title>
          <el-icon><ChatLineSquare /></el-icon>
          <span>问卷管理</span>
        </template>
        <el-menu-item index="newQuestionnaire" @click="handleItemClick">
          新建问卷
        </el-menu-item>
        <el-menu-item index="questionnaireManagement" @click="handleItemClick">
          已有问卷
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="votes">
        <template #title>
          <el-icon><Finished /></el-icon>
          <span>投票管理</span>
        </template>

        <el-menu-item index="newVote" @click="handleItemClick"> 发起投票 </el-menu-item>
        <el-menu-item index="votesManagement" @click="handleItemClick">
          已有投票
        </el-menu-item>
      </el-sub-menu>
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
import { useRouter, useRoute } from "vue-router"

const store = useCollapseStore()
const router = useRouter()
const route = useRoute()
const activeIndex = computed(() => route.path.slice(6))

function handleItemClick(item) {
  router.push({ name: item.index })
}
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
