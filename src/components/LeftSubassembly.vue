<template>
  <div class="left-subassembly">
    <t-tabs :default-value="1">
      <t-tab-panel :value="1" label="图纸">
        <Drawing/>
      </t-tab-panel>
      <t-tab-panel :value="2" label="系统组件">
        <Graphics/>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<script lang="ts" setup>
import Graphics from './Graphics.vue';
import Drawing from './Drawing.vue';
</script>
<style lang="postcss" scoped>
.left-subassembly {
  height: 100%;
  overflow: auto;
}
</style>
