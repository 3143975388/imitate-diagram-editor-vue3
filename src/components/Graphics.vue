<template>
  <div class="graphics">
    <div style="height: calc(100vh - 200px);margin-top:10px; overflow-y: auto;">
      <div v-for="(item, index) in items" :key="item.id || index">
        <div 
          v-if="item.show == false"
          style="display: inline-block;margin-left: 17px;width: 94%;margin-bottom: 5px;" 
          @mouseenter="handleMouseenter(item)" 
          @mouseleave="handleMouseleave(item)"
        >
          <t-icon name="folder-open-1" />
          <div style="display: inline-block;margin-left: 15px;">{{item.fullPath}}</div>
          <div style="display: inline-block;float: right;margin-right: 20px;">
            <t-popup v-if="isOperateAble && hoveredNode === item" content="新增图片">
              <t-icon @click="appendImage(item)" style="margin-right: 15px;" name="file-add-1" />
              <input 
                type="file" 
                accept="image/*" 
                style="display: none;" 
                @change="(e) => append(item, e)" 
                ref="fileInput"
              />
            </t-popup>
            <t-popup v-if="isOperateAble && hoveredNode === item" style="margin-right: 15px;" content="删除">
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
          <div v-if="item.expanded" style="margin-left: 0px;cursor: pointer;margin-top: 5px;"> 
            <!-- 大图标视图 -->
            <div 
              style="margin-left: 10px;border: 1px solid #f0f0f0;padding: 3px;display: inline-block;cursor: pointer;position: relative;"
              @mouseenter="handleImageMouseenter(itemT)" 
              @mouseleave="handleImageMouseleave(itemT)" 
              v-for="(itemT, index) in item.children" 
              :key="index"
              @dragstart="dragStart($event, itemT)"
            >
              <img style="display: block;width: 64px;height:64px;border: 1px solid #f0f0f0;" :src="itemT.url" alt="">
              <!-- 图片名称显示区域 -->
              <!-- 删除按钮 -->
              <t-icon 
                v-if="itemT.showDelete" 
                style="position: absolute;top: 0.5px;right: 0.5px;color: darkturquoise;" 
                @click.stop="removeImage(itemT)"  
                name="delete" 
              />
            </div>
          </div>
        </div>
        <div v-if="item.show == true" style="display: inline-block;margin-left: 17px;width: 94%;margin-bottom: 5px;" >
          <t-icon name="folder-open-1" />
          <div style="display: inline-block;margin-left: 15px;">
            {{item.name}}
          </div>
          <div style="display: inline-block;float: right;margin-right: 20px;">
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
          <div v-if="item.expanded">
            <div v-for="(itemT, index) in item.list" style="width: 64px;height:64px;display: inline-block;" :key="index">
              <div
                style="margin-top: 20px;text-align: center;"
                class=""
                :draggable="true"
                @dragstart="dragStartOriginally($event, itemT)"
              >
                <svg class="l-icon" style="font-size: 35px;" aria-hidden="true">
                  <use :xlink:href="'#' + itemT.icon"></use>
                </svg>
                 <t-popup :content="itemT.name">
                   <p style="display: inline-block;width: 60px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="itemT.name">{{ itemT.name }}</p>
                 </t-popup>
               
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <t-affix
      ref="affixRef"
      :z-index="5"
      :offset-top="50"
      style="display: flex;flex-direction: column;justify-content: center;align-items: center;"
    >
      <div style="width:220px;height:40px;border:1px #e8e8e8 solid ;line-height: 40px;text-align:center;" @click="addSubassembly">新增组件文件夹</div>
    </t-affix>
    <t-dialog :visible.sync="visible" @confirm="handleConfirm" @cancel="handleCancel">
      <template #header>
        <h3>文件夹信息</h3>
      </template>
      <t-form>
        <t-form-item label="文件夹名称">
          <t-input v-model="folderName" placeholder="请输入文件夹名称" />
        </t-form-item>
      </t-form>
      <template #footer>
        <t-button  @click="visible = false">取消</t-button>
        <t-button  @click="handleConfirm">确认</t-button>
      </template>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Message as TMessage } from 'tdesign-vue-next';
import { addScadaDirectory, getScadaDirectory,deleteScadaImage, addScadaImage,deleteScadaDirectory, getScadaImageList, uploadFile,getInfo } from '@/api/photo/photo.ts';
import { MessagePlugin } from 'tdesign-vue-next';
import { onMounted, ref } from 'vue';
import { log } from 'node:console';

const visible = ref(false);
const folderName = ref(''); // 新增 folderName 响应式变量
const userName = ref(''); // 新增 userName 响应式变量

// 新增：操作权限变量，默认允许操作（可根据实际权限控制逻辑调整）
const isOperateAble = ref(true);

// 控制图片删除按钮显示
const imageRemoveControls = ref(false);

// 新增：用于追踪当前悬停的节点
const hoveredNode = ref<any>(null);

// 鼠标进入文件夹项时设置悬停节点
const handleMouseenter = (item: any) => {
  hoveredNode.value = item;
};

// 鼠标离开文件夹项时清除悬停节点
const handleMouseleave = (item: any) => {
  if (hoveredNode.value === item) {
    hoveredNode.value = null;
  }
};

// Define items as an empty array or with your desired initial data
const items = ref<any[]>([]);

const dragStart = (e: DragEvent, elem: any) => {
  if (!elem) return;
  
  // 创建图片元数据 - 指定固定尺寸
  const data = {
    name: 'image',
    image: elem.url,
    x: 0,
    y: 0,
    width: 64,  // 固定宽度
    height: 64, // 固定高度
    // 其他可能的属性...
  };

  // 拖拽数据传输
  if (e.dataTransfer) {
    console.log('拖拽开始');
    
    // 创建临时图片用于拖拽预览
    const dragImage = document.createElement('img');
    dragImage.src = elem.url || '';
    dragImage.style.width = '64px';
    dragImage.style.height = '64px';
    dragImage.style.objectFit = 'cover'; // 保持比例
    
    // 添加到DOM（但不可见）
    dragImage.style.position = 'fixed';
    dragImage.style.top = '-1000px';
    dragImage.style.left = '-1000px';
    document.body.appendChild(dragImage);
    
    dragImage.onload = () => {
      // 设置拖拽图像（居中）
      e.dataTransfer?.setDragImage(dragImage, 32, 32);
      // 清理临时图片
      setTimeout(() => document.body.removeChild(dragImage), 0);
    };
    
    // 传递数据给 Meta2D
    e.dataTransfer.setData('Meta2d', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'copy';
  } else {
    // 平板模式处理
    meta2d.canvas.addCaches = [data];
  }
};

// 新增：处理新增图形按钮点击
const addSubassembly = () => {
  visible.value = true; // 显示对话框
  folderName.value = ''; // 清空输入框
};

// 新增：处理新增图片按钮点击
const appendImage = (item: any) => {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.click(); // 触发文件选择对话框
  } else {
    TMessage.warning('文件输入元素未找到，请检查代码。');
  }
};

// 新增：处理新增图片按钮点击
const append = (item: any, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    console.log('选择的文件:', target.files[0]);
    console.log('选择的文件名:', item);
    const formData = new FormData();
    const photoName = target.files[0].name;
    formData.append('file', target.files[0]); // 添加文件，指定文件名

    // 上传文件
    uploadFile(formData).then((res: any) => {
      if (res.code === 200) {
        console.log(res.data);
        MessagePlugin.success('上传成功');
        const photoData = {
          directory: item.fullPath, // 文件夹名称
          name: photoName, // 图片名称
          url: res.data.url, // 路径
          type: '1'
        };
        addScadaImage(photoData).then(() => {
          MessagePlugin.success('新增图片成功');
          getvalue();
        });
      }
    }).catch((error: any) => {
      TMessage.error('上传失败: ' + error.message);
    });
  }
};

// 新增：处理删除文件夹按钮点击
const removeFolder = (item: any) => {
  if (confirm(`确定删除文件夹 "${item.fullPath}" 吗？`)) {
    // 调用API删除文件夹
    deleteScadaDirectory(item.id).then((res: any) => {
      if (res.code === 200) {
        MessagePlugin.success('删除文件夹成功');
        // 从items中删除该文件夹
        getvalue(); // 重新获取图片列表
      } else {
        MessagePlugin.error('删除文件夹失败');
      }
    });
  }
  // 实际项目中应调用API删除，并刷新列表
};

// 新增：处理删除图片按钮点击
const removeImage = (itemT: any) => {
  if (confirm(`确定删除图片 "${itemT.name}" 吗？`)) {
    deleteScadaImage(itemT.id).then((res: any) => {
      if (res.code === 200) {
        MessagePlugin.success('删除图片成功');
        getvalue(); // 重新获取图片列表
      } else {
        MessagePlugin.error('删除图片失败');
      }
    });
  }
};

// 新增：处理确认按钮
const handleConfirm = () => {
  // 表单验证
  if (!folderName.value.trim()) {
    TMessage.warning('请输入图纸名称');
    return;
  }

  const photoData = {
    fullPath: folderName.value,
    type: '1', // type为0
    // 其他需要提交的数据
  };
  // API调用
  addScadaDirectory(photoData).then(() => {
    TMessage.success('新增文件夹成功');
    visible.value = false;
  });
  // 关闭对话框
  visible.value = false;
};

// 新增：处理取消按钮
const handleCancel = () => {
  visible.value = false;
  folderName.value = '';
};

// 鼠标进入图片时的处理函数
const handleImageMouseenter = (itemT: any) => {
  itemT.showDelete = true;
};

// 离开图片时的处理函数
const handleImageMouseleave = (itemT: any) => {
  itemT.showDelete = false;
};

// 创建图片尺寸缓存
const imageSizeCache = new Map();

// 获取文件夹和图片数据
const getvalue = () => {
  getScadaDirectory({ type: 1,createBy:userName.value }).then((res: any) => {
    if (res.code === 200) {
      // 获取文件夹数据并添加expanded属性
      let nodes = res.rows.map((folder: any) => ({
        ...folder,
        show:false, // 初始化show为false
        expanded: false, // 初始化展开状态为false
        children: []     // 初始化children数组
      }));
      // 将获取到的文件夹数据赋值给items
      // getScadaImageList获取图片数据加入到所属文件夹
      getScadaImageList({ type: 1,createBy:userName.value }).then((res: any) => {
        if (res.code === 200) {
          console.log(res.rows);
          // 将图纸数据添加到items中
          res.rows.forEach((item: any) => {
            // 查找对应的文件夹
            const folderNode = nodes.find((folder: any) => folder.fullPath === item.directory);
            if (folderNode) {
              // 如果找到对应的文件夹，将图纸添加为其子节点
              if (!folderNode.children) {
                folderNode.children = [];
              }
              item.fullPath = item.name; // 设置fullPath为name
              if(item.url){
                item.url = item.url.replace(/^http:\/\/[^/]+/, '/image-proxy'); 
              }
              // 为每个图片项添加 showDelete 属性
              folderNode.children.push({
                ...item,
                showDelete: false, // 初始状态不显示删除按钮
                fullPath: item.name
              });
            }
          });
          items.value = [
            ...nodes, // 使用获取到的文件夹数据
            {
              name: '基本形状',
              expanded: false, // 初始化展开状态为false
              show: true,
              list: [
                {
                  name: '正方形',
                  icon: 'l-rect',
                  id: 1,
                  data: {
                    width: 100,
                    height: 100,
                    name: 'square',
                  },
                },
                {
                  name: '矩形',
                  icon: 'l-rectangle',
                  id: 2,
                  data: {
                    width: 200,
                    height: 50,
                    borderRadius: 0.1,
                    name: 'rectangle',
                  },
                },
                {
                  name: '圆',
                  icon: 'l-circle',
                  id: 3,
                  data: {
                    width: 100,
                    height: 100,
                    name: 'circle',
                  },
                },
                {
                  name: '三角形',
                  icon: 'l-triangle',
                  id: 4,
                  data: {
                    width: 100,
                    height: 100,
                    name: 'triangle',
                  },
                },
                {
                  name: '菱形',
                  icon: 'l-diamond',
                  id: 5,
                  data: {
                    width: 100,
                    height: 100,
                    name: 'diamond',
                  },
                },
                {
                  name: '五边形',
                  icon: 'l-pentagon',
                  id: 6,
                  data: {
                    width: 100,
                    height: 100,
                    name: 'pentagon',
                  },
                },
                {
                  name: '六边形',
                  icon: 'l-hexagon',
                  id: 7,
                  data: {
                    width: 100,
                    height: 100,
                    name: 'hexagon',
                  },
                },
                {
                  name: '五角星',
                  icon: 'l-pentagram',
                  id: 8,
                  data: {
                    width: 100,
                    height: 100,
                    name: 'pentagram',
                  },
                },
                {
                  name: '左箭头',
                  icon: 'l-arrow-left',
                  id: 9,
                  data: {
                    width: 120,
                    height: 60,
                    name: 'leftArrow',
                  },
                },
                {
                  name: '右箭头',
                  icon: 'l-arrow-right',
                  id: 10,
                  data: {
                    width: 120,
                    height: 60,
                    name: 'rightArrow',
                  },
                },
                {
                  name: '双向箭头',
                  icon: 'l-twoway-arrow',
                  id: 11,
                  data: {
                    width: 150,
                    height: 60,
                    name: 'twowayArrow',
                  },
                },
                {
                  name: '云',
                  icon: 'l-cloud',
                  id: 13,
                  data: {
                    width: 100,
                    height: 100,
                    name: 'cloud',
                  },
                },
                {
                  name: '消息框',
                  icon: 'l-msg',
                  id: 14,
                  data: {
                    textTop: -0.1,
                    width: 100,
                    height: 100,
                    name: 'message',
                  },
                },
                {
                  name: '文件',
                  icon: 'l-file',
                  id: 15,
                  data: {
                    width: 80,
                    height: 100,
                    name: 'file',
                  },
                },
                {
                  name: '立方体',
                  icon: 'l-cube',
                  id: 18,
                  data: {
                    width: 60,
                    height: 100,
                    name: 'cube',
                    z: 0.25,
                    props: {
                      custom: [
                        {
                          key: 'z',
                          label: 'Z',
                          type: 'number',
                          min: 0,
                          placeholder: '<= 1 即宽度的比例',
                        },
                        {
                          key: 'backgroundFront',
                          label: '前背景色',
                          type: 'color',
                        },
                        {
                          key: 'backgroundUp',
                          label: '顶背景色',
                          type: 'color',
                        },
                        {
                          key: 'backgroundRight',
                          label: '右背景色',
                          type: 'color',
                        },
                      ],
                    },
                  },
                },
                {
                  name: '人',
                  icon: 'l-people',
                  id: 19,
                  data: {
                    width: 70,
                    height: 100,
                    name: 'people',
                  },
                },
              ],
            },
            {
              name: '流程图',
              expanded: false, // 初始化展开状态为false
              show: true,
              list: [
                {
                  name: '开始/结束',
                  icon: 'l-flow-start',
                  id: 21,
                  data: {
                    text: '开始/结束',
                    width: 120,
                    height: 40,
                    borderRadius: 0.5,
                    name: 'rectangle',
                  },
                },
                {
                  name: '流程',
                  icon: 'l-rectangle',
                  id: 22,
                  data: {
                    text: '流程',
                    width: 120,
                    height: 40,
                    name: 'rectangle',
                  },
                },
                {
                  name: '判定',
                  icon: 'l-diamond',
                  id: 23,
                  data: {
                    text: '判定',
                    width: 120,
                    height: 60,
                    name: 'diamond',
                  },
                },
                {
                  name: '数据',
                  icon: 'l-flow-data',
                  id: 24,
                  data: {
                    text: '数据',
                    width: 120,
                    height: 50,
                    name: 'flowData',
                    offsetX: 0.14,
                  },
                },
                {
                  name: '准备',
                  icon: 'l-flow-ready',
                  id: 25,
                  data: {
                    text: '准备',
                    width: 120,
                    height: 50,
                    name: 'hexagon',
                  },
                },
                {
                  name: '子流程',
                  icon: 'l-flow-subprocess',
                  id: 26,
                  data: {
                    text: '子流程',
                    width: 120,
                    height: 50,
                    name: 'flowSubprocess',
                  },
                },
                {
                  name: '数据库',
                  icon: 'l-db',
                  id: 27,
                  data: {
                    text: '数据库',
                    width: 80,
                    height: 120,
                    name: 'flowDb',
                  },
                },
                {
                  name: '文档',
                  icon: 'l-flow-document',
                  id: 28,
                  data: {
                    text: '文档',
                    width: 120,
                    height: 100,
                    name: 'flowDocument',
                  },
                },
                {
                  name: '内部存储',
                  icon: 'l-internal-storage',
                  id: 29,
                  data: {
                    text: '内部存储',
                    width: 120,
                    height: 80,
                    name: 'flowInternalStorage',
                  },
                },
                {
                  name: '外部存储',
                  icon: 'l-extern-storage',
                  id: 30,
                  data: {
                    text: '外部存储',
                    width: 120,
                    height: 80,
                    name: 'flowExternStorage',
                  },
                },
                {
                  name: '队列',
                  icon: 'l-flow-queue',
                  id: 31,
                  data: {
                    text: '队列',
                    width: 100,
                    height: 100,
                    name: 'flowQueue',
                  },
                },
                {
                  name: '手动输入',
                  icon: 'l-flow-manually',
                  id: 32,
                  data: {
                    text: '手动输入',
                    width: 120,
                    height: 80,
                    name: 'flowManually',
                  },
                },
                {
                  name: '展示',
                  icon: 'l-flow-display',
                  id: 33,
                  data: {
                    text: '展示',
                    width: 120,
                    height: 80,
                    name: 'flowDisplay',
                  },
                },
                {
                  name: '并行模式',
                  icon: 'l-flow-parallel',
                  id: 34,
                  data: {
                    text: '并行模式',
                    width: 120,
                    height: 50,
                    name: 'flowParallel',
                  },
                },
                {
                  name: '注释',
                  icon: 'l-flow-comment',
                  id: 35,
                  data: {
                    text: '注释',
                    width: 100,
                    height: 100,
                    name: 'flowComment',
                  },
                },
              ],
            },
            {
              name: '活动图',
              expanded: false, // 初始化展开状态为false
              show: true,
              list: [
                {
                  name: '开始',
                  icon: 'l-inital',
                  id: 36,
                  data: {
                    text: '',
                    width: 30,
                    height: 30,
                    name: 'circle',
                    background: '#555',
                    lineWidth: 0,
                  },
                },
                {
                  name: '结束',
                  icon: 'l-final',
                  id: 37,
                  data: {
                    width: 30,
                    height: 30,
                    name: 'activityFinal',
                  },
                },
                {
                  name: '活动',
                  icon: 'l-action',
                  id: 38,
                  data: {
                    text: '活动',
                    width: 120,
                    height: 50,
                    borderRadius: 0.25,
                    name: 'rectangle',
                  },
                },
                {
                  name: '决策/合并',
                  icon: 'l-diamond',
                  id: 39,
                  data: {
                    text: '决策/合并',
                    width: 120,
                    height: 50,
                    name: 'diamond',
                  },
                },
                {
                  name: '垂直泳道',
                  icon: 'l-swimlane-v',
                  id: 40,
                  data: {
                    text: '垂直泳道',
                    width: 200,
                    height: 500,
                    name: 'swimlaneV',
                    textBaseline: 'top',
                    textTop: 20,
                    // textHeight: ,
                    lineTop: 0.08,
                  },
                },
                {
                  name: '水平泳道',
                  icon: 'l-swimlane-h',
                  id: 41,
                  data: {
                    text: '水平泳道',
                    width: 500,
                    height: 200,
                    name: 'swimlaneH',
                    textWidth: 0.01,
                    textLeft: 0.04,
                    textAlign: 'left',
                    lineLeft: 0.08,
                  },
                },
                {
                  name: '垂直分岔/汇合',
                  icon: 'l-fork-v',
                  id: 42,
                  data: {
                    text: '垂直分岔/汇合',
                    width: 10,
                    height: 150,
                    name: 'forkV',
                    fillStyle: '#555',
                    strokeStyle: 'transparent',
                  },
                },
                {
                  name: '水平分岔/汇合',
                  icon: 'l-fork',
                  id: 43,
                  data: {
                    text: '水平分岔/汇合',
                    width: 150,
                    height: 10,
                    name: 'forkH',
                    fillStyle: '#555',
                    strokeStyle: 'transparent',
                  },
                },
              ],
            },
            {
              name: '时序图和类图',
              expanded: false, // 初始化展开状态为false
              show: true,
              list: [
                {
                  name: '生命线',
                  icon: 'l-lifeline',
                  id: 44,
                  data: {
                    text: '生命线',
                    width: 150,
                    height: 400,
                    textHeight: 50,
                    name: 'lifeline',
                  },
                },
                {
                  name: '激活',
                  icon: 'l-focus',
                  id: 45,
                  data: {
                    text: '激活',
                    width: 12,
                    height: 200,
                    name: 'sequenceFocus',
                  },
                },
                {
                  name: '简单类',
                  icon: 'l-simple-class',
                  id: 46,
                  data: {
                    text: 'Topolgoy',
                    width: 270,
                    height: 200,
                    textHeight: 200,
                    name: 'simpleClass',
                    textAlign: 'center',
                    textBaseline: 'top',
                    textTop: 10,
                    list: [
                      {
                        text: '- name: string\n+ setName(name: string): void',
                      },
                    ],
                  },
                },
                {
                  name: '类',
                  icon: 'l-class',
                  id: 47,
                  data: {
                    text: 'Topolgoy',
                    width: 270,
                    height: 200,
                    textHeight: 200,
                    name: 'interfaceClass',
                    textAlign: 'center',
                    textBaseline: 'top',
                    textTop: 10,
                    list: [
                      {
                        text: '- name: string',
                      },
                      {
                        text: '+ setName(name: string): void',
                      },
                    ],
                  },
                },
              ],
            },
            {
              name: '故障树',
              expanded: false, // 初始化展开状态为false
              show: true,
              list: [
                {
                  name: '与门',
                  icon: 'l-ANDmen',
                  data: {
                    name: 'andGate',
                    width: 100,
                    height: 150,
                  },
                },
                {
                  name: '基本事件',
                  icon: 'l-jibenshijian',
                  data: {
                    name: 'basicEvent',
                    width: 100,
                    height: 150,
                  },
                },
                {
                  name: '未展开事件',
                  icon: 'l-weizhankaishijian',
                  data: {
                    name: 'unexpandedEvent',
                    width: 100,
                    height: 150,
                  },
                },
                {
                  name: '优先AND门',
                  icon: 'l-youxianANDmen',
                  data: {
                    name: 'priorityAndGate',
                    width: 100,
                    height: 150,
                  },
                },
                {
                  name: '禁止门',
                  icon: 'l-jinzhimen',
                  data: {
                    name: 'forbiddenGate',
                    width: 100,
                    height: 150,
                  },
                },
                {
                  name: '事件',
                  icon: 'l-shijian',
                  data: {
                    name: 'event',
                    width: 100,
                    height: 150,
                  },
                },
                {
                  name: '开关事件',
                  icon: 'l-kaiguanshijian',
                  data: {
                    name: 'switchEvent',
                    width: 100,
                    height: 150,
                  },
                },
                {
                  name: '条件事件',
                  icon: 'l-tiaojianshijian',
                  data: {
                    name: 'conditionalEvent',
                    width: 150,
                    height: 100,
                  },
                },
                {
                  name: '转移符号',
                  icon: 'l-zhuanyifuhao',
                  data: {
                    name: 'transferSymbol',
                    width: 100,
                    height: 150,
                  },
                },
                {
                  name: '或门',
                  icon: 'l-ORmen',
                  data: {
                    name: 'orGate',
                    width: 100,
                    height: 150,
                  },
                },
                {
                  name: '异或门',
                  icon: 'l-yihuomen',
                  data: {
                    name: 'xorGate',
                    width: 100,
                    height: 150,
                  },
                },
                {
                  name: '表决门',
                  icon: 'l-biaojuemen',
                  data: {
                    name: 'votingGate',
                    width: 100,
                    height: 150,
                  },
                },
              ],
            },
            {
              name: '脑图',
              expanded: false, // 初始化展开状态为false
              show: true,
              list: [
                {
                  name: '主题',
                  icon: 'l-zhuti',
                  data: {
                    text: '主题',
                    width: 200,
                    height: 50,
                    name: 'mindNode',
                    borderRadius: 0.5,
                  },
                },
                {
                  name: '子主题',
                  icon: 'l-zizhuti',
                  data: {
                    text: '子主题',
                    width: 160,
                    height: 40,
                    name: 'mindLine',
                  },
                },
              ],
            },
          ]; // 更新items为获取到的文件夹和图纸数据

          console.log('items:', items.value);
          
        }
      });
    }
  });
};

onMounted(() => {
  // 获取当前用户信息
  getInfo().then((res: any) => {
    if (res.code === 200) {
      userName.value = res.user.userName; // 设置当前用户信息
      console.log('当前用户信息:', userName.value);
      // 存储在 localStorage 中
      getvalue(); // 获取文件夹列表
      // localStorage.setItem('userName', userName.value);
    } else {
      TMessage.error('获取用户信息失败');
    }
  });
  
});
</script>

<style lang="postcss" scoped>
.graphics {
  /* 保持原有样式 */
  img.custom-image {
    width: 100%;
    height: 28px;
    object-fit: contain;  /* 保持图片比例 */
    margin: auto;
    display: block;
  }
  height: calc(100vh - 80px);
  overflow-y: auto;
  border-right: 1px solid var(--color-border);
  z-index: 2;

  :deep(.t-collapse) {
    border-top: none;

    .t-collapse-panel__content {
      background-color: #ffffff;
      padding: 20px 4px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-row-gap: 12px;
    }

    .graphic {
      position: relative;
      padding: 10px 0;
      border-radius: 2px;
      border: 1px solid transparent;

      &:hover {
        cursor: pointer;
        border-color: var(--color-primary);
      }
      p {
        margin-top: 6px;
        padding: 0 8px;
        text-align: center;
        font-size: 12px;
        height: 12px;
        line-height: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        word-break: break-all;
        -webkit-box-orient: vertical;
      }

      svg {
        color: var(--color);
        height: 28px;
        width: 100%;
        margin: auto;
      }
    }
  }
}
</style>
