<template>
  <!-- 遍历pen，过滤掉没有id的项 -->
  <div v-for="pen in penss" :key="pen.id">
    <!-- 双击切换input -->
    <span style="cursor: pointer;">{{ pen.name || '无名称' }}</span>
    
  </div>
</template>
<script lang="ts" setup>
import { useSelection } from '@/services/selections';
import { computed,onMounted,ref } from 'vue';
const { selections } = useSelection();

interface Pen {
  id?: string | number;
  name?: string;
  children?: (string | number)[] | Pen[];  // 允许children是id数组或Pen对象数组
}

const penss = ref<Pen[]>([]);

// 处理组合之后的结构
function processCombines(pens: Pen[]) {
  // 创建ID到节点的映射
  const penMap = new Map();
  pens.forEach(pen => penMap.set(pen.id, pen));
  // 收集所有需要删除的子节点ID
  const idsToDelete = new Set();
  // 处理每个combine节点
  pens.forEach(pen => {
    if (pen.name === 'combine' && Array.isArray(pen.children)) {
      const newChildren: Pen[] = [];
      // 遍历当前combine节点的所有子ID
      pen.children.forEach(childId => {
          if (penMap.has(childId)) {
              const childNode = penMap.get(childId);
              newChildren.push(childNode);  // 添加子节点对象
              idsToDelete.add(childId);     // 标记待删除
          }
      });
      // 替换为对象数组
      pen.children = newChildren;
    }
  });

  // 过滤掉已移动到combine节点中的子节点
  return pens.filter(pen => !idsToDelete.has(pen.id));
}

// 深拷贝不改变原数组
function deepCopy<T>(obj: T, hash = new WeakMap<object, any>()): T {
  if (Object(obj) !== obj) return obj; // 基本类型

  // 只有对象类型才检查循环引用
  if (typeof obj === 'object' && obj !== null) {
    if (hash.has(obj)) return hash.get(obj); // 循环引用
    
    const result: Record<string, any> = Array.isArray(obj) ? [] : {};
    hash.set(obj, result); // 存储引用
    
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
  const meta2dStr = meta2d.store.data.pens;
  console.log(meta2dStr);
  const pensValue = meta2dStr;
  if (meta2dStr) {
    try {
      // 使用自定义深拷贝函数
      const pensCopy = deepCopy(pensValue);
      penss.value = processCombines(pensCopy); 
    } catch (e) {
      penss.value = [];
      console.error('meta2d:', e);
    }
  } else {
    penss.value = [];
  }
  console.log(penss.value);
})

</script>