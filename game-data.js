// 家长人格类型数据
const parentTypes = [
    { 
        id: 'tiger', 
        name: '鸡血妈妈', 
        icon: '👩‍👧', 
        traits: '紧盯分数/爱晒排名', 
        strategy: '提供详细数据报表',
        sensitivity: { scores: 1.5, emotions: 0.8, academics: 1.2 }
    },
    { 
        id: 'zen', 
        name: '佛系爸爸', 
        icon: '👨‍👦', 
        traits: '嫌沟通频繁/怕麻烦', 
        strategy: '精简沟通+成果可视化',
        sensitivity: { scores: 0.7, emotions: 0.5, academics: 0.8 }
    },
    { 
        id: 'grand', 
        name: '隔代抚养', 
        icon: '👵', 
        traits: '宠溺孩子/不信新方法', 
        strategy: '打印成功案例',
        sensitivity: { scores: 0.9, emotions: 1.3, academics: 0.6 }
    },
    { 
        id: 'expert', 
        name: '高知家长', 
        icon: '👨‍🏫', 
        traits: '研究教育理论/爱质疑', 
        strategy: '学术话术+论文引用',
        sensitivity: { scores: 1.1, emotions: 0.7, academics: 1.4 }
    }
];

// 教培事件数据
const events = [
    { 
        id: 1, 
        title: "成绩危机", 
        description: "期中考孩子排名下滑20位！",
        tabooWords: ["退费", "别人家孩子", "没用"]
    },
    { 
        id: 2, 
        title: "课堂冲突", 
        description: "孩子说被同桌欺负，你们不管？",
        tabooWords: ["换座位", "不管事", "不负责任"]
    },
    { 
        id: 3, 
        title: "续费犹豫", 
        description: "隔壁机构承诺提分30，你们呢？",
        tabooWords: ["便宜", "免费", "打折"]
    },
    { 
        id: 4, 
        title: "效果质疑", 
        description: "学了半年口语还是不敢开口！",
        tabooWords: ["骗钱", "没效果", "白学"]
    }
];