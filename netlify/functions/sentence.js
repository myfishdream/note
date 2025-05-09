const sentences = [
    "(｡･ω･｡)ﾉ 今天也要元气满满地加油鸭！",
    "(๑•̀ㅂ•́)و✧ 今天的运势超棒，一定能实现目标！",
    "(ง •̀_•́)ง 努力的人运气都不会太差，继续前进吧！",
    "(●'◡'●)ﾉ 今天的你比昨天更强大，未来可期！",
    "(｡･ω･｡) 生活就像巧克力，你永远不知道下一块是什么味道",
    "(๑•̀ㅂ•́)و✧ 每一个不曾起舞的日子，都是对生命的辜负",
    "(ง •̀_•́)ง 当你感到疲惫时，记住你正在上坡",
    "(●'◡'●)ﾉ 生活不会亏待每一个努力的人",
    "(｡･ω･｡) 目标就在前方，继续前进吧！",
    "(๑•̀ㅂ•́)و✧ 成长的过程总是充满惊喜",
    "(ง •̀_•́)ง 今天的努力，是明天的礼物",
    "(●'◡'●)ﾉ 生活需要一点色彩，今天也要元气满满",
    "(｡･ω･｡) 阳光总在风雨后，请相信有彩虹",
    "(๑•̀ㅂ•́)و✧ 让生活充满节奏感，每天都是新的乐章",
    "(ง •̀_•́)ง 花开不败，未来可期",
    "(●'◡'●)ﾉ 人生就像一场精彩的表演，你是主角",
    "(｡･ω･｡) 生活需要一点幽默感，笑对每一天",
    "(๑•̀ㅂ•́)و✧ 保持热爱，奔赴山海",
    "(ง •̀_•́)ง 用画笔描绘梦想，用行动实现目标",
    "(●'◡'●)ﾉ 瞄准目标，勇往直前",
    "(｡･ω･｡) 种下希望的种子，收获美好的未来",
    "(๑•̀ㅂ•́)و✧ 让生活充满旋律，让梦想绽放光彩",
    "(ง •̀_•́)ง 星光不负赶路人，时光不负有心人",
    "(●'◡'●)ﾉ 今天的你比昨天更优秀，明天会更出色！",
    "(｡･ω･｡) 好运正在向你走来，保持微笑吧！",
    "(๑•̀ㅂ•́)و✧ 今天的努力，是明天的幸运",
    "(ง •̀_•́)ง 坚持就是胜利，你离成功只差一步！",
    "(●'◡'●)ﾉ 生活不会辜负每一个努力的人",
    "(｡･ω･｡) 今天的你，比昨天更接近梦想",
    "(๑•̀ㅂ•́)و✧ 好运正在路上，保持期待吧！"
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
