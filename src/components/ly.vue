<template>
  <div class="props-panel">
    <t-form label-align="left">
      <t-form-item label="最大宽度：" name="id">
        <t-input v-model="pen.id"  placeholder="请输入最大宽度" />
      </t-form-item>
      <t-form-item label="间距：" name="description">
        <t-input v-model="pen.description"  placeholder="请输入间距" />
      </t-form-item>
    </t-form>
  </div>
</template>

<script lang="ts" setup>
import { ref,onMounted,watch,onUnmounted } from 'vue';
import { useSelection } from '@/services/selections';
const { selections } = useSelection();
const pen = ref<any>({
  tags: [] // 添加这行，为 tags 设置默认空数组
});

onMounted(() => {

});



onUnmounted(() => {
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

.t-form__label {
  font-size: 12px !important;
}
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
