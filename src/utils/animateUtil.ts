export const animateType = [
  { 
    name: '上下跳动',
    animateType: "upDown",
    frames: [
    {
    "y": -10,
    "duration": 100
    },
    {
    "y": 10,
    "duration": 80
    },
    {
    "y": -10,
    "duration": 50
    },
    {
    "y": 10,
    "duration": 30
    },
    {
    "y": 0,
    "duration": 300
    }
    ],
    showDuration: 560,
  },
  { 
    name: '左右跳动',
    animateType: "leftRight",
    frames: [
    {
    "x": -10,
    "duration": 100
    },
    {
    "x": 10,
    "duration": 80
    },
    {
    "x": -10,
    "duration": 50
    },
    {
    "x": 10,
    "duration": 30
    },
    {
    "x": 0,
    "duration": 300
    }
    ],
    showDuration: 560,
  },
  {
    name: '心跳',
    animateType: "heart",
    frames: [
    {
    "scale": 1.1,
    "duration": 100
    },
    {
    "scale": 1,
    "duration": 400
    }
    ],
    showDuration: 500,
  },
  {
    name:'炫耀',
    animateType: "show",
    frames: [
    {
    "color": "#fa541c",
    "rotate": -10,
    "duration": 100
    },
    {
    "color": "#fa541c",
    "rotate": 10,
    "duration": 100
    },
    {
    "color": "#fa541c",
    "rotate": 0,
    "duration": 100
    }
    ],
    showDuration: 300,
  },
  { 
    name: '旋转',
    animateType: "rotate",
    frames: [
    {
    "rotate": 360,
    "duration": 1000
    }
    ],
    showDuration: 1000,
  },
  { 
    name: '逆向旋转',
    animateType: "rerotate",
    frames: [
    {
    "rotate": -360,
    "duration": 1000
    }
    ],
    showDuration: 1000,
  },
  {
    name: '放大缩小',
    animateType: "zoom",
    frames: [
    {
    "scale": 1.1,
    "duration": 100
    },
    {
    "scale": 1,
    "duration": 100
    },
    {
    "scale": 1.1,
    "duration": 100
    },
    {
    "scale": 1,
    "duration": 100
    }
    ],
    showDuration: 500,
  },
  {
    name: '移动',
    animateType: "move",
    frames: [
    {
    "x": 100,
    "y": 100,
    "duration": 1000
    },
    {
    "x": 0,
    "y": 0,
    "duration": 1000
    }
    ],
    showDuration: 1000,
  },
  {
    name: '闪烁',
    animateType: "blink",
    frames: [
    {
    "globalAlpha": 0.5,
    "duration": 100
    },
    {
    "globalAlpha": 1,
    "duration": 100
    },
    {
    "globalAlpha": 0.5,
    "duration": 100
    },
    {
    "globalAlpha": 1,
    "duration": 100
    }
    ],
    showDuration: 400,
  },
  {
    name:'自定义动画',
    animateType: "custom",
  }
];

// dashList
export const dashs = [
  {
    label:"直线",
    value:0
  },
  {
    label:"虚线1",
    value:1
  },
  {
    label:"虚线2",
    value:2
  },
  {
    label:"点横线",
    value:3
  },
];

// strokeTypeList无是0线性渐变是1
export const strokeTypes = [
  {
    label: "无",
    value: 0
  },
  {
    label: "线性渐变",
    value: 1
  }
];

// bkTypeList纯色背景是0，线性渐变是1，径向渐变是2
export const bkTypes = [
  {
    label: "纯色背景",
    value: 0
  },
  {
    label: "线性渐变",
    value: 1
  },
  {
    label: "径向渐变",
    value: 2
  }
];

// fontFamilyList斗鱼追光体
export const fontFamilys = [
  {
    label: "斗鱼追光体",
    value: "DouyuZG"
  },
  {
    label: "微软雅黑",
    value: "Microsoft YaHei"
  },
  {
    label: "宋体",
    value: "SimSun"
  },
  {
    label: "黑体",
    value: "SimHei"
  },
  {
    label: "楷体",
    value: "KaiTi"
  },
  {
    label: "隶书",
    value: "LiSu"
  },
  {
    label: "幼圆",
    value: "YouYuan"
  },
  {
    label: "Arial",
    value: "Arial"
  },
  {
    label: "Times New Roman",
    value: "Times New Roman"
  },
  {
    label: "Courier New",
    value: "Courier New"
  },
  {
    label: "Verdana",
    value: "Verdana"
  },
  {
    label: "Tahoma",
    value: "Tahoma"
  }
];

// fontStyleList正常是normal，倾斜是italic
export const fontStyles = [
  {
    label: "正常",
    value: "normal"
  },
  {
    label: "倾斜",
    value: "italic"
  }
];

// textAlignList水平对齐方式左对齐是left，居中是center，右对齐是right
export const textAligns = [
  {
    label: "左对齐",
    value: "left"
  },
  {
    label: "居中",
    value: "center"
  },
  {
    label: "右对齐",
    value: "right"
  }
];

// fontWeightList正常是normal，加粗是bold
export const fontWeights = [
  {
    label: "正常",
    value: "normal"
  },
  {
    label: "加粗",
    value: "bold"
  }
];

// textBaselineList垂直对齐方式顶部对齐是top，居中是middle，底部对齐是bottom
export const textBaselines = [
  {
    label: "顶部对齐",
    value: "top"
  },
  {
    label: "居中",
    value: "middle"
  },
  {
    label: "底部对齐",
    value: "bottom"
  }
];

// whiteSpaceList空白处理方式默认是''，回车换行是pre-line，不换行是nowrap，永远换行是break-all
export const whiteSpaces = [
  {
    label: "默认",
    value: ''
  },
  {
    label: "回车换行",
    value: 'pre-line'
  },
  {
    label: "不换行",
    value: 'nowrap'
  },
  {
    label: "永远换行",
    value: 'break-all'
  }
];

// ellipsisList是是true，否是false
export const ellipsiss = [
  {
    label: "是",
    value: true
  },
  {
    label: "否",
    value: false
  }
];

// iconAlignList居中是center，上是top，下是bottom，左是left，右是right，左上是top-left，左下是bottom-left，右上是top-right，右下是bottom-right
export const iconAligns = [
  {
    label: "居中",
    value: "center"
  },
  {
    label: "上",
    value: "top"
  },
  {
    label: "下",
    value: "bottom"
  },
  {
    label: "左",
    value: "left"
  },
  {
    label: "右",
    value: "right"
  },
  {
    label: "左上",
    value: "top-left"
  },
  {
    label: "左下",
    value: "bottom-left"
  },
  {
    label: "右上",
    value: "top-right"
  },
  {
    label: "右下",
    value: "bottom-right"
  }
];