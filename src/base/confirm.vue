<template>
  <el-dialog :modal="false" :visible="visible" :width="$utils.toRem(320)" class="confirm-dialog">
    <template #header>
      <div>{{ title || '提示' }}</div>
    </template>
    <div class="confirm-body">{{ text }}</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="confirmAndClose" class="confirm-btn" type="primary">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  text: String,
  title: String,
  onConfirm: Function
});

const visible = ref(props.visible);

const confirmAndClose = () => {
  if (props.onConfirm) {
    props.onConfirm();
  }
  visible.value = false;
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
    width: 100%;
  }
}
</style>