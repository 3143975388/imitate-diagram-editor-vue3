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
          v-model="data.background"
          :show-primary-color-preview="false"
          format="CSS"
          :color-modes="['monochrome']"
          @change="onChangeData"
        />
      </t-form-item>
      <t-form-item label="背景图片" name="bkImage">
        <t-space>
          <t-upload
            ref="uploadRef1"
            v-model="file1"
            :image-viewer-props="imageViewerProps"
            :size-limit="sizeLimit"
            theme="image"
            accept="image/*"
            :disabled="disabled"
            :auto-upload="autoUpload"
            :show-image-file-name="showImageFileName"
            :max="1"
            :request-method="customUploadMethod"
            :locale="{
              triggerUploadText: {
                image: '请选择图片',
              },
            }"
            @success="handleSuccess"
            @fail="handleFail"
            @remove="handleRemove"
          />
        </t-space>
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
        <t-switch v-model="data.previewUnScale" @change="onChangeOptions" />
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
import { onMounted, reactive,ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { uploadFile } from '@/api/photo/photo'; // 导入您的上传API
// 背景图片上传数据
const file1 = ref<any[]>([]); 

const imageViewerProps = ref({ closeOnEscKeydown: false });
const sizeLimit = ref({ size: 5000, unit: 'KB' });
const disabled = ref(false);
const autoUpload = ref(true);
const showImageFileName = ref(false);

// 图纸数据
const data = reactive<any>({
  name: '',
  background: undefined,
  color: undefined,
});

// 画布选项
const options = reactive<any>({
  grid: false,
  lineCross: false,
  autoSizeinPc: false,
  autoSizeinMobile: false,
  previewUnScale: false,
  rule: false,
  gridSize: 10,
  gridRotate: undefined,
  gridColor: undefined,
  background: undefined,
  bkImage: undefined,
});

// 自定义上传方法
const customUploadMethod = async (files: any): Promise<any> => {
  try {
    // 处理单文件上传（因为设置了 max=1）
    const file = Array.isArray(files) ? files[0] : files;
    
    if (!file?.raw) {
      throw new Error('无效的文件');
    }
    
    // 创建 FormData（只包含文件）
    const formData = new FormData();
    formData.append('file', file.raw);
    
    // 调用您的上传接口
    const response = await uploadFile(formData);
    
    // 返回上传成功响应
    return {
      status: 'success',
      response: response
    };
  } catch (error) {
    console.error('上传失败:', error);
    
    // 返回上传失败响应
    return {
      status: 'fail',
      error: '上传失败',
    };
  }
};

const handleFail = (context: any) => {
  const fileName = context.file?.name || '未知文件';
  MessagePlugin.error(`文件 ${fileName} 上传失败: ${context.response?.error || '未知错误'}`);
};

const handleSuccess = (context: any) => {
  console.log('上传成功', context);
  
  const imageUrl = context.file.response?.data?.url;
  
  if (!imageUrl) {
    MessagePlugin.error('获取图片URL失败');
    return;
  }
  meta2d.store.data.bkImage = imageUrl;
  meta2d.setBackgroundImage(imageUrl);
  meta2d.render();
};

// 新增删除处理函数
const handleRemove = (context: any) => {
  // 从画布数据中移除背景图片
  meta2d.store.data.bkImage = undefined;
  // 从options中移除背景图片
  options.bkImage = undefined;
  // 清空上传文件列表
  file1.value = [];
  meta2d.setBackgroundImage('');
  meta2d.render();
  // 刷新这个页面
  MessagePlugin.success('背景图片已删除');
};

onMounted(() => {
  const d: any = meta2d.data();
  data.name = d.name || '';
  data.background = d.background;
  data.color = d.color;
  if(d.bkImage) {
    file1.value = [{
      name: '背景图片',
      url: d.bkImage,
      raw: null, // raw 需要在上传时设置
    }];
  }
  Object.assign(options, meta2d.getOptions());
});

const onChangeData = () => {
  console.log(options);
  console.log(meta2d.store.data);
  Object.assign(meta2d.store.data, data);
  meta2d.store.patchFlagsBackground = true;
  meta2d.render();
  onChangeOptions();
};

const onChangeOptions = () => {
  console.log(options.value);
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
