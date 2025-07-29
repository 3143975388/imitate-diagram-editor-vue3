<template>
  <!-- 遍历pen，过滤掉没有id的项 -->
  <div v-for="pen in pens" :key="pen.id">
    <!-- 双击切换input -->
    <span style="cursor: pointer;">{{ pen.name || '无名称' }}</span>
    
  </div>
</template>
<script lang="ts" setup>
import { useSelection } from '@/services/selections';
import { computed,onMounted,ref } from 'vue';
const { selections } = useSelection();
interface Pen {
  id: string | number;
  name?: string;
}

const pens = ref<Pen[]>([]);
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