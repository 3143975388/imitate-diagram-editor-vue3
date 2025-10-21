<template>
  <div class="props-panel">
    <t-form label-align="left" v-if="pen">
      <t-form-item label="X" name="x">
        <t-input-number v-model="rect.x" theme="column" @change="changeRect('x')" />
      </t-form-item>
      <t-form-item label="Y" name="y">
        <t-input-number v-model="rect.y" theme="column" @change="changeRect('y')" />
      </t-form-item>
      <t-form-item label="宽" name="width">
        <t-input-number v-model="rect.width" theme="column" @change="changeRect('width')" />
      </t-form-item>
      <t-form-item label="高" name="height">
        <t-input-number v-model="rect.height" theme="column" @change="changeRect('height')" />
      </t-form-item>
      <t-form-item label="锁定宽高比" name="checked">
        <t-switch v-model="pen.checked" @change="changeValue('checked')" />
      </t-form-item>
      <t-form-item label="圆角" name="imageRadius">
        <t-input-number v-model="pen.imageRadius" theme="column" @change="changeValue('imageRadius')" />
      </t-form-item>
      <t-form-item label="旋转" name="rotate">
        <t-input-number v-model="pen.rotate" theme="column" @change="changeValue('rotate')" />
      </t-form-item>
      <t-form-item label="内边距-左" name="paddingLeft">
        <t-input-number v-model="pen.paddingLeft" theme="column" @change="changeValue('paddingLeft')"  />
      </t-form-item>
      <t-form-item label="内边距-右" name="paddingRight">
        <t-input-number v-model="pen.paddingRight" theme="column" @change="changeValue('paddingRight')" />
      </t-form-item>
      <t-form-item label="内边距-上" name="paddingTop">
        <t-input-number v-model="pen.paddingTop" theme="column" @change="changeValue('paddingTop')" />
      </t-form-item>
      <t-form-item label="内边距-下" name="paddingBottom">
        <t-input-number v-model="pen.paddingBottom" theme="column" @change="changeValue('paddingBottom')" />
      </t-form-item>
      <t-form-item label="进度" name="progress">
        <t-input-number v-model="pen.progress" theme="column" @change="changeValue('progress')" />
      </t-form-item>
      <t-form-item label="进度颜色" name="progressColor">
        <t-color-picker
          class="w-full"
          v-model="pen.progressColor"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="changeValue('progressColor')"
        />
      </t-form-item>
      <t-form-item label="垂直进度" name="verticalProgress">
        <t-switch v-model="pen.verticalProgress" theme="column" @change="changeValue('verticalProgress')" />
      </t-form-item>
      <t-form-item label="反向进度" name="reverseProgress">
        <t-switch v-model="pen.reverseProgress" theme="column" @change="changeValue('reverseProgress')" />
      </t-form-item>
      <t-form-item label="水平翻转" name="flipX">
        <t-switch v-model="pen.flipX" @change="changeValue('flipX')" />
      </t-form-item>
      <t-form-item label="垂直翻转" name="flipY">
        <t-switch v-model="pen.flipY" @change="changeValue('flipY')" />
      </t-form-item>
      <t-form-item label="输入框" name="input">
        <t-switch v-model="pen.input" @change="changeValue('input')" />
      </t-form-item>
      <t-form-item label="背景" name="background">
        <t-color-picker
          class="w-full"
          v-model="pen.background"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="changeValue('background')"
        />
      </t-form-item>
      
      <t-divider />

      <t-divider />
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
          v-model="pen[item.name]"
          @change="changeValue(item.name)"
        />
        
        <!-- 选择器类型 -->
        <t-select
          v-else-if="item.type === 'select'"
          v-model="pen[item.name]"
          :options="item.options"
          option-value="value"
          option-label="label"
          class="t-input--auto-width"
          @change="changeValue(item.name)"
        />
        
        <!-- 颜色选择器 -->
        <t-color-picker
          v-else-if="item.type === 'color'"
          class="w-full"
          v-model="pen[item.name]"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="changeValue(item.name)"
        />
        
        <!-- 开关类型 -->
        <t-switch
          v-else-if="item.type === 'switch'"
          v-model="pen[item.name]"
          @change="changeValue(item.name)"
        />
      </t-form-item>
      
      <!-- 文本内容单独处理 -->
      <t-form-item label="文本内容" name="text">
        <t-input v-model="pen.text" @change="changeValue('text')" />
      </t-form-item>
      <t-divider />

      <t-divider />
      <!-- 线条样式 -->
      <t-form-item label="线条样式" name="dash">
        <t-select v-model="pen.dash" @change="changeValue('dash')">
          <t-option :key="0" :value="0" label="实线"></t-option>
          <t-option :key="1" :value="1" label="虚线"></t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="颜色" name="color">
        <t-color-picker
          class="w-full"
          v-model="pen.color"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="changeValue('color')"
        />
      </t-form-item>
      <t-form-item label="浮动颜色" name="hoverColor">
        <t-color-picker
          class="w-full"
          v-model="pen.hoverColor"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="changeValue('hoverColor')"
        />
      </t-form-item>
      <t-form-item label="选中颜色" name="activeColor">
        <t-color-picker
          class="w-full"
          v-model="pen.activeColor"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="changeValue('activeColor')"
        />
      </t-form-item>
      <t-form-item label="线条宽度" name="lineWidth">
        <t-input-number v-model="pen.lineWidth" theme="column" @change="changeValue('lineWidth')" />
      </t-form-item>
      <t-form-item label="边框颜色" name="borderColor">
        <t-color-picker
          class="w-full"
          v-model="pen.borderColor"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="changeValue('borderColor')"
        />
      </t-form-item>
      <t-form-item label="边框宽度" name="borderWidth">
        <t-input-number v-model="pen.borderWidth" theme="column" @change="changeValue('borderWidth')" />
      </t-form-item>
      <t-form-item label="透明度" name="globalAlpha">
        <t-input-number v-model="pen.globalAlpha" theme="column" @change="changeValue('globalAlpha')" />
      </t-form-item>
      <t-form-item label="锚点颜色" name="anchorColor">
        <t-color-picker
          class="w-full"
          v-model="pen.anchorColor"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="changeValue('anchorColor')"
        />
      </t-form-item>
      <t-form-item label="阴影颜色" name="shadowColor">
        <t-color-picker
          class="w-full"
          v-model="pen.shadowColor"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="changeValue('shadowColor')"
        />
      </t-form-item>
      <t-form-item label="阴影模糊度" name="shadowBlur">
        <t-input-number v-model="pen.shadowBlur" theme="column" @change="changeValue('shadowBlur')" />
      </t-form-item>
      <t-form-item label="阴影X偏移度" name="shadowOffsetX">
        <t-input-number v-model="pen.shadowOffsetX" theme="column" @change="changeValue('shadowOffsetX')" />
      </t-form-item>
      <t-form-item label="阴影Y偏移度" name="shadowOffsetY">
        <t-input-number v-model="pen.shadowOffsetY" theme="column" @change="changeValue('shadowOffsetY')" />
      </t-form-item>
      <t-form-item label="文字阴影" name="textHasShadow">
        <t-switch v-model="pen.textHasShadow" theme="column" @change="changeValue('textHasShadow')" />
      </t-form-item>
      <t-form-item label="浮动背景颜色" name="hoverBackground">
        <t-color-picker
          class="w-full"
          v-model="pen.hoverBackground"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="changeValue('hoverBackground')"
        />
      </t-form-item>
      <t-form-item label="选中背景颜色" name="activeBackground">
        <t-color-picker
          class="w-full"
          v-model="pen.activeBackground"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="changeValue('activeBackground')"
        />
      </t-form-item>
      <t-form-item label="圆角" name="borderRadius">
        <t-input-number
          :min="0"
          :max="1"
          :step="0.01"
          v-model="pen.borderRadius"
          @change="changeValue('borderRadius')"
        />
      </t-form-item>
      <t-form-item label="不透明度" name="globalAlpha">
        <t-slider
          v-model="pen.globalAlpha"
          :min="0"
          :max="1"
          :step="0.01"
          @change="changeValue('globalAlpha')"
        />
        <span class="ml-16" style="width: 50px; line-height: 30px">
          {{ pen.globalAlpha }}
        </span>
      </t-form-item>

      <t-divider />

      <t-divider />

      <t-form-item label="文字水平对齐" name="textAlign">
        <t-select v-model="pen.textAlign" @change="changeValue('textAlign')">
          <t-option key="left" value="left" label="左对齐"></t-option>
          <t-option key="center" value="center" label="居中"></t-option>
          <t-option key="right" value="right" label="右对齐"></t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="文字垂直对齐" name="textBaseline">
        <t-select
          v-model="pen.textBaseline"
          @change="changeValue('textBaseline')"
        >
          <t-option key="top" value="top" label="顶部对齐"></t-option>
          <t-option key="middle" value="middle" label="居中"></t-option>
          <t-option key="bottom" value="bottom" label="底部对齐"></t-option>
        </t-select>
      </t-form-item>

      <t-divider />

      <t-space>
        <t-button @click="top">置顶</t-button>
        <t-button @click="bottom">置底</t-button>
        <t-button @click="up">上一层</t-button>
        <t-button @click="down">下一层</t-button>
      </t-space>
    </t-form>
  </div>
</template>

<script lang="ts" setup>
import { CollapseProps } from 'tdesign-vue-next';

import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useSelection } from '@/services/selections';
import {  fontFamilys, 
  fontStyles, textAligns, fontWeights, 
  textBaselines, whiteSpaces, ellipsiss,
} from '@/utils/animateUtil';
const currentItem = ref([]);
const handlePanelChange: CollapseProps['onChange'] = (val) => {
  console.log(val);
};
const { selections } = useSelection();

const pen = ref<any>();
// 位置数据。当前版本位置需要动态计算获取
const rect = ref<any>();

// 统一表单项配置
const formItems = [
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
  { label: '隐藏文本', name: 'hiddenText', type: 'switch'},
  { label: '保留小数', name: 'keepDecimal', type: 'number'},
  { label: '下划线', name: 'textDecoration', type: 'switch'},
  { label: '下划线颜色', name: 'textDecorationColor', type: 'color'},
  { label: '下划线样式', name: 'decorationDash', type: 'color'},//还没弄好
  { label: '删除线', name: 'textStrickout', type: 'switch'},
  { label: '删除颜色', name: 'textStrickoutColor', type: 'color'},
  { label: '删除线样式', name: 'strickoutDash', type: 'switch'},//还没弄好
];

onMounted(() => {
  getPen();
});

const getPen = () => {
  pen.value = selections.pen;

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
  console.log(pen.value[prop]);
  console.log(prop);
  
  const v: any = { id: pen.value.id };
  // if (prop === 'lineName') {
  //   v.type=1;
  //   v.lineName = pen.value[prop];
  //   v.name = 'line';
  // }
  v[prop] = pen.value[prop];
  if (prop === 'dash') {
    v.lineDash = lineDashs[v[prop]];
  }
  if (prop === 'input'){
    v.placeholder = '请输入';
  }
  console.log(v);
  
  meta2d.setValue(v, { render: true });
};

const changeRect = (prop: string) => {
  const v: any = { id: pen.value.id };
  v[prop] = rect.value[prop];
  meta2d.setValue(v, { render: true });
};

const top = () => {
  meta2d.top();
  meta2d.render();
};
const bottom = () => {
  meta2d.bottom();
  meta2d.render();
};
const up = () => {
  meta2d.up();
  meta2d.render();
};
const down = () => {
  meta2d.down();
  meta2d.render();
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
  .t-input-number.t-is-controls-right{
    width: 100%;
  }
}
</style>
