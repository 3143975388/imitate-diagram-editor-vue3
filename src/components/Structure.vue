<template>
  <t-tree :data="penss" hover @mouseenter="handleNodeHover" @mouseleave="handleNodeLeave">
    <template #operations="{ node }">
      <t-space :size="10" v-show="isNodeHovered(node)">
        <t-button size="small" variant="base" @click.stop="handleLayer(node)">xx层</t-button>
        <t-button size="small" variant="outline" @click.stop="handleLock(node)">锁定，编辑那些</t-button>
        <t-button size="small" variant="outline" @click.stop="handleHide(node)">隐藏</t-button>
      </t-space>
    </template>
  </t-tree>
</template>

<script lang="ts" setup>
import { useSelection } from '@/services/selections';
import { computed, onMounted, ref, onBeforeUnmount } from 'vue';
const { selections } = useSelection();

interface Pen {
  id?: string | number;
  name?: string;
  label?: string;
  children?: (string | number)[] | Pen[];
}

const penss = ref<Pen[]>([]);
const hoveredNodeId = ref<string | number | null>(null);

// 判断节点是否被悬停
const isNodeHovered = (node: any) => {
  return hoveredNodeId.value === node.data.id;
};

// 处理鼠标移入节点
const handleNodeHover = (context: { node: any; e: MouseEvent }) => {
  console.log('Node hovered:', context.node);
  
  // hoveredNodeId.value = context.node.data.id;
};

// 处理鼠标离开节点
const handleNodeLeave = () => {
  hoveredNodeId.value = null;
};

// 处理按钮点击事件
const handleLayer = (node: any) => {
  console.log('Layer button clicked for node:', node.data);
};

const handleLock = (node: any) => {
  console.log('Lock button clicked for node:', node.data);
};

const handleHide = (node: any) => {
  console.log('Hide button clicked for node:', node.data);
};

// 点击其他地方时取消悬停状态
const handleClickOutside = (e: MouseEvent) => {
  const treeElement = e.target as HTMLElement;
  if (!treeElement.closest('.t-tree')) {
    hoveredNodeId.value = null;
  }
};

// 处理组合之后的结构
function processCombines(pens: Pen[]) {
  const penMap = new Map();
  pens.forEach(pen => {
    if (pen.name !== undefined) {
      pen.label = pen.name;
      delete pen.name;
    }
    penMap.set(pen.id, pen);
  });
  
  const idsToDelete = new Set();
  
  pens.forEach(pen => {
    if (pen.label === 'combine' && Array.isArray(pen.children)) {
      const newChildren: Pen[] = [];
      pen.children.forEach(childId => {
        if (penMap.has(childId)) {
          const childNode = penMap.get(childId);
          newChildren.push(childNode);
          idsToDelete.add(childId);
        }
      });
      pen.children = newChildren;
    }
  });

  return pens.filter(pen => !idsToDelete.has(pen.id));
}

// 深拷贝不改变原数组
function deepCopy<T>(obj: T, hash = new WeakMap<object, any>()): T {
  if (Object(obj) !== obj) return obj;

  if (typeof obj === 'object' && obj !== null) {
    if (hash.has(obj)) return hash.get(obj);
    
    const result: Record<string, any> = Array.isArray(obj) ? [] : {};
    hash.set(obj, result);
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = deepCopy(obj[key], hash);
      }
    }
    
    return result as T;
  }
  
  return obj;
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  const meta2dStr = meta2d.store.data.pens;
  if (meta2dStr) {
    try {
      const pensCopy = deepCopy(meta2dStr);
      penss.value = processCombines(pensCopy); 
    } catch (e) {
      penss.value = [];
      console.error('meta2d:', e);
    }
  } else {
    penss.value = [];
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
})
</script>