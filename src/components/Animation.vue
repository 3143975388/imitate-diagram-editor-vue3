<template>
  <div class="props-panel">
    <t-form label-align="left" v-if="pen">
      <!-- // 动画类型：默认 - 水流； 1 - （水珠流动）虚线段；2 - 圆点 3. 箭头 4.水滴 -->
      <t-form-item label="动画效果" v-if="nameControl" name="lineAnimateType">
        <t-select v-model="pen.lineAnimateType" @change="changeValue('lineAnimateType')">
          <t-option :key="1" :value="1" label="水珠流动"></t-option>
          <t-option :key="2" :value="2" label="圆点"></t-option>
          <t-option :key="3" :value="3" label="箭头"></t-option>
          <t-option :key="4" :value="4" label="水滴"></t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="动画效果" v-if="!nameControl" name="animateType" >
        <t-select v-model="pen.animateType" @change="changeValue('animateType')">
          <t-option v-for="option in animateTypeList" :key="option.animateType" :value="option.animateType" :label="option.name"></t-option>
        </t-select>
      </t-form-item>
      <span v-if="!nameControl && pen.animateType === 'custom'" class="edit" @click="isDrawerVisible = true">编辑</span>
      <t-drawer v-model:visible="isDrawerVisible" :on-confirm="onClickConfirm" >
        <template #header>节点动画</template>
        <t-button @click="addAnimate">新增  动画帧</t-button>
        <t-collapse v-model="currentItem" expand-mutex @change="handlePanelChange">
          <t-collapse-panel 
            v-for="(frame, index) in animationFrames" 
            :key="index" 
            :value="index" 
            :header="`动画帧${index + 1}`"
          >
            <EditAnimationFrame :frame="frame" :index="index" @updateFrame="handleFrameUpdate" @deleteFrame="handleDeleteFrame" />
          </t-collapse-panel>
        </t-collapse>
      </t-drawer>
      <!-- showDuration时长 -->
      <!-- animateType动画效果 -->
      <t-form-item label="动画速度" v-if="nameControl" name="animateSpan">
        <t-input-number v-model="pen.animateSpan" @change="changeValue('animateSpan')" />
      </t-form-item>
      <t-form-item label="动画颜色" name="animateColor">
        <t-color-picker
          class="w-full"
          v-model="pen.animateColor"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="changeValue('animateColor')"
        />
      </t-form-item>
      <t-form-item label="动画线宽" name="animateLineWidth">
        <t-input-number v-model="pen.animateLineWidth" @change="changeValue('animateLineWidth')" />
      </t-form-item>
      <t-form-item label="反向播放" name="animateReverse">
        <t-switch v-model="pen.animateReverse" @change="changeValue('animateReverse')" />
      </t-form-item>
      <t-form-item label="自动播放" name="autoPlay">
        <t-switch v-model="pen.autoPlay" @change="changeValue('autoPlay')" />
      </t-form-item>
      <t-form-item label="动画播放次数" name="animateCycle">
        <t-input-number v-model="pen.animateCycle" @change="changeValue('animateCycle')" />
      </t-form-item>
      
      <t-button style="width: 80px;" @click="controlAnimate('play')">播放</t-button>
      <t-button style="width: 80px;margin-left: 12px;" @click="controlAnimate('pause')">暂停</t-button>
      <t-button style="width: 80px;margin-left: 12px;" @click="controlAnimate('stop')">停止</t-button>
    </t-form>
  </div>
</template>

<script lang="ts" setup>
import { CollapseProps } from 'tdesign-vue-next';

import { onMounted, onUnmounted, ref, watch } from 'vue';
import EditAnimationFrame from './EditAnimationFrame.vue';
import { animateType } from '@/utils/animateUtil.ts';
import { useSelection } from '@/services/selections';
const currentItem = ref<number | null>(null);
const animationFrames = ref<Record<string, any>[]>([]);// 动画帧
const handlePanelChange: CollapseProps['onChange'] = (val) => {
  console.log(val);
};
const nameControl = ref(false);
const isDrawerVisible = ref(false);
const { selections } = useSelection();
const animateTypeList = animateType;
const pen = ref<any>({
  autoPlay: true,
});
// 位置数据。当前版本位置需要动态计算获取
const rect = ref<any>();

onMounted(() => {
  getPen();
});

// 处理来自 EditAnimationFrame 的更新事件
const handleFrameUpdate = (updatedFrameData: Record<string, any>, frameIndex: number) => {
  // 根据接收到的索引更新对应帧的数据
  if (frameIndex >= 0 && frameIndex < animationFrames.value.length) {
    animationFrames.value[frameIndex] = updatedFrameData;
  } else {
    console.warn('无效的帧索引:', frameIndex);
  }
};

// 删除事件处理函数
const handleDeleteFrame = (index: number) => {
  animationFrames.value.splice(index, 1);
  // 更新 currentItem，以确保删除后仍然展开最后一个面板
  if (currentItem.value === index) {
    currentItem.value = Math.max(0, index - 1);
  }
};

const getPen = () => {
  pen.value = selections.pen;
  animationFrames.value = selections.pen?.frames ?? [];
  if(pen.value.name == 'line'){
    nameControl.value = true;
  }else{
    nameControl.value = false;
  }
  if (pen.value.lineDash == undefined) {
    pen.value.lineDash = lineDashs[0];
  }
  if (pen.value.globalAlpha == undefined) {
    pen.value.globalAlpha = 1;
  }
  
  rect.value = meta2d.getPenRect(pen.value);
};

// 监听选中不同图元
// @ts-ignore
const watcher = watch(() => selections.pen.id, getPen);

const lineDashs = [undefined, [5, 5]];

const changeValue = (prop: string) => {
  const v: any = { id: pen.value.id };
  
  v[prop] = pen.value[prop];
  
  // 处理虚线样式
  if (prop === 'dash') {
    v.lineDash = lineDashs[v[prop]];
  }

  // 配置动画参数
  if (prop === 'lineAnimateType') {
  }

  // 如果animateType和animateTypeList的animateType相同则里面的frames，showDuration也要放进v里面
  if(v.animateType && v.animateType === 'custom'){
    meta2d.setValue(v, { render: true });
    // 强制刷新画布（某些情况需要）
    setTimeout(() => meta2d.render(), 100);
  }else if (v.animateType && animateTypeList) {
    animateTypeList.forEach((item: any) => {
      if (item.animateType === v.animateType) {
        v.frames = item.frames;
        v.showDuration = item.showDuration;
        meta2d.setValue(v, { render: true });
        // 强制刷新画布（某些情况需要）
        setTimeout(() => meta2d.render(), 100);
      }
    });
  }else{
      meta2d.setValue(v, { render: true });
      // 强制刷新画布（某些情况需要）
      setTimeout(() => meta2d.render(), 100);
  }
  
};

const onClickConfirm = () => {
  isDrawerVisible.value = false;
  // 将animationFrames.value的duration加在一起是先转为number再相加最后是showDuration
  const showDuration = animationFrames.value.reduce((acc: number, curr: any) => acc + Number(curr.duration), 0);
  // 将animationFrames.value的duration加在一起是delay
  // 确认时将动画帧数据应用到当前图元
  const v: any = { id: pen.value.id };
  v.frames = animationFrames.value;
  v.showDuration = showDuration;
  meta2d.setValue(v, { render: true });
};
// 新增动画帧
const addAnimate = () => {
  animationFrames.value.push({});
};

const controlAnimate = (action: 'play' | 'pause' | 'stop') => {
  console.log(pen.value.id,action);
  if(action === 'play') {
    meta2d.startAnimate(pen.value.id);
  } else if (action === 'pause') {
    meta2d.pauseAnimate(pen.value.id);
  } else if (action === 'stop') {
    meta2d.stopAnimate(pen.value.id);
  }
};

onUnmounted(() => {
  watcher();
});
</script>
<style lang="postcss" scoped>
.props-panel {
  :deep(.t-form) {
    .t-form__item {
      margin-bottom: 8px;
    }
    .t-form__label {
      padding-right: 8px;
    }

    .t-divider {
      margin: 12px 0;
    }

    .t-input--auto-width {
      width: 100%;
    }

    .t-space {
      gap: 4px;
    }
  }
}
.edit{
  color: rgb(92, 92, 228);
  margin-left: 100px;
  cursor: pointer;
}
</style>
