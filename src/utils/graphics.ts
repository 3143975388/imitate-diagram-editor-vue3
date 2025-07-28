// graphics.js
const CES_IMAGES = import.meta.glob('/src/image/ces/**/*.(png|jpg|jpeg|svg|webp|gif)', {
  eager: true,
  query: { url: true }
})

// 生成树形结构配置
const generateImageGroups = () => {
  
  const groups = new Map() // 使用Map保存分组结构

  Object.keys(CES_IMAGES).forEach(path => {
    // 提取路径中的有效部分
    const segments = path
      .replace('/src/image/ces/', '')
      .split('/')
      .filter(Boolean)

    let currentLevel = groups
    let fullPath = ''

    // 遍历路径构建层级
    segments.forEach((segment, index) => {
      fullPath += `/${segment}`

      if (index === segments.length - 1) {
        // 文件节点
        const parent = currentLevel.get('_children') || currentLevel
        const fileName = segment.split('.').slice(0, -1).join('.')
        
        parent.set(fileName, {
          name: fileName,
          type: 'image',
          image: path.replace('/public', ''),
          data: {
            name: `image-${fileName}`,
            width: 100, // 默认尺寸，实际尺寸需要异步加载
            height: 100,
            image: true
          }
        })
      } else {
        // 目录节点
        if (!currentLevel.has(segment)) {
          const groupMap = new Map<string, any>();
          groupMap.set('_meta', { name: segment, type: 'group' });
          groupMap.set('_children', new Map());
          currentLevel.set(segment, groupMap);
        }
        currentLevel = currentLevel.get(segment).get('_children')
      }
    })
  })

  // 转换Map为可用配置格式
  const convertMapToGroups = (map: Map<string, any>): any[] => {
    return Array.from(map.entries()).map(([key, value]) => {
      if (value instanceof Map) {
        return {
          name: value.get('_meta').name,
          show: true,
          list: convertMapToGroups(value.get('_children'))
        }
      }
      return value
    })
  }
  
  return convertMapToGroups(groups)
}

// 合并自动生成的配置与原有配置
const graphicGroups = [
  {name: '测试', show: true, list: [{name: '304',  type:'image',image:'/image-proxy/test/2025/06/16/696d53ccb52e6bdb6694ab36c7d7a15_20250616145338A023.png',data:{name:'image-900',width: 79, height: 30,image:true}}]},
  ...generateImageGroups(),
  {
    name: '基本形状',
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
  // 其他手动配置的组...
]

export default graphicGroups