/*
      需求： 对比curData与defalutData里面的数据，生成一个新对象
      新对象满足以下条件：(依据->通过label属性判断数据是否存在)
          1. defaultData里面有的数据，curData没有，则增；
          2. defaultData里面没有的数据，curData有，则减；
          3. 同时存在curData与defauleData里面的数据，如果width不相同，以curData里面的width为准；
  */
 let curData = {
  name: [
    {
      label: 'normal_msg',
      value: '基本信息',
      child: [
        {
          label: 'lucy',
          value: '露西',
          width: 100,
        },
        {
          label: 'John',
          value: '约翰',
          width: 120,
        },
      ],
    },
  ],
  age: [
    {
      label: 'normal_msg',
      value: '基本信息',
      child: [
        {
          label: 'child',
          value: '12',
          width: 90,
        },
        {
          label: 'young',
          value: '21',
          width: 90,
        },
        {
          label: 'old',
          value: '60',
          width: 150,
        },
      ],
    },
  ],
  hobby: [
    {
      label: 'normal_msg',
      value: '基本信息',
      child: [
        {
          label: 'run',
          value: '跑步',
          width: 90,
        },
        {
          label: 'skip',
          value: '滑冰',
          width: 100,
        },
        {
          label: 'jump',
          value: '跳',
          width: 100,
        },
      ],
      moreMsg: [
        {
          label: 'apply_msg',
          value: '报销信息',
          child: [
            {
              label: 'invoiceDate',
              value: '报销日期',
              width: 100,
            },
            {
              label: 'amount',
              value: '报销金额',
              width: 100,
            },
          ],
        },
      ],
    },
  ],
  color: [
    {
      label: 'normal_msg',
      value: '基本信息',
      child: [
        {
          label: 'blue',
          value: '蓝色',
          width: 80,
        },
      ],
    },
  ],
};

let defaultData = {
  name: [
    {
      label: 'normal_msg',
      value: '基本信息',
      child: [
        {
          label: 'lily',
          value: '丽丽',
          width: 100,
        },
        {
          label: 'lucy',
          value: '露西',
          width: 120,
        },
        {
          label: 'John',
          value: '约翰',
          width: 100,
        },
      ],
    },
  ],
  age: [
    {
      label: 'normal_msg',
      value: '基本信息',
      child: [
        {
          label: 'child',
          value: '12',
          width: 90,
        },
        {
          label: 'old',
          value: '60',
          width: 150,
        },
      ],
    },
  ],
  hobby: [
    {
      label: 'normal_msg',
      value: '基本信息',
      child: [
        {
          label: 'run',
          value: '跑步',
          width: 90,
        },
        {
          label: 'skip',
          value: '滑冰',
          width: 100,
        },
        {
          label: 'jump',
          value: '跳',
          width: 100,
        },
      ],
      moreMsg: [
        {
          label: 'invoice_msg',
          value: '发票信息',
          child: [
            {
              label: 'code',
              value: '发票代码',
              width: 120,
            },
            {
              label: 'number',
              value: '发票号码',
              width: 110,
            },
          ],
        },
        {
          label: 'apply_msg',
          value: '报销信息',
          child: [
            {
              label: 'spno',
              value: '报销编号',
              width: 100,
            },
            {
              label: 'amount',
              value: '报销金额',
              width: 100,
            },
          ],
        },
      ],
    },
  ],
  food: [
    {
      label: 'normal_msg',
      value: '基本信息',
      child: [
        {
          label: 'orange',
          value: '橘子',
          width: 80,
        },
      ],
    },
  ],
};

// 生成的新对象
let newData = {
  name: [
    {
      label: 'normal_msg',
      value: '基本信息',
      child: [
        {
          label: 'lily',
          value: '丽丽',
          width: 100,
        },
        {
          label: 'lucy',
          value: '露西',
          width: 120,
        },
        {
          label: 'John',
          value: '约翰',
          width: 120,
        },
      ],
    },
  ],
  age: [
    {
      label: 'normal_msg',
      value: '基本信息',
      child: [
        {
          label: 'child',
          value: '12',
          width: 90,
        },
        {
          label: 'old',
          value: '60',
          width: 150,
        },
      ],
    },
  ],
  hobby: [
    {
      label: 'normal_msg',
      value: '基本信息',
      child: [
        {
          label: 'run',
          value: '跑步',
          width: 90,
        },
        {
          label: 'skip',
          value: '滑冰',
          width: 100,
        },
        {
          label: 'jump',
          value: '跳',
          width: 100,
        },
      ],
      moreMsg: [
        {
          label: 'invoice_msg',
          value: '发票信息',
          child: [
            {
              label: 'code',
              value: '发票代码',
              width: 120,
            },
            {
              label: 'number',
              value: '发票号码',
              width: 110,
            },
          ],
        },
        {
          label: 'apply_msg',
          value: '报销信息',
          child: [
            {
              label: 'spno',
              value: '报销编号',
              width: 100,
            },
            {
              label: 'amount',
              value: '报销金额',
              width: 100,
            },
          ],
        },
      ],
    },
  ],
  food: [
    {
      label: 'normal_msg',
      value: '基本信息',
      child: [
        {
          label: 'orange',
          value: '橘子',
          width: 80,
        },
      ],
    },
  ],
};

function merge(defaultData, curData) {
  // 深克隆
  const res = JSON.parse(JSON.stringify(defaultData));

  for (const key in curData) {
    // 第一层
    const levelOne = curData[key]
    if (res[key]) {
      // 第二层
    levelOne.forEach((l, i) => {
      const {child, moreMsg} = l;
      // 第三层
      child.forEach((c, index) => {
        const {width, label} = c;
        const originIndex = res[key][i].child.findIndex(c => c.label === label)
        if (res[key][i].child[index] && originIndex > -1) {
          res[key][i].child[originIndex].width = width;
        }
      })

      moreMsg && moreMsg.forEach((c, index) => {
        const {width, label, child} = c;
        if (res[key][i].moreMsg[index].label === label) {
          child.forEach((c, innerIndex) => {
            const {label} = c;
            const originIndex = res[key][i].moreMsg[index].child.findIndex(c => c.label === label)
            if (res[key][i].moreMsg[index].child[innerIndex] && originIndex > -1) {
              res[key][i].moreMsg[index].child[originIndex].width = width;
            }
          })
        }
      })
    })
    }
  }
  console.log(res, "res")
  return res;
}

merge(defaultData, curData)

function getNestKeys (data) {
  if (typeof data !== "object") {
    return []
  }
  const keys = Object.keys(data)
  return keys.reduce((acc, cur) => {
    return acc.concat(getNestKeys(data[cur]))
  }, keys)
}