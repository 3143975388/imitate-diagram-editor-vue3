// typeOptions有comparison关系运算，无是null，还有代码1是code1，2是code2再加个自定义代码
export const typeOptionsList = [
  { value: '', label: '无' },
  { value: 'comparison', label: '关系运算' },
  { value: 'code1', label: '代码1' },
  { value: 'code2', label: '代码2' },
  { value: 'custom', label: '自定义运算' },
];

// keyOptions有文字、值、进度值、状态
export const keyOptionsList = [
  { value: 'text', label: '文字' },
  { value: 'value', label: '值' },
  { value: 'progress', label: '进度值' },
  { value: 'showChild', label: '状态' },
];
 
export const comparisonOptionsList = [
  { value: '>', label: '大于' },
  { value: '>=', label: '大于等于' },
  { value: '<', label: '小于' },
  { value: '<=', label: '小于等于' },
  { value: '=', label: '等于' },
  { value: '!=', label: '不等于' },
  { value: '[)', label: '包含/介于' },
  { value: '![)', label: '不包含/不介于' },
  { value: '[)', label: '前闭后开' },
  { value: '[]', label: '属于' },
  { value: '![]', label: '不属于' },
];


export const attributeTypeOptionsList = [
  { value: 'background', label: '背景颜色' },
  { value: 'color', label: '颜色' },
  { value: 'text', label: '文字' },
  { value: 'x', label: 'X' },
  { value: 'y', label: 'Y' },
  { value: 'width', label: '宽度' },
  { value: 'height', label: '高度' },
  { value: 'visible', label: '显示' },
  { value: 'progress', label: '进度值' },
  { value: 'progressColor', label: '进度颜色' },
  { value: 'value', label: '值' },
  { value: 'showChild', label: '状态' },
  { value: 'rotate', label: '旋转' },
  { value: 'disabled', label: '禁用' },
];

export const eventTypeOptionsList = [
  { value: 'enter', label: '鼠标移入' },
  { value: 'leave', label: '鼠标移出' },
  { value: 'active', label: '选中' },
  { value: 'inactive', label: '取消选中' },
  { value: 'mousedown', label: '鼠标按下' },
  { value: 'mouseup', label: '鼠标弹起' },
  { value: 'contextmenu', label: '鼠标右键' }, // 右键事件通常对应 contextmenu
  { value: 'click', label: '单击' },
  { value: 'dblclick', label: '双击' },
  { value: 'valueUpdate', label: '值变化' },
];

enum EventAction {
  Link,           // 打开链接  
  SetProps,       // 更改属性
  StartAnimate,   // 执行动画
  PauseAnimate,   // 暂停动画
  StopAnimate,    // 停止动画
  JS,             // 执行JS代码
  GlobalFn,       // 执行全局函数
  Emit,           // 发送消息
  StartVideo,     // 播放视频
  PauseVideo,     // 暂停视频
  StopVideo,      // 停止视频
  SendPropData,   // 发送图元数据
  SendVarData,    // 发送绑定变量
  ssxx,
  Dialog, //对话框 14 // 打开对话框
}

export const eventBehaviorOptionsList = [
  { value: EventAction.Link, label: '打开链接' },
  { value: EventAction.SetProps, label: '更改属性' },
  { value: EventAction.StartAnimate, label: '执行动画' },
  { value: EventAction.PauseAnimate, label: '暂停动画' },
  { value: EventAction.StopAnimate, label: '停止动画' },
  { value: EventAction.JS, label: '执行javascript' },
  { value: EventAction.GlobalFn, label: '执行windows函数' },
  { value: EventAction.Emit, label: '发送消息' },
  { value: EventAction.StartVideo, label: '播放视频' },
  { value: EventAction.PauseVideo, label: '暂停视频' },
  { value: EventAction.StopVideo, label: '停止视频' },
  { value: EventAction.SendPropData, label: '发送图元数据' },
  { value: EventAction.SendVarData, label: '发送绑定变量' },
  { value: EventAction.Dialog, label: '打开弹窗' },
];

export const openWithOptionsList = [
  { value: '_blank', label: '新窗口' },
  { value: '_self', label: '当前窗口' },
];