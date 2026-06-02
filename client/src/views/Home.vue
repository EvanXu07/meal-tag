<script setup lang="ts"></script>

<template>
  <div class="container">
    <div class="title">
      料理标签工厂
    </div>
    <div class="panel-container">
      <EditorPanel />
      <DisplayPanel />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  color: #F6C87D;
  text-align: center;
  font-size: 20px;
  padding-bottom: 20px;
}
.container {
  width: 1300px;
  height: 800px;
  border-radius: 14px;
  background: url('@/assets/images/bg.png') no-repeat center center;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.5);
  padding: 20px;
  .panel-container {
    display: flex;
  }
}
</style>
