<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  type?: 'text' | 'number' | 'textarea'
}>()

const model = defineModel<string | number | null>()
</script>

<template>
  <div class="editor-content">
    <div class="editor-label">
      <img :src="icon">
      {{ label }}
    </div>
    <div class="editor-input">
      <input v-if="type === 'number'" v-model.number="model" type="text">
      <input v-else-if="type !== 'textarea'" v-model="model" type="text">
      <textarea v-else v-model="model" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editor-content {
  margin-bottom: 20px;
}
.editor-label {
  color: #F6C87D;
  font-size: 14px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
}
.editor-input {
  input, textarea {
    width: 100%;
    height: 34px;
    border-radius: 10px;
    border: 3px solid #491500;
    padding: 0 10px;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #F1B670;
    &:focus {
      outline: none;
    }
  }
  textarea {
    height: 50px;
    overflow: hidden;
    resize: none;
    padding: 6px 10px;
  }
}
</style>
