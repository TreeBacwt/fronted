<template>
    <div style="height:100%">
        <el-container>
            <el-header id="header">
              <TopMenu/>
            </el-header>
            <el-container>
                <el-aside :width="isAsideCollapse" class="aside">
                  <TeacherMenu v-if="user.role == 1"/>
                </el-aside>
                <el-main>
                  <PersonalInformation/>
                </el-main>
            </el-container>
        </el-container>
  </div>
</template>
<script lang="ts" setup>
    import TeacherMenu from '@/components/menu/TeacherMenu.vue'
    import TopMenu from '@/components/menu/TopMenu.vue'
    import PersonalInformation from '@/components/display/PersonalInformation.vue'
    import { reactive, ref, computed } from 'vue'
    import { useCollapseStore } from '@/stores/collapse'
    import { useUserStore } from '@/stores/user'

    const collapseStore = useCollapseStore()
    const userStore = useUserStore()
    const user = computed(() => userStore.user)

    const isAsideCollapse = computed(() => collapseStore.isCollapse ? "64px" : "150px")


</script>
<style>
  #header{
    padding: 0 0px;
  }
    .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
    height: 100%;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .el-container{
      height: 100%;
  }
  .aside{
    overflow: hidden;
    transition: width 0.25s;
    -webkit-transition: width 0.25s;
    -moz-transition: width 0.25s; 
    -o-transition: width 0.25s;
  }
</style>