<template>
  <div class="props-panel">
    <t-form label-align="left">
      <t-form-item label="ID：" name="id">
        <t-input v-model="id" placeholder="请输入ID" />
      </t-form-item>
      <t-form-item label="名称：" name="description">
        <t-input v-model="description" placeholder="请输入名称" />
      </t-form-item>
    </t-form>
    <t-space style="width: 100%;border: none;" direction="vertical">
      <t-collapse :current-item="currentItem" expand-icon-placement="right" expand-mutex @change="">
        <t-collapse-panel value="0" header="Tag标签">
        </t-collapse-panel>
        <t-collapse-panel value="1" header="数据">
        </t-collapse-panel>
      </t-collapse>
    </t-space>
  </div>
</template>

<script lang="ts" setup>
import { ref,onMounted } from 'vue';
const currentItem = ref<string[]>(['0']);
const id = ref<string>('');
const description = ref<string>('');
import { useSelection } from '@/services/selections';

const { selections } = useSelection();
const pen = ref<any>({});

onMounted(() => {
  getPen();
});

const getPen = () => {
  pen.value = selections.pen;
  id.value = pen.value.id;
  // else {
  //   events.value = [];
  // }
};

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
