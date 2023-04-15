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

      <el-menu-item index="/">
        <el-icon><setting /></el-icon>
        <template #title>其他页面3</template>
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
