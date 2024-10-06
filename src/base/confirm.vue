<template>
  <el-dialog :modal="false" v-model="internalVisible" :width="toRem(320)" class="confirm-dialog">
    <template #header>
      <div>{{ title || '提示' }}</div>
    </template>
    <div class="confirm-body">{{ text }}</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="confirmAndClose" class="confirm-btn" type="primary">确认</el-button>
        <el-button @click="closeDialog" class="cancel-btn">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { toRem } from '@/utils';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  text: String,
  title: String,
  onConfirm: Function
});

const emit = defineEmits(['update:modelValue'])

// 定义一个内部的可见状态，用于双向绑定
const internalVisible = ref(props.modelValue)

// 监听 props.modelValue 的变化，更新 internalVisible
watch(() => props.modelValue, (newVal) => {
  internalVisible.value = newVal
})

// 监听 internalVisible 的变化，更新父组件的状态
watch(internalVisible, (newVal) => {
  emit('update:modelValue', newVal)
})

const confirmAndClose = () => {
  if (props.onConfirm) {
    props.onConfirm();
  }
  internalVisible.value = false;
};

const closeDialog = () => {
  internalVisible.value = false;
};
</script>

<style lang="scss" scoped>
.confirm-dialog {
  :deep(.el-dialog__body) {
    padding-top: 20px;
    padding-bottom: 20px;
  }


  .confirm-body {
    line-height: 20px;
  }

  .confirm-btn {
    width: 20%;
  }

  .cancel-btn {
    width: 20%
  }
}
</style>