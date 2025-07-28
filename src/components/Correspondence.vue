<template>
  <t-space style="width: 100%;border: none;" direction="vertical">
    <t-collapse :current-item="currentItem" expand-icon-placement="right" expand-mutex @change="">
      <t-collapse-panel value="0" header="websocket">
        <t-form label-align="left">
          <t-form-item label="WebSocketURL：" name="wsUrl">
            <t-input v-model="wsUrl" placeholder="请输入WebSocket URL" />
          </t-form-item>
          <t-form-item label="protocols：" name="protocols">
            <t-input v-model="sendMessage" placeholder="请输入" />
          </t-form-item>
        </t-form>
      </t-collapse-panel>
      <t-collapse-panel v-for="(http, index) in httpList" :key="index" :value="index + 1" :header="`http ${index + 1}`">
        <t-form label-align="left">
          <t-form-item label="请求方式：" name="method">
            <t-input v-model="http.method" placeholder="请输入请求方式" />
          </t-form-item>
          <t-form-item label="url地址：" name="url">
            <t-input v-model="http.url" placeholder="请输入url地址：" />
          </t-form-item>
          <t-form-item label="时间间隔：" name="interval">
            <t-input v-model="http.interval" placeholder="请输入时间间隔：" />
          </t-form-item>
          <t-form-item label="请求头：" name="">
            <t-button @click="showModal">...</t-button>
          </t-form-item>
          <CodeMirrorModal :visible="modalVisible" :code="code" @update:visible="modalVisible = $event" @update:code="code =$event" />
          <t-button @click="removeHttp(index)" v-if="httpList.length > 1">删除</t-button>
        </t-form>
      </t-collapse-panel>
      <t-collapse-panel value="1" header="消息处理javascript">
        <t-form label-align="left">
          <t-form-item label="消息处理：" name=""><t-button @click="showModal">...</t-button></t-form-item>
        </t-form>
        <CodeMirrorModal :visible="modalVisible" :code="code" @update:visible="modalVisible = $event" @update:code="code =$event" />
      </t-collapse-panel>
      <t-collapse-panel value="2" header="获取变量树">
        
        <t-form label-align="left">
          <t-form-item label="获取地址：" name="url">
            <t-input  placeholder="默认/api/：" />
          </t-form-item>
          <t-form-item label="请求头：" name="">
            <t-button @click="showModal">...</t-button>
          </t-form-item>
        </t-form>
        <CodeMirrorModal :visible="modalVisible" :code="code" @update:visible="modalVisible = $event" @update:code="code=$event" />
      </t-collapse-panel>
    </t-collapse>
    <t-button @click="addHttp">添加http通信</t-button>
  </t-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import CodeMirrorModal from './CodeMirrorModal.vue';
const currentItem = ref<string[]>(['0']);
const wsUrl = ref('');
const sendMessage = ref('');
const httpList = ref<Array<{ method: string; url: string; interval: string }>>([
  { method: '', url: '', interval: '' }
]);

const modalVisible = ref(false);
const code = ref('');

const showModal = () => {
  modalVisible.value = true;
};

const handleCodeChange = (newCode: string) => {
  code.value = newCode;
};

function addHttp() {
  httpList.value.push({ method: '', url: '', interval: '' });
}

function removeHttp(index: number) {
  if (httpList.value.length > 1) {
    httpList.value.splice(index, 1);
  }
}

function sendWsMessage() {
  // 这里可以添加发送 WebSocket 消息的逻辑
  console.log('发送消息:', sendMessage.value);
}
</script>

<style lang="postcss">
.t-collapse {
  border: none !important;
}

.t-collapse-panel__wrapper .t-collapse-panel__body {
  background: #ffffff !important;
  font-size: 12px !important;
}

.t-collapse-panel__wrapper .t-collapse-panel__content {
  color: #ffffff !important;
}

.t-form__label {
  font-size: 12px !important;
}
</style>
