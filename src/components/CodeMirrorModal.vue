<template>
 <t-dialog 
 :visible="visible" 
 title="CodeMirror 编辑器" 
 width="800px" 
 height="600px" 
 @close="handleClose"
 >
 <div style="height: 100%;">
 <textarea ref="editor" style="display: none;"></textarea>
 </div>
 <template #footer>
 <t-button @click="handleCancel">取消</t-button>
 <t-button @click="handleConfirm">确认</t-button>
 </template>
 </t-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, defineExpose, watch, nextTick } from 'vue';
import 'codemirror/theme/material-darker.css'; // 引入主题样式
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/autorefresh'; // 自动刷新
import 'codemirror/mode/javascript/javascript';

interface Props {
  visible: boolean;
  initialValue?: string; // 使用可选属性，因为可能没有初始值
}

const props = defineProps<Props>();

const emit = defineEmits(['confirm', 'cancel', 'update:visible', 'end']); // 定义事件

const editor = ref<HTMLTextAreaElement | null>(null);
let codeMirrorInstance: CodeMirror.Editor | null = null;
const code = ref<string>('');

// 暴露给父组件的方法
const handleEnd = (value: any) => {
  // 确保值是字符串
  let stringValue = value;
  if (typeof value !== 'string') {
    console.warn('传入的值不是字符串，尝试转换');
    stringValue = JSON.stringify(value, null, 2);
  }
  
  if (codeMirrorInstance) {
    codeMirrorInstance.setValue(stringValue);
    console.log('已将值赋给编辑器');
    
    // 强制刷新
    setTimeout(() => {
      codeMirrorInstance?.refresh();
      codeMirrorInstance?.focus();
    }, 0);
  } else {
    console.warn('CodeMirror 实例未初始化，无法赋值');
  }
};

// 监听visible变化，确保编辑器可见时刷新
watch(() => props.visible, async (newVal) => {
  if (newVal && codeMirrorInstance) {
    await nextTick();
    setTimeout(() => {
      codeMirrorInstance?.refresh();
      codeMirrorInstance?.focus();
    }, 150);
  }
});

const handleClose = () => {
  emit('update:visible', false);
  emit('cancel');
};

const handleCancel = () => {
  handleClose();
};

const handleConfirm = () => {
  if (codeMirrorInstance) {
    const editorValue = codeMirrorInstance.getValue();
    console.log('编辑器确认时的值:', editorValue);
    emit('confirm', editorValue);
  }
};

onMounted(() => {
  if (editor.value) {
    code.value = props.initialValue || '';
    codeMirrorInstance = CodeMirror.fromTextArea(editor.value, {
      mode: 'text/javascript',
      lineNumbers: true, // 建议开启行号以便调试
      theme: 'material-darker', // 添加主题确保暗色模式生效
      lineWrapping: true,
      autoRefresh: true // 确保自动刷新
    });
    
    // 初始设置值
    codeMirrorInstance.setValue(code.value);
    
    // 延迟刷新确保渲染正确
    setTimeout(() => {
      if (codeMirrorInstance) {
        codeMirrorInstance.refresh();
      }
    }, 200);
  }
});

onBeforeUnmount(() => {
  if (codeMirrorInstance) {
    (codeMirrorInstance as any).toTextArea();
    codeMirrorInstance = null;
  }
});

// 暴露 handleEnd 方法
defineExpose({
  handleEnd, // 将 handleEnd 暴露出去
});

</script>

<style scoped>
/* 添加全局样式穿透 */
:deep(.CodeMirror) {
  height: 100% !important;
  background: black !important;
  color: aliceblue !important;
  font-family: 'Fira Code', monospace !important;
}

:deep(.CodeMirror-scroll) {
  background: black !important;
  color: aliceblue !important;
  min-height: 400px;
}

:deep(.CodeMirror-cursor) {
  border-left: 1px solid aliceblue;
}

/* 确保编辑器容器高度 */
div[style="height: 100%;"] {
  min-height: 450px;
}
</style>
