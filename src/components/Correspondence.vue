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
            <t-button @click="showModal(index)">...</t-button>
          </t-form-item>
          <CodeMirrorModal ref="codeMirrorModalRef" :visible="isModalVisible" :initialValue="initialValue" @confirm="handleConfirms" @cancel="handleCancels" />
          <t-button @click="removeHttp(index)" v-if="httpList.length > 1">删除</t-button>
          <t-button @click="confirm(index)">确认</t-button>
        </t-form>
      </t-collapse-panel>
      <t-collapse-panel value="1" header="消息处理javascript">
        <t-form label-align="left">
          <t-form-item label="消息处理：" name=""><t-button @click="showModal">...</t-button></t-form-item>
        </t-form>
        <!-- <CodeMirrorModal ref="codeMirrorModalRef" :visible="isModalVisible" :initialValue="initialValue" @confirm="handleConfirms" @cancel="handleCancels" /> -->
      </t-collapse-panel>
      <t-collapse-panel value="2" header="获取变量树">
        <t-form label-align="left">
          <t-form-item label="获取地址：" name="url">
            <t-input  placeholder="" />
          </t-form-item>
          <t-form-item label="请求头：" name="">
            <t-button @click="showModal">...</t-button>
          </t-form-item>
        </t-form>
        <!-- <CodeMirrorModal ref="codeMirrorModalRef" :visible="isModalVisible" :initialValue="initialValue" @confirm="handleConfirms" @cancel="handleCancels"/> -->
      </t-collapse-panel>
    </t-collapse>
    <t-button @click="addHttp">添加http通信</t-button>
  </t-space>
</template>

<script lang="ts" setup>
import { onMounted, ref ,nextTick} from 'vue';
import CodeMirrorModal from './CodeMirrorModal.vue';
const currentItem = ref<string[]>(['0']);
const wsUrl = ref('');
const sendMessage = ref('');
const httpList = ref<Array<{ method: string; url: string; interval: string; }>>([
  { method: '', url: '', interval: '' }
]);

const codeMirrorModalRef = ref<InstanceType<typeof CodeMirrorModal> | null>(null);
const isModalVisible = ref(false);
const initialValue = ref('');
const receivedCode = ref({ value: '' });

const modalVisible = ref(false);
const code = ref('');

const showModal = async(index: number) => {
  console.log(index);
  
  const data = meta2d.store.data.networks;
  if (data && data.length > 0) {
    // data[index]?.headers去除掉Authorization这一项
    initialValue.value = JSON.stringify(data[index]?.headers || {}, null, 2).replace(/,\s*"Authorization":\s*".*?"/, '');
  }

  isModalVisible.value = true;
  await nextTick();
  // 确保子组件实例存在，然后调用其暴露的方法
  if (codeMirrorModalRef.value) {
    // 调用子组件的 handleEnd 方法，并传递当前事件的值
    (codeMirrorModalRef.value as any)[index].handleEnd(initialValue.value);
  } else {
    console.warn('codeMirrorModalRef 未定义或为 null');
  }
};

const handleCodeChange = (newCode: string) => {
  code.value = newCode;
};

function addHttp() {
  httpList.value.push({ method: '', url: '', interval: '' });
}

function removeHttp(index: number) {
  if (httpList.value.length > 1 && meta2d.store.data.networks !== undefined) {
    httpList.value.splice(index, 1);
    // 从meta2d.store.data.networks中删除对应的http配置
    if (meta2d.store.data.networks[index].name === 'http') {
      meta2d.store.data.networks.splice(index, 1);
    } else {
      // 如果不是http，则需要找到对应的http配置并删除
      const httpIndex = meta2d.store.data.networks.findIndex(network => network.name === 'http' + (index + 1));
      if (httpIndex !== -1) {
        meta2d.store.data.networks.splice(httpIndex, 1);
      }
    }
  }
}

function confirm(index: number) {
  if(meta2d.store.data.networks === undefined) {
    meta2d.store.data.networks=[{ //HTTP
      name: 'http' + (index + 1),
      protocol:'http' , 
      url: httpList.value[index].url, 
      method: httpList.value[index].method, 
      headers: {
        ...JSON.parse(receivedCode.value.value || '{}'),
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      interval:parseInt(httpList.value[index].interval) || 0,
    }];
  } else {
    meta2d.store.data.networks[index] = { //HTTP
      name: 'http' + (index + 1),
      protocol:'http' , 
      url: httpList.value[index].url, 
      method: httpList.value[index].method, 
      headers: {
        ...JSON.parse(receivedCode.value.value || '{}'),
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      interval:parseInt(httpList.value[index].interval) || 0,
    };
  }

  meta2d.connectNetwork();//建立通信
  meta2d.render();
}

const pen = ref<any>({
});

const handleConfirms = (code: string) => {
  receivedCode.value.value = code;
  console.log('Received code:', receivedCode.value.value);
  isModalVisible.value = false;
};

const handleCancels = () => {
  console.log('Cancel event received');
  isModalVisible.value = false;
};

function sendWsMessage() {
  // 这里可以添加发送 WebSocket 消息的逻辑
  console.log('发送消息:', sendMessage.value);

  
  // meta2d.setOptions();
}
onMounted(() => {
  console.log(meta2d.store.data.networks);
  if (meta2d.store.data.networks) {
    httpList.value = meta2d.store.data.networks.map(network => ({
      method: network.method || '',
      url: network.url || '',
      interval: network.interval?.toString() || '',
      headers: network.headers || {},
    }));
    console.log(httpList.value);
    
  } else {
    httpList.value = [{ method: '', url: '', interval: ''}];
  }
})

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