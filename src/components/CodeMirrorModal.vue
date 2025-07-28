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
import { ref, onMounted, onBeforeUnmount,defineExpose } from 'vue';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
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
const handleEnd = (value: string) => {
  console.log('子组件的 handleEnd 被调用，传入值:', value);
  if (codeMirrorInstance) {
    // 将传入的 value 赋给编辑器
    codeMirrorInstance.setValue(value);
    console.log('已将值赋给编辑器');
    codeMirrorInstance.refresh(); // 强制刷新编辑器
  } else {
    console.warn('CodeMirror 实例未初始化，无法赋值');
  }
};

// ... (其余子组件代码保持不变) ...

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
    // 如果 handleEnd 是用来处理确认逻辑的，可以在这里调用
    // handleEnd(editorValue); // 示例：在确认时调用 handleEnd
  }
};

onMounted(() => {
  if (editor.value) {
    code.value = props.initialValue || ''; // 使用传入的初始值或空字符串
    codeMirrorInstance = CodeMirror.fromTextArea(editor.value, {
      mode: 'text/javascript',
      lineNumbers: false,
    });
    codeMirrorInstance.setValue(code.value);
    codeMirrorInstance.refresh(); // 初始化时也刷新
  }
});

onBeforeUnmount(() => {
  if (codeMirrorInstance) {
    (codeMirrorInstance as any).toTextArea();
    codeMirrorInstance = null;
  }
});

// 在脚本末尾暴露 handleEnd 方法
defineExpose({
  handleEnd, // 将 handleEnd 暴露出去
});

</script>

<style scoped>
:deep(.CodeMirror-scroll) {
  background: black !important;
  color: aliceblue !important;
}
:deep(.CodeMirror-cursor) {
  border-left: 1px solid aliceblue;
}
.t-button {
  margin: 0 10px;
}
/* ... 其他样式 ... */
</style>
