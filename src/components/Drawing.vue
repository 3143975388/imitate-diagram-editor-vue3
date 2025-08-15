<template>
  <div class="draw">
    <svg class="l-icon" style="border: 1px rebeccapurple solid;margin-left: 17px;cursor: pointer;"  @click="visible = true" aria-hidden="true">
      <use xlink:href="#l-add"></use>
    </svg>
    <div  @click="visible = true" style="background: none;color: black;border: none;display: inline-block;margin-left: 16px;margin-top: 5px;margin-bottom: 5px;">新建文件夹</div>
    <t-icon name="menu-unfold" v-if="!bigExpand" @click="bigExpand=true" style="cursor: pointer;font-size: 18px;float: right;margin-right: 20px;margin-top: 5px;"  />
    <t-icon name="app" v-if="bigExpand" @click="bigExpand=false" style="cursor: pointer;font-size: 18px;float: right;margin-right: 20px;margin-top: 5px;"  />
    <t-dialog :visible.sync="visible" @confirm="handleConfirm" @cancel="handleCancel">
      <template #header>
        <h3>图纸信息</h3>
      </template>
      <t-form>
        <t-form-item label="图纸名称">
          <t-input v-model="photoName" placeholder="请输入图纸名称" />
        </t-form-item>
      </t-form>
      <template #footer>
        <t-button  @click="visible = false">取消</t-button>
        <t-button  @click="handleConfirm">确认</t-button>
      </template>
    </t-dialog>
     <div v-for="(item, index) in items" :key="item.id || index">
      <!-- 文件夹标题行 -->
      <div 
        style="display: inline-block;margin-left: 17px;width: 94%;margin-bottom: 5px;" 
        @mouseenter="handleMouseenter(item)" 
        @mouseleave="handleMouseleave(item)"
      >
        <t-icon name="folder-open-1" />
        <div style="display: inline-block;margin-left: 15px;">{{item.fullPath}}</div>
        <div style="display: inline-block;float: right;margin-right: 20px;">
          <t-popup v-if="isOperateAble && isHovered(item)" content="新增图纸">
            <t-icon @click="append(item)" style="margin-right: 15px;" name="file-add-1" />
          </t-popup>
          <t-popup v-if="isOperateAble && isHovered(item)" style="margin-right: 15px;" content="删除">
            <t-icon @click="removeFolder(item)" name="delete" />
          </t-popup>
          <!-- 展开/折叠按钮，改为使用item.expanded控制 -->
          <t-icon 
            style="font-size: 20px;cursor: pointer;" 
            v-if="!item.expanded" 
            @click="item.expanded = true" 
            name="chevron-down" 
          />
          <t-icon 
            style="font-size: 20px;cursor: pointer;" 
            v-if="item.expanded" 
            @click="item.expanded = false" 
            name="chevron-up" 
          />
        </div>
      </div>
      
      <!-- 子图纸列表，根据item.expanded决定是否显示 -->
      <div 
        v-if="item.expanded" 
        style="margin-left: 20px;cursor: pointer;margin-top: 5px;"
      >
        <!-- 小图标视图 -->
        <div 
          v-if="!bigExpand" 
          @click="imageClick(itemT)" 
          v-for="(itemT, index) in item.children" 
          :key="index"
        >
          <img style="display: inline-block;width: 20px;height:10px;" :src="itemT.image" alt="">
          <div style="display: inline-block;margin-left: 17px;">{{itemT.name}}</div>
          <t-icon style="float: right;margin-right: 24px;" @click="removeImage(itemT)" name="delete" />
        </div>
        
        <!-- 大图标视图 -->
        <div 
          v-if="bigExpand" 
          style="margin-left: 10px;border: 1px solid #f0f0f0;padding: 3px;display: inline-block;cursor: pointer;position: relative;"
          @mouseenter="handleImageMouseenter(itemT)" 
          @mouseleave="handleImageMouseleave(itemT)" 
          @click="imageClick(itemT)" 
          v-for="(itemT, index) in item.children" 
          :key="index"
        >
          <img style="display: block;width: 64px;height:64px;border: 1px solid #f0f0f0;" :src="itemT.image" alt="">
          <t-popup :content="itemT.name">
            <div style="display: inline-block;text-align: center;width: 64px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" >{{itemT.name}}</div>
          </t-popup>
          <t-icon v-if="itemT.showDelete" style="position: absolute;top: 0.5px;right:0.5px;color: darkturquoise;" @click="removeImage(itemT)" name="delete" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted,onBeforeUnmount } from 'vue';
  import { addScadaPaperImage,getScadaPaperImageList,addScadaDirectory,getScadaDirectory,deleteScadaPaperImage,deleteScadaDirectory,getInfo } from '@/api/photo/photo.ts';
  // import { TreeNode } from 'tdesign-vue-next';
  import { MessagePlugin } from 'tdesign-vue-next';
  import { Message as TMessage } from 'tdesign-vue-next';
  import emitter from '@/utils/pageEventBus';

  // 储存当前用户信息
  const userName = ref('');


  // 控制对话框显示
  const visible = ref(false);

  // 控制展开收起
  const expandControls = ref(false);

  // 控制大图纸展开收起
  const bigExpand = ref(false);

  // 控制图纸图片删除按钮显示
  const imageRemoveControls = ref(false);

  // 当前鼠标悬停的节点
  const hoveredNode = ref<any | null>(null);
  
  // 是否可操作，控制操作按钮显示
  const isOperateAble = ref(true);

  // 图纸名称
  const photoName = ref('');

  // 图纸数据
  const items = ref<any[]>([
  ])

  function onActive(data: any) {
    console.log(data);
  };

  // 确认方法-新增文件夹
  const handleConfirm = () => {
    // 表单验证
    if (!photoName.value.trim()) {
      TMessage.warning('请输入图纸名称');
      return;
    }
  
    const photoData = {
      // createBy: userName.value, // 使用当前用户信息
      fullPath: photoName.value,
      type:'0', // type为0
      // 其他需要提交的数据
    };
    // API调用
    addScadaDirectory(photoData).then(() => {
      MessagePlugin.success('新增文件夹成功');
      getImageList();
      visible.value = false;
    });
  };

  // 取消方法
  const handleCancel = () => {
    visible.value = false;
    photoName.value = ''; // 清空输入框
  };

  // 鼠标进入事件
  const handleMouseenter = (node:any) => {
    hoveredNode.value = node; // 更新当前悬停的节点数据
  };

  // 判断是否为当前悬停节点
  const isHovered = (node: any): boolean => {
    return hoveredNode.value?.id === node.id; // 比较节点ID
  };

  // 鼠标离开事件
  const handleMouseleave = (node: any) => {
    hoveredNode.value = null; // 清除当前悬停的节点数据
  };

  // 获取节点的完整路径或名称
  const nodeFF = (node: any) => {
    return node.data.fullPath || '未命名图纸';
  };

  // 添加子节点方法
  function append(node: any) {
    meta2d.open({ name: '新建项目',folder: node.fullPath,component:'0', pens: [] } as any); 
    const photoData = {
      folder: node.fullPath, // 使用当前节点的fullPath作为新图纸的路径
      component:'0',
    };
    localStorage.setItem('photoData', JSON.stringify(photoData)); // 设置当前路径
  }

  // 删除图纸图片方法
  function removeImage(itemT: any) {
    // 确认删除
    if (confirm(`确定删除图纸 "${itemT.name}" 吗？`)) {
      // 调用API删除图纸图片
      console.log(itemT);
      
      deleteScadaPaperImage(itemT.id).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('删除图纸成功');
          // 从items中删除该图纸
          getImageList(); // 重新获取图纸列表
        } else {
          MessagePlugin.error('删除图纸失败');
        }
      });
    }
  }

  // 删除文件夹方法
  function removeFolder(node: any) {
    if (confirm(`确定删除文件夹 "${node.fullPath}" 吗？`)) {
      // 调用API删除文件夹
      deleteScadaDirectory(node.id).then((res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('删除文件夹成功');
          // 从items中删除该文件夹
          getImageList(); // 重新获取图纸列表
        } else {
          MessagePlugin.error('删除文件夹失败');
        }
      });
    }
  }

  // 鼠标进入图片时的处理函数
  const handleImageMouseenter = (itemT: any) => {
    itemT.showDelete = true;
  };

  // 离开图片时的处理函数
  const handleImageMouseleave = (itemT: any) => {
    itemT.showDelete = false;
  };

  // 新增 imageClick 方法
  function imageClick(itemT: any) {
    // 这里可以根据需要处理点击图片的逻辑
    meta2d.open(JSON.parse(itemT.data));
    localStorage.setItem('dataId', JSON.stringify({dataId: itemT.id}));
  }
  
  // 获取图纸列表
  function getImageList(){
    // 获取文件夹列表
    getScadaDirectory({type:0,createBy:userName.value}).then((res: any) => {
      if (res.code === 200) {
        // 获取文件夹数据并添加expanded属性
        let nodes = res.rows.map((folder: any) => ({
          ...folder,
          expanded: false, // 初始化展开状态为false
          children: []     // 初始化children数组
        }));
        
        getScadaPaperImageList({component:0,createBy:userName.value}).then((res: any) => {
          if (res.code === 200) {
            // 将图纸数据添加到items中
            res.rows.forEach((item: any) => {
              // 查找对应的文件夹
              const folderNode = nodes.find((folder: any) => folder.fullPath === item.folder);
              if (folderNode) {
                // 如果找到对应的文件夹，将图纸添加为其子节点
                if (!folderNode.children) {
                  folderNode.children = [];
                }
                item.fullPath = item.name; // 设置fullPath为name
                // 为每个图片项添加 showDelete 属性
                folderNode.children.push({
                  ...item,
                  showDelete: false, // 初始状态不显示删除按钮
                  fullPath: item.name
                });
              }
            });
            items.value = nodes; // 更新items为获取到的文件夹和图纸数据
          }
        });
      } else {
        TMessage.error('获取文件夹列表失败');
      }
    });
  }

  onMounted(() => {
    // 监听刷新事件
    emitter.on('refresh-drawings', getImageList);
    // 获取当前用户信息
    getInfo().then((res: any) => {
      if (res.code === 200) {
        userName.value = res.user.userName; // 设置当前用户信息
        // 存储在 localStorage 中
        getImageList();  // 调用获取图纸列表方法
        // localStorage.setItem('userName', userName.value);
      } else {
        TMessage.error('获取用户信息失败');
      }
    });
  });

  onBeforeUnmount(() => {
    // 组件卸载时移除监听
    emitter.off('refresh-drawings', getImageList);
  });
</script>
<style lang="postcss" scoped>
.draw {
  height: 100%;
  overflow: auto;
}
</style>
