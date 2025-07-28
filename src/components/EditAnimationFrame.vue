<template>
  <div class="props-panel">
    <t-form label-align="left">
      <div class="header">
        <h3>编辑帧 {{ index + 1 }}</h3>
        <t-button @click="deleteFrame">删除</t-button>
      </div>
      <!-- 通用表单项渲染 -->
      <t-form-item 
        v-for="item in formItems" 
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
        <!-- 输入框类型 -->
        <t-input-number
          v-if="item.type === 'number'"
          theme="column"
          v-model="localFrame[item.name]"
          :placeholder="item.placeholder"
          @input="autoSave"
        />
        
        <!-- 选择器类型 -->
        <t-select
          v-else-if="item.type === 'select'"
          v-model="localFrame[item.name]"
          :options="item.options"
          option-value="value"
          option-label="label"
          class="t-input--auto-width"
          @change="autoSave"
        />
        
        <!-- 颜色选择器 -->
        <t-color-picker
          v-else-if="item.type === 'color'"
          class="w-full"
          v-model="localFrame[item.name]"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="autoSave"
        />
        
        <!-- 开关类型 -->
        <t-switch
          v-else-if="item.type === 'switch'"
          v-model="localFrame[item.name]"
          @change="autoSave"
        />
      </t-form-item>
      
      <!-- 文本内容单独处理 -->
      <t-form-item label="文本内容" name="text">
        <t-input v-model="localFrame.text" @input="autoSave" />
      </t-form-item>
      
      <!-- 隐藏 -->
      <div style="display: none">
        <!-- 图标相关字段 -->
        <t-form-item v-for="item in hiddenIconItems" :key="item.name">
          <component
            :is="item.component"
            v-model="localFrame[item.name]"
            v-bind="item.props"
            @input="autoSave"
          />
        </t-form-item>
        
        <!-- 图片字段 -->
        <t-form-item>
          <t-input v-model="localFrame.image" @input="autoSave"/>
        </t-form-item>
      </div>
    </t-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { 
  dashs, strokeTypes, bkTypes, fontFamilys, 
  fontStyles, textAligns, fontWeights, 
  textBaselines, whiteSpaces, ellipsiss,
  iconAligns
} from '@/utils/animateUtil';

const props = defineProps({
  frame: { type: Object, default: () => ({}) },
  index: { type: Number, required: true }
});

const emit = defineEmits(['updateFrame', 'deleteFrame']);

//  添加隐藏的图标字段配置
const hiddenIconItems = [
  { name: 'icon', component: 't-input', props: {} },
  { name: 'iconColor', component: 't-color-picker', props: { 
    class: 'w-full',
    'show-primary-color-preview': false,
    format: 'CSS',
    'color-modes': ['monochrome']
  }},
  { name: 'iconSize', component: 't-input', props: {} },
  { name: 'iconAlign', component: 't-select', props: { 
    options: iconAligns,
    'option-value': 'value',
    'option-label': 'label',
    class: 't-input--auto-width'
  }},
  { name: 'iconLeft', component: 't-input', props: {} },
  { name: 'iconTop', component: 't-input', props: {} },
];

// 统一表单项配置
const formItems = [
  { label: '时长', name: 'duration', type: 'number' },
  { label: '偏移x', name: 'x', type: 'number', placeholder: 'px' },
  { label: '偏移y', name: 'y', type: 'number', placeholder: 'px' },
  { label: '缩放', name: 'scale', type: 'number' },
  { label: '圆角', name: 'borderRadius', type: 'number', placeholder: '<1 比例' },
  { label: '旋转', name: 'rotate', type: 'number', placeholder: '°' },
  { label: '进度', name: 'progress', type: 'number' },
  { label: '进度颜色', name: 'progressColor', type: 'color' },
  { label: '水平翻转', name: 'flipX', type: 'switch' },
  { label: '垂直翻转', name: 'flipY', type: 'switch' },
  { label: '线条样式', name: 'dash', type: 'select', options: dashs },
  { label: '线条宽度', name: 'lineWidth', type: 'number', placeholder: 'px' },
  { label: '线条偏移', name: 'lineDashOffset', type: 'number', placeholder: 'px' },
  { label: '透明度', name: 'globalAlpha', type: 'number', placeholder: '0-1' },
  { label: '显示', name: 'visible', type: 'switch' },
  { label: '线条渐变', name: 'strokeType', type: 'select', options: strokeTypes },
  { label: '线条渐变色', name: 'lineGradientColors', type: 'color', condition: (frame: Record<string, any>) => frame.strokeType === 1 },
  { label: '颜色', name: 'color', type: 'color', condition: (frame: Record<string, any>) => frame.strokeType === 0 },
  { label: '背景', name: 'bkType', type: 'select', options: bkTypes },
  { label: '背景颜色', name: 'background', type: 'color' },
  { label: '阴影颜色', name: 'shadowColor', type: 'color' },
  { label: '阴影模糊', name: 'shadowBlur', type: 'number' },
  { label: '阴影 X 偏移', name: 'shadowOffsetX', type: 'number' },
  { label: '阴影 Y 偏移', name: 'shadowOffsetY', type: 'number' },
  { label: '文字阴影', name: 'textHasShadow', type: 'switch' },
  { label: '字体名称', name: 'fontFamily', type: 'select', options: fontFamilys },
  { label: '字体大小', name: 'fontSize', type: 'number' },
  { label: '文字颜色', name: 'textColor', type: 'color' },
  { label: '浮动文字颜色', name: 'hoverTextColor', type: 'color' },
  { label: '选中文字颜色', name: 'activeTextColor', type: 'color' },
  { label: '文字背景', name: 'textBackground', type: 'color' },
  { label: '倾斜', name: 'fontStyle', type: 'select', options: fontStyles },
  { label: '加粗', name: 'fontWeight', type: 'select', options: fontWeights },
  { label: '水平对齐', name: 'textAlign', type: 'select', options: textAligns },
  { label: '垂直对齐', name: 'textBaseline', type: 'select', options: textBaselines },
  { label: '行高', name: 'lineHeight', type: 'number' },
  { label: '换行', name: 'whiteSpace', type: 'select', options: whiteSpaces },
  { label: '文字宽度', name: 'textWidth', type: 'number' },
  { label: '文字高度', name: 'textHeight', type: 'number' },
  { label: '水平偏移', name: 'textLeft', type: 'number' },
  { label: '垂直偏移', name: 'textTop', type: 'number' },
  { label: '超出省略', name: 'ellipsis', type: 'select', options: ellipsiss },
  { label: '宽度', name: 'iconWidth', type: 'number' },
  { label: '高度', name: 'iconHeight', type: 'number' },
];

const localFrame = ref({ ...props.frame });

watch(() => props.frame, (newFrame) => {
  localFrame.value = { ...newFrame };
}, { deep: true });

watch(localFrame, () => autoSave(), { deep: true });

const autoSave = () => emit('updateFrame', localFrame.value, props.index);
const deleteFrame = () => emit('deleteFrame', props.index);
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
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  }
}
</style>