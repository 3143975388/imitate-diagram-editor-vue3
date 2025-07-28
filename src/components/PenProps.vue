<template>
  <div class="props-panel">
    <t-form label-align="left" v-if="pen">
      <t-form-item label="X" name="x">
        <t-input-number v-model="rect.x" @change="changeRect('x')" />
      </t-form-item>
      <t-form-item label="Y" name="y">
        <t-input-number v-model="rect.y" @change="changeRect('y')" />
      </t-form-item>
      <t-form-item label="宽" name="width">
        <t-input-number v-model="rect.width" @change="changeRect('width')" />
      </t-form-item>
      <t-form-item label="高" name="height">
        <t-input-number v-model="rect.height" @change="changeRect('height')" />
      </t-form-item>
      <t-form-item label="锁定宽高比" name="checked">
        <t-switch v-model="pen.checked" @change="changeValue('checked')" />
      </t-form-item>
      <t-form-item label="圆角" name="imageRadius">
        <t-input-number v-model="rect.imageRadius" @change="changeRect('imageRadius')" />
      </t-form-item>
      <t-form-item label="旋转" name="rotate">
        <t-input-number v-model="rect.rotate" @change="changeRect('rotate')" />
      </t-form-item>
      <t-form-item label="内边距-左" name="">
        <t-input-number  />
      </t-form-item>
      <t-form-item label="内边距-右" name="rotate">
        <t-input-number  />
      </t-form-item>
      <t-form-item label="内边距-上" name="rotate">
        <t-input-number  />
      </t-form-item>
      <t-form-item label="内边距-下" name="rotate">
        <t-input-number  />
      </t-form-item>
      <t-form-item label="进度" name="progress">
        <t-input-number v-model="rect.progress" @change="changeRect('progress')" />
      </t-form-item>
      <t-form-item label="进度颜色" name="progressColor">
        <t-input-number v-model="rect.progressColor" @change="changeRect('progressColor')" />
      </t-form-item>
      <t-form-item label="垂直进度" name="verticalProgress">
        <t-switch v-model="pen.verticalProgress" @change="changeValue('verticalProgress')" />
      </t-form-item>
      <t-form-item label="反向进度" name="reverseProgress">
        <t-switch v-model="pen.reverseProgress" @change="changeValue('reverseProgress')" />
      </t-form-item>
      <t-form-item label="水平翻转" name="flipX">
        <t-switch v-model="pen.flipX" @change="changeValue('flipX')" />
      </t-form-item>
      <t-form-item label="垂直翻转" name="flipY">
        <t-switch v-model="pen.flipY" @change="changeValue('flipY')" />
      </t-form-item>
      <t-form-item label="文本" name="text">
        <t-input v-model="pen.text" @change="changeValue('text')" />
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
        <t-input-number v-model="rect.lineWidth" @change="changeRect('lineWidth')" />
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
        <t-input-number v-model="rect.borderWidth" @change="changeRect('borderWidth')" />
      </t-form-item>
      <t-form-item label="透明度" name="globalAlpha">
        <t-input-number v-model="rect.globalAlpha" @change="changeRect('globalAlpha')" />
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
        <t-input-number v-model="rect.shadowBlur" @change="changeRect('shadowBlur')" />
      </t-form-item>
      <t-form-item label="阴影X偏移度" name="shadowOffsetX">
        <t-input-number v-model="rect.shadowOffsetX" @change="changeRect('shadowOffsetX')" />
      </t-form-item>
      <t-form-item label="阴影Y偏移度" name="shadowOffsetY">
        <t-input-number v-model="rect.shadowOffsetY" @change="changeRect('shadowOffsetY')" />
      </t-form-item>
      <t-form-item label="文字阴影" name="textHasShadow">
        <t-switch v-model="pen.textHasShadow" @change="changeValue('textHasShadow')" />
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
const currentItem = ref([]);
const handlePanelChange: CollapseProps['onChange'] = (val) => {
  console.log(val);
};
const { selections } = useSelection();

const pen = ref<any>();
// 位置数据。当前版本位置需要动态计算获取
const rect = ref<any>();

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
}
</style>
