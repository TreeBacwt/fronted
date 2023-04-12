<template>
    <div style="height:100%">
        <el-container>
            <el-header><el-icon><expand/></el-icon></el-header>
            <el-container>
                <el-aside width="200px"><TeacherMenu :isCollapse="isCollapse"/></el-aside>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
  </div>
</template>
<script lang="ts" setup>
    import TeacherMenu from '@/components/menu/TeacherMenu.vue'
    import { reactive, ref } from 'vue'
    import { Fold, Expand } from '@element-plus/icons-vue'

    const isCollapse = ref(true)

</script>
<style>
    .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
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
</style>