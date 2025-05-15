const sentences = [
    "(ง •̀_•́)ง 代码改变世界，你改变代码",
    "(●'◡'●)ﾉ 每一个bug都是成长的机会",
    "(｡･ω･｡) 让代码如诗，让生活如画",
    "(๑•̀ㅂ•́)و✧ 编程之路，永无止境",
    "(ง •̀_•́)ง 今天的代码，明天的产品",
    "(●'◡'●)ﾉ 让技术改变生活，让创新改变世界",
    "(｡･ω･｡) 代码如诗，生活如歌",
    "(๑•̀ㅂ•́)و✧ 让编程充满乐趣，让生活充满惊喜",
    "(ง •̀_•́)ง 每一个项目都是新的开始",
    "(●'◡'●)ﾉ 让技术温暖生活，让代码改变世界",
    "(｡･ω･｡) 编程如诗，生活如画",
    "(๑•̀ㅂ•́)و✧ 代码改变世界，创新改变未来",
    "(ง •̀_•́)ง 让技术改变生活，让创新改变世界",
    "(●'◡'●)ﾉ 编程之路，永无止境",
    "(｡･ω･｡) 让代码如诗，让生活如画",
    "(๑•̀ㅂ•́)و✧ 每一个bug都是成长的机会",
    "(ง •̀_•́)ง 代码改变世界，你改变代码",
    "(●'◡'●)ﾉ 让技术温暖生活，让代码改变世界",
    "(｡･ω･｡) 编程如诗，生活如歌",
    "(๑•̀ㅂ•́)و✧ 让编程充满乐趣，让生活充满惊喜",
    "(ง •̀_•́)ง 每一个项目都是新的开始",
    "(●'◡'●)ﾉ 让技术改变生活，让创新改变世界",
    "(｡･ω･｡) 代码如诗，生活如画",
    "(๑•̀ㅂ•́)و✧ 编程之路，永无止境",
    "(ง •̀_•́)ง 今天的代码，明天的产品",
    "(●'◡'●)ﾉ 让技术温暖生活，让代码改变世界",
    "(｡･ω･｡) 编程如诗，生活如歌",
    "(๑•̀ㅂ•́)و✧ 让编程充满乐趣，让生活充满惊喜",
    "(ง •̀_•́)ง 每一个项目都是新的开始",
    "(●'◡'●)ﾉ 让技术改变生活，让创新改变世界"
];

// 用于存储上次请求的时间戳
let lastRequestTime = 0;
const DEBOUNCE_TIME = 1000; // 1秒的防抖时间

exports.handler = async function(event, context) {
    const currentTime = Date.now();
    
    // 检查是否在防抖时间内
    if (currentTime - lastRequestTime < DEBOUNCE_TIME) {
        return {
            statusCode: 429, // Too Many Requests
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Retry-After': '1'
            },
            body: JSON.stringify({
                error: '请求过于频繁，请稍后再试',
                retryAfter: 1
            })
        };
    }
    
    // 更新最后请求时间
    lastRequestTime = currentTime;
    
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const randomSentence = sentences[randomIndex];
    
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            sentence: randomSentence
        })
    };
};
