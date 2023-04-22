<template>
  <div>
    <el-form class="vote-form">
      <el-form-item label="投票名称">
        <el-input />
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker
          type="date"
          placeholder="请选择截止时间"
          value-format="YYYY-MM-DD"
          :disabled-date="handleDisabledDate"
        />
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" />
      </el-form-item>
      <el-form-item label="最多可选">
        <el-input-number />
      </el-form-item>
      <el-form-item>
        <el-button type="success">提交</el-button>
      </el-form-item>
    </el-form>

    <el-collapse accordion>
      <el-collapse-item name="edit">
        <template #title>
          <span class="text"><el-tag type="success">添加选项</el-tag></span>
        </template>
        <el-form :inline="true">
          <el-form-item label="选项序号"> </el-form-item>
          <el-form-item label="选项内容">
            <el-input type="textarea" rows="1" />
          </el-form-item>
          <el-form-item>
            <el-button type="success">添加</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, inject } from "vue"

const axios = inject("axios")

/*禁止选择比当天更早的日期 */
function handleDisabledDate(time) {
  return time.getTime() < Date.now()
}
</script>
<style scoped>
.vote-form {
  padding: 15px;
  background: #ffffff;
}
.text {
  position: relative;
  left: 15px;
}
</style>
