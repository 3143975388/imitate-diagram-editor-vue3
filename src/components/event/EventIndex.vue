<template>
  <t-space style="width: 100%;border: none;" direction="vertical">
    <t-button style="width: 100%;" @click="addEvent">添加事件</t-button>
    <!-- <t-button @click="removeAllEvents">删除所有事件</t-button> -->
    <t-collapse v-if="events.length > 0" :current-item="currentItem" expand-icon-placement="right" expand-mutex @change="">
      <t-collapse-panel v-for="(event, index) in events" :key="index" :value="index + 1" :header="`事件 ${index + 1}`">
        <template #headerRightContent>
          <t-space size="small">
            <t-icon @click="removeEvent(index)" name="delete" />
          </t-space>
        </template>
        <template v-slot:default>
          <t-form label-align="left">
            <t-form-item label="事件类型：" name="name" >
              <t-select v-model="event.name" placeholder="请选择事件类型">
                <t-option v-for="option in eventTypeOptions" :key="option.value" :value="option.value" :label="option.label" />
              </t-select>
            </t-form-item>
            <t-form-item label="事件行为：" name="action" >
              <t-select v-model="event.action" placeholder="请选择事件行为">
                <t-option v-for="option in eventBehaviorOptions" :key="option.value" :value="option.value" :label="option.label" />
              </t-select>
            </t-form-item>
            <!-- 事件行为是设置属性 -->
            <t-form-item label="目标ID：" name="params"  v-if="event.action === 1">
              <t-input v-model="event.params" placeholder="请输入目标ID：" />
            </t-form-item>
            <div style="margin-top: 10px;display: flex;width: 100%;" v-if="event.action === 1">
              <span style="flex: 1;">key</span>
              <span style="flex: 1;">value</span>
              <span style="flex: 1;" @click="addKeyValuePair(index)">add</span>
            </div>
            <div v-if="event.action === 1" v-for="(pair, pairIndex) in event.keyValuePairs" :key="pairIndex" style="margin-top: 10px;display: flex;width: 100%;margin-bottom: 20px;">
              <t-select v-if="pair" v-model="pair.key" placeholder="请选择key类型" style="margin-right: 10px;flex: 1;width: 50px;">
                <t-option v-for="option in attributeTypeOptions" :key="option.value" :value="option.value" :label="option.label" />
              </t-select>
              <t-input v-if="pair" v-model="pair.value" placeholder="value" style="margin-right: 10px;flex: 1;width: 50px;" />
              <span v-if="pair" @click="removeKeyValuePair(index, pairIndex)" style="flex: 1;">remove</span>
            </div>
            <!-- 事件是执行js -->
            <t-form-item label="执行javascript：" name="value"  v-if="event.action === 5">
              <t-button @click="showModal(index)">...</t-button>
            </t-form-item>
            <t-form-item label="函数参数：" name="params"  v-if="event.action === 5">
              <t-input v-model="event.params" placeholder="请输入函数参数：" />
            </t-form-item>
            <!-- 事件是执行window函数 -->
            <t-form-item label="函数名称：" name="value"  v-if="event.action === 6">
              <t-input v-model="event.value" placeholder="请输入函数名称：" />
            </t-form-item>
            <t-form-item label="函数参数：" name="params"  v-if="event.action === 6">
              <t-input v-model="event.params" placeholder="请输入函数参数：" />
            </t-form-item>
            <!-- 事件行为是打开链接 -->
            <t-form-item label="链接地址：" name="value"  v-if="event.action === 0">
              <t-input v-model="event.value" placeholder="请输入链接地址：" />
            </t-form-item>
            <t-form-item label="打开方式：" name="params"  v-if="event.action === 0">
              <t-select v-model="event.params" placeholder="请选择打开方式">
                <t-option v-for="option in openWithOptions" :key="option.value" :value="option.value" :label="option.label" />
              </t-select>
            </t-form-item>
            <!-- 事件行为是执行动画 -->
            <t-form-item label="动画目标：" v-if="event.action === 2||event.action === 3||event.action === 4||event.action === 8||event.action === 9||event.action === 10"  name="value">
              <t-input v-model="event.value" placeholder="请输入动画目标：" />
            </t-form-item>
            <!-- 事件行为是打开弹窗 -->
            <t-form-item label="窗口标题：" name="value"  v-if="event.action === 14">
              <t-input v-model="event.value" placeholder="请输入窗口标题：" />
            </t-form-item>
            <t-form-item label="画面URL：" name="params"  v-if="event.action === 14">
              <t-input v-model="event.params" placeholder="请输入画面URL：" />
            </t-form-item>
            <t-form-item label="窗口宽度：" name="width"  v-if="event.action === 14 && event.extend">
              <t-input v-model="event.extend.width" placeholder="请输入画面URL：" />
            </t-form-item>
            <t-form-item label="窗口高度：" name="height"  v-if="event.action === 14 && event.extend">
              <t-input v-model="event.extend.height" placeholder="请输入画面URL：" />
            </t-form-item>
            <t-form-item label="窗口位置X：" name="x"  v-if="event.action === 14 && event.extend">
              <t-input v-model="event.extend.x" placeholder="请输入画面URL：" />
            </t-form-item>
            <t-form-item label="窗口位置Y：" name="y"  v-if="event.action === 14 && event.extend">
              <t-input v-model="event.extend.y" placeholder="请输入画面URL：" />
            </t-form-item>
            <t-form-item label="触发条件："  name="type" v-if="event.where">
              <t-select v-model="event.where.type" placeholder="请选择触发条件">
                <t-option v-for="option in typeOptions" :key="option.value" :value="option.value" :label="option.label" />
              </t-select>
            </t-form-item>
            <t-form-item label="属性名："  name="key" v-if="event.where?.type === 'comparison'">
              <t-select v-model="event.where.key" placeholder="请选择属性名">
                <t-option v-for="option in keyOptions" :key="option.value" :value="option.value" :label="option.label" />
              </t-select>
            </t-form-item>
            <t-form-item label="条件："  name="comparison" v-if="event.where?.type === 'comparison'">
              <t-select v-model="event.where.comparison" placeholder="请选择条件">
                <t-option v-for="option in comparisonOptions" :key="option.value" :value="option.value" :label="option.label" />
              </t-select>
            </t-form-item>
            <t-form-item label="属性值：" name="value" v-if="event.where?.type === 'comparison'">
              <t-input v-model="event.where.value" placeholder="请输入属性值：" />
            </t-form-item>
            <t-form-item label="高优先级判断：" v-if="event.where?.type === 'custom'">
              <t-button @click="showModal(index)">...</t-button>
            </t-form-item>
            
            <!-- 弹窗JS -->
            <CodeMirrorModal ref="codeMirrorModalRef" :visible="isModalVisible" :initialValue="initialValue" @confirm="handleConfirms" @cancel="handleCancels" />
            <t-button style="width: 100%;" @click="handleConfirm(index)">确认事件</t-button>
          </t-form>
        </template>
      </t-collapse-panel>
    </t-collapse>
  </t-space>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch,nextTick } from 'vue';
import { keyOptionsList, typeOptionsList,comparisonOptionsList,attributeTypeOptionsList,eventTypeOptionsList,eventBehaviorOptionsList,openWithOptionsList } from './event.ts';
import { useSelection } from '@/services/selections';
import CodeMirrorModal from '../CodeMirrorModal.vue';
const { selections } = useSelection();
const pen = ref<any>({});

onMounted(() => {
  getPen();
});

const getPen = () => {
  pen.value = selections.pen;
  if (pen.value.events) {
    events.value = pen.value.events;
  } 
  else {
    events.value = [];
  }
};

const codeMirrorModalRef = ref<InstanceType<typeof CodeMirrorModal> | null>(null);
const isModalVisible = ref(false);
const initialValue = ref('');

const receivedCode = ref({ value: '' });

const handleConfirms = (code: string) => {
  receivedCode.value.value = code;
  console.log('Received code:', receivedCode.value.value);
  isModalVisible.value = false;
};

const handleCancels = () => {
  console.log('Cancel event received');
  isModalVisible.value = false;
};

const currentItem = ref<string[]>([]);
const events = ref<Array<{ name: number | null; action: number | null; value: any; params: number | null;
  where?: {
    type?:any,
    key?:any,
    value?:any,
    comparison?:any,
    fnJs?:any,
  };
  extend?: { 
    width?: string, 
    height?: string, 
    x?: string, 
    y?: string 
  };keyValuePairs?:Array<{ key: string; value: string }>;

}>>([]);

// typeOptions有comparison关系运算，无是null，还有代码1是code1，2是code2再加个自定义代码
const typeOptions = typeOptionsList;

// keyOptions有文字、值、进度值、状态
const keyOptions = keyOptionsList;
 
const comparisonOptions = comparisonOptionsList;

const attributeTypeOptions = attributeTypeOptionsList;

const eventTypeOptions = eventTypeOptionsList;

const eventBehaviorOptions = eventBehaviorOptionsList;

const openWithOptions = openWithOptionsList;

// 监听选中不同图元
// @ts-ignore
const watcher = watch(() => selections.pen.id, getPen);

function addEvent() {
  events.value.push({ name: null, action: null, where: {}, value: null, params: null,extend: {},keyValuePairs: []});
}

// 新增属性key，value
const addKeyValuePair = (eventIndex: number) => {
  events.value[eventIndex].keyValuePairs?.push({ key: '', value: '' });
};

// 删除新增的属性key，value
const removeKeyValuePair = (eventIndex: number, pairIndex: number) => {
  events.value[eventIndex].keyValuePairs?.splice(pairIndex, 1);
};

const showModal = async(index: number) => {
  console.log('当前事件的值:', events.value[index].value);
  console.log('当前事件的值:', events.value[index].where?.fnJs);
  // console.log(codeMirrorModalRef.value[index]);
  
  // console.log('子组件暴露的方法:', codeMirrorModalRef.value[index].handleEnd);
  // 设置初始值和可见性
  if(events.value[index].where?.comparison === 'custom'){
    initialValue.value = events.value[index].where?.fnJs;
  }else{
    initialValue.value = events.value[index].value;
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

function removeEvent(index: number) {
  events.value.splice(index, 1);
}

function removeAllEvents() {
  events.value = [];
}

function handleChange() {
  console.log(events.value); // 处理事件数据
}
interface globalThis {
  [key: string]: any; // 允许任何字符串作为属性名
}

(globalThis as any).le5leFn= (pen: any,params: any) =>{
  console.log('当前图元：',pen,'参数：',params);
};
// 确认事件
function handleConfirm(event: any) {
  console.log(receivedCode.value.value);
  
  console.log(event);
  console.log(events.value);
  const keyValuePairs = events.value[event]?.keyValuePairs;
  if(events.value[event].where?.comparison === 'code1'){
    events.value[event].where.fnJs = 'return true';
  }else if(events.value[event].where?.comparison === 'code2'){
    events.value[event].where.fnJs = 'return false';
  }else{
    if (receivedCode.value.value && events.value[event].where) {
      events.value[event].where.fnJs = receivedCode.value.value;  
    }
  }
  if (events.value[event].action === 5) {
    events.value[event].value = '';
    if (receivedCode.value.value) {
      events.value[event].value = receivedCode.value.value;
      pen.value.events = events.value;
    }
  }else if(events.value[event].action === 1){
      if (keyValuePairs) {;
        console.log(events.value[event].value);
        
        events.value[event].value = {};
        keyValuePairs.forEach(pair => {
          if (pair.key && pair.value) {
            console.log(pair.key, pair.value);
            console.log(pair.key, pair.value);
            
            events.value[event].value[pair.key] = pair.value;

          }
        });
        // event.keyValuePairs = undefined; // 删除 keyValuePairs 属性
      }
    console.log(events.value);
    console.log(pen.value);
    pen.value.events=events.value;
  }else{
    pen.value.events=events.value;
  }
  
  
}
// 事件处理逻辑
// const handleEvent = (event: any) => {
//   if (event.name === 7 && event.action === 0) { // 单击事件且行为是打开链接
//     const url = event.url;
//     const openWith = event.openWith;
//     if (url) {
//       if (openWith === 0) {
//         window.open(url, '_blank');
//       } else if (openWith === 1) {
//         window.location.href = url;
//       }
//     }
//   }
// };

// 监听事件
// watch(events, (newEvents) => {
//   newEvents.forEach(event => {
//     if (event.name === 7 && event.action === 0) { // 单击事件且行为是打开链接
//       const element = document.querySelector(`[data-event-index="${events.value.indexOf(event)}"]`);
//       if (element) {
//         element.addEventListener('click', () => handleEvent(event));
//       }
//     }
//   });
// }, { deep: true });
onUnmounted(() => {
  watcher();
});
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
.t-collapse-panel__wrapper .t-collapse-panel__content{
  padding: 10px !important;
}
.t-form__label {
  font-size: 12px !important;
}
</style>
