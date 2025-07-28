<template>
  <div class="props-panel">
    <t-form label-align="left">
      <t-form-item label="图纸名称" name="name">
        <t-input v-model="data.name" @change="onChangeData" />
      </t-form-item>
      <t-divider />
      <t-form-item label="图元默认颜色" name="color">
        <t-color-picker
          class="w-full"
          v-model="data.color"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="onChangeData"
        />
      </t-form-item>
      <t-form-item label="画笔填充颜色" name="penBackground">
        <t-color-picker
          class="w-full"
          v-model="data.penBackground"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="onChangeData"
        />
      </t-form-item>
      <t-form-item label="背景颜色" name="background">
        <t-color-picker
          class="w-full"
          v-model="options.background"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="onChangeOptions"
        />
      </t-form-item>
      <t-form-item label="背景图片" name="bkImage">
        <!-- <t-color-picker
          class="w-full"
          v-model="data.background"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="onChangeData"
        /> -->
      </t-form-item>
      <t-form-item label="网格" name="grid">
        <t-switch v-model="options.grid" @change="onChangeOptions" />
      </t-form-item>
      <t-form-item label="网格大小" name="gridSize">
        <t-input v-model.number="options.gridSize" @change="onChangeOptions" />
      </t-form-item>
      <t-form-item label="网格角度" name="gridRotate">
        <t-input
          v-model.number="options.gridRotate"
          @change="onChangeOptions"
        />
      </t-form-item>
      <t-form-item label="网格颜色" name="gridColor">
        <t-color-picker
          class="w-full"
          v-model="options.gridColor"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="onChangeOptions"
        />
      </t-form-item>
      <t-form-item label="连线相交弯曲" name="lineCross">
        <t-switch v-model="options.lineCross" @change="onChangeOptions" />
      </t-form-item>
      <t-form-item label="pc端自动缩放" name="autoSizeinPc">
        <t-switch v-model="options.autoSizeinPc" @change="onChangeOptions" />
      </t-form-item>
      <t-form-item label="移动端自动缩放" name="autoSizeinMobile">
        <t-switch v-model="options.autoSizeinMobile" @change="onChangeOptions" />
      </t-form-item>
      <t-form-item label="预览不充满窗口" name="previewUnScale">
        <t-switch v-model="options.previewUnScale" @change="onChangeOptions" />
      </t-form-item>
      
      <t-divider />

      <t-form-item label="标尺" name="rule">
        <t-switch v-model="options.rule" @change="onChangeOptions" />
      </t-form-item>
      <t-form-item label="标尺颜色" name="ruleColor">
        <t-color-picker
          class="w-full"
          v-model="options.ruleColor"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="onChangeOptions"
        />
      </t-form-item>
      
      <t-divider />

    </t-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';

// 图纸数据
const data = reactive<any>({
  name: '',
  background: undefined,
  color: undefined,
});

// 画布选项
const options = reactive<any>({
  grid: false,
  gridSize: 10,
  gridRotate: undefined,
  gridColor: undefined,
  rule: undefined,
  background: undefined,
});

onMounted(() => {
  const d: any = meta2d.data();
  data.name = d.name || '';
  data.background = d.background;
  data.color = d.color;

  Object.assign(options, meta2d.getOptions());
});

const onChangeData = () => {
  console.log(data);
  console.log(meta2d.store.data);
  Object.assign(meta2d.store.data, data);
  meta2d.store.patchFlagsBackground = true;
  meta2d.render();
};

const onChangeOptions = () => {
  meta2d.setOptions(options);
  meta2d.store.patchFlagsTop = true;
  meta2d.store.patchFlagsBackground = true;
  meta2d.render();
};
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
  }
}
</style>
