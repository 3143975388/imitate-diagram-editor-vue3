<template>
  <div class="contextmenu" ref="ctxMenu" tabindex="-1" @blur="ctxMenuClose">
    <div class="ctx_item" v-show="isPens" @click="changeCoverage('top')">置顶</div>
    <div class="ctx_item" v-show="isPens" @click="changeCoverage('bottom')">置底</div>
    <div class="ctx_item" v-show="isPens" @click="changeCoverage('up')">上一图层</div>
    <div class="ctx_item" v-show="isPens" @click="changeCoverage('down')">下一图层</div>
    <div class="ctx_item" v-if="isPens && !lockState || (!activePens[0]?.locked || activePens[0].locked === 0)" @click="lock('lock')">锁定</div>
    <div class="ctx_item" v-if="isPens && lockState || activePens[0]?.locked == 2" @click="lock('unlock')">解锁</div>
    <div class="ctx_item" v-show="isPens" @click="deletePens">删除</div>
    <div class="ctx_item" v-show="isPens && !isCombined && activePens[0]?.name !== 'combine'" @click="combination('combine')">组合</div>
    <div class="ctx_item" v-show="isPens && !isCombined && activePens[0]?.name !== 'combine'" @click="combination('combineAsState')">组合成状态</div>
    <div class="ctx_item" v-show="isPens && isCombined || activePens[0]?.name === 'combine'" @click="combination('uncombine')">取消组合</div>
    <div class="ctx_item" v-show="isPens" @click="copy">复制</div>
    <div class="ctx_item" @click="paste">粘贴</div>
  </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useEventbus} from "@/utils/useEventbus.ts";
let isPens = ref(false)
let ctxMenu = ref()
const lockState = ref(false);
const isCombined = ref(false); 

let activePens: any[] = []
const pens = ref<any[]>([]);
// 设置contextmenu的初始坐标
let menuPos = reactive({
  top:-9999,
  left:-9999,
  visible:false
})


// contextmenu计算属性，用于将menupos数据加工后传入contextmenu的css样式
const calcMenuPos = computed(()=>{
  return {
    top:menuPos.top+"px",
    left:menuPos.left+"px",
    visible:menuPos.visible?"visible":"hidden"
  }
})

// 全局事件总线
const eventBus = useEventbus()

// 监听meta2d的load事件，等待meta2d初始化完成
eventBus.customOn('load',()=>{

// 阻止系统默认菜单栏，并聚焦到我们的contextmenu组件
  window.addEventListener('contextmenu',(e)=>{
    e.preventDefault()
    ctxMenu.value.focus()
  })
  
  // 监听meta2d的contextmenu事件，弹出contextmenu组件
  meta2d.on('contextmenu',({e})=>{
    menuPos.top = e.clientY
    menuPos.left = e.clientX
    menuPos.visible = true
    ctxMenu.value.focus()
  })
  
  // 赋值activepens
  meta2d.on("active",(pens)=>{
    console.log("active",pens)
    if(pens.length>0){
      activePens = reactive(pens)
      console.log("activePEns",activePens)
      isPens.value = true
    }else {
      isPens.value = false
      activePens = []
    }
  })
  meta2d.on('inactive',()=>{
    isPens.value = false
  })
})

enum CanvasLayer{
  CanvasTemplate = 1, //模版层   
  CanvasImageBottom, //下层图片层
  CanvasMain, //主画布层
  CanvasImage //上层图片层
}

// 调用meta2d相关API
function changeCoverage(pos: 'top' | 'bottom' | 'up' | 'down') {
  console.log(meta2d.store.data.pens);
  switch (pos) {
    case "top":
      activePens.forEach(pen => {
        // 找到pen.id和pens里面的id相等的pen，并将其移动到数组末尾，并添加pen.canvasLayer = CanvasLayer.CanvasImage;
        meta2d.setValue({ id: pen.id, zIndex: CanvasLayer.CanvasImage,canvasLayer: CanvasLayer.CanvasImage }, { render: true });
        // 重新修改meta2d的pens数组的排序根据id查index
        let index = meta2d.store.data.pens.findIndex(item => item.id === pen.id);
        if (index > -1){
          meta2d.store.data.pens.splice(index, 1);
          meta2d.store.data.pens.push(pen);
          console.log("移动到末尾",meta2d.store.data.pens);
          
        }
      });
      break;
    case "bottom":
      activePens.forEach(pen => {
        // 找到pen.id和pens里面的id相等的pen，并将其移动到数组最开头，并添加pen.canvasLayer = CanvasLayer.CanvasImage;
        meta2d.setValue({ id: pen.id, zIndex: CanvasLayer.CanvasImageBottom,canvasLayer: CanvasLayer.CanvasImageBottom }, { render: true });
        // 重新修改meta2d的pens数组的排序根据id查index
        let index = meta2d.store.data.pens.findIndex(item => item.id === pen.id);
        if (index > -1){
          meta2d.store.data.pens.splice(index, 1);
          meta2d.store.data.pens.unshift(pen);
          console.log("移动到开头",meta2d.store.data.pens);
        }
      });
      break;
    case "up":
      activePens.forEach(pen => {
        // 找到pen.id和pens里面的id相等的pen，并将其移动到上一层，并添加pen.canvasLayer = CanvasLayer.CanvasMain;
        meta2d.setValue({ id: pen.id, zIndex: CanvasLayer.CanvasMain,canvasLayer: CanvasLayer.CanvasMain }, { render: true });
        // 重新修改meta2d的pens数组的排序根据id查index
        let index = meta2d.store.data.pens.findIndex(item => item.id === pen.id);
        if (index > -1){
          meta2d.store.data.pens.splice(index, 1);
          meta2d.store.data.pens.splice(index + 1, 0, pen);
          console.log("移动到上一层",meta2d.store.data.pens);
        }
      });
      break;
    case "down":
      activePens.forEach(pen => {
        // 找到pen.id和pens里面的id相等的pen，并将其移动到下一层，并添加pen.canvasLayer = CanvasLayer.CanvasMain;
        meta2d.setValue({ id: pen.id, zIndex: CanvasLayer.CanvasMain,canvasLayer: CanvasLayer.CanvasMain }, { render: true });
        // 重新修改meta2d的pens数组的排序根据id查index
        let index = meta2d.store.data.pens.findIndex(item => item.id === pen.id);
        if (index > -1){
          meta2d.store.data.pens.splice(index, 1);
          meta2d.store.data.pens.splice(index - 1, 0, pen);
          console.log("移动到下一层",meta2d.store.data.pens);
        }
      });
      break;
  }
  
  // 重新渲染
  meta2d.render();
  ctxMenu.value?.blur();
}

// 右键菜单锁定
function lock(state: 'lock' | 'unlock') {
  if (state === 'lock') {
    activePens.forEach(pen => {
      meta2d.setValue({ id: pen.id, locked: 2 }, { render: true })
    });
    lockState.value = true; // 修改锁定状态
  }else {
    // 解锁
    activePens.forEach(pen => {
      meta2d.setValue({ id: pen.id, locked: 0 }, { render: true })
    });
    lockState.value = false; // 修改解锁状态
  }
  ctxMenu.value.blur()
}

function paste() {
  meta2d.paste()
  ctxMenu.value.blur()
}
function copy() {
  meta2d.copy(activePens)
  ctxMenu.value.blur()
}

function ctxMenuClose() {
  menuPos.visible = false
}

// 组合功能
function combination(action: 'combine' | 'combineAsState' | 'uncombine') {
  if (action === 'combine' && activePens && activePens.length > 0) {
    meta2d.combine(activePens);
    isCombined.value = true; 
  } else if (action === 'combineAsState' && activePens && activePens.length > 0) {
    meta2d.combine(activePens,0);
    isCombined.value = true; 
  } else if (action === 'uncombine' && activePens && activePens.length > 0) {
    activePens.forEach(pen => {
      meta2d.uncombine(pen);
    })   
    isCombined.value = false; 
  }
  meta2d.render(); // 重新渲染
  ctxMenu.value.blur();
}

// 删除
function deletePens() {
  if (activePens && activePens.length > 0) {
    meta2d.delete(activePens);
    // activePens.forEach(pen => {
    //   meta2d.delete(pen);
    // });
    meta2d.render(); // 重新渲染
    ctxMenu.value.blur();
  }
}

onMounted(() => {
  const meta2dStr = localStorage.getItem('meta2d');
  if (meta2dStr) {
    try {
      const meta2d = JSON.parse(meta2dStr);
      pens.value = meta2d.pens || [];
    } catch (e) {
      pens.value = [];
      console.error('meta2d:', e);
    }
  } else {
    pens.value = [];
  }
  console.log(pens.value);
})
</script>

<style scoped>

.contextmenu {
  padding: 6px;
  position: absolute;
  top: v-bind("calcMenuPos.top");
  left:v-bind("calcMenuPos.left");
  visibility: v-bind("calcMenuPos.visible");
  background-color: #fff;
  max-height: 5000px;
  width: 180px;
  z-index: 999;
  border-radius: 10px;
}
.ctx_item{
  width: 100%;
  padding: 10px;
  cursor: pointer;
  transition: background-color .5s ease;
}
.ctx_item:hover{
  background-color: #eeeeee;
}
</style>

