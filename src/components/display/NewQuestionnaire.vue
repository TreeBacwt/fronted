<template>
  <div>
    <el-form :inline="true" class="questionnaire-form">
      <el-form-item label="问卷名称">
        <el-input />
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker
          type="date"
          placeholder="请选择截止时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="success">提交</el-button>
      </el-form-item>
    </el-form>

    <el-collapse accordion>
      <el-collapse-item name="edit">
        <template #title>
          <span class="text"><el-tag type="success">添加题目</el-tag></span>
        </template>
        <el-form :inline="true">
          <el-form-item label="题目描述">
            <el-input type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="success">添加</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="1">
        <template #title>
          <span class="text">111</span>
        </template>
        <div>
          Consistent with real life: in line with the process and logic of real life, and
          comply with languages and habits that the users are used to;
        </div>
        <div>
          Consistent within interface: all elements should be consistent, such as: design
          style, icons and texts, position of elements, etc.
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue"
</script>
<style scoped>
.questionnaire-form {
  background: #ffffff;
}
.text {
  position: relative;
  left: 15px;
}
</style>
