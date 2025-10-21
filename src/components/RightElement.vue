<template>
  <div class="left-subassembly">
    <t-tabs :default-value="1" v-if="selections.mode === SelectionMode.File">
      <t-tab-panel class="app-props" :value="1" label="图纸">
        <FileProps />
      </t-tab-panel>
      <t-tab-panel class="app-props-tabs" :value="2" label="通信">
        <Correspondence />
      </t-tab-panel>
      <!-- <t-tab-panel class="app-props" :value="3" label="布局">
        <Layout />
      </t-tab-panel> -->
      <!-- <t-tab-panel class="app-props" :value="4" label="结构">
        <Structure />
      </t-tab-panel> -->
    </t-tabs>
    <t-tabs :default-value="1" v-else-if="selections.mode === SelectionMode.Pen">
      <t-tab-panel class="app-props" :value="1" label="外观">
        <PenProps />
      </t-tab-panel>
      <t-tab-panel class="app-props" :value="2" label="事件">
        <Event/>
      </t-tab-panel>
      <t-tab-panel class="app-props" :value="3" label="动效">
        <Animation/>
      </t-tab-panel>
      <t-tab-panel class="app-props" :value="4" label="数据">
        <Data />
      </t-tab-panel>
      <!-- <t-tab-panel class="app-props" :value="5" label="结构">
        <Structure />
      </t-tab-panel> -->
    </t-tabs>
  </div>
</template>

<script lang="ts" setup>
import Animation from './Animation.vue';
import FileProps from './FileProps.vue';
import PenProps from './PenProps.vue';
import Event from './event/EventIndex.vue';
import Data from './Data.vue';
import Correspondence from './Correspondence.vue'
import Layout from './ly.vue';
import Structure from './Structure.vue';
import { useSelection, SelectionMode } from '@/services/selections';

const { selections } = useSelection();
</script>
<style lang="postcss" scoped>
.left-subassembly {
  height: 100%;
  overflow: auto;
}
.app-props {
  padding: 16px;
  border-left: 1px solid var(--color-border);
}

.app-props-tabs {
  border-left: 1px solid var(--color-border);
}
</style>
