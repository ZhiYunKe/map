/* Shanghai journey — planning allowances, not live arrivals. */
window.TRIP_DATA = {
  "meta": {
    "title": "上海 · 城市漫游",
    "year": "2026",
    "dates": "10.02 — 10.05",
    "arrival": "10月2日晚抵达，入住全季浦东大道店",
    "departure": "10月5日 08:40 · 虹桥 T2 → 青岛",
    "hotel": "全季酒店（上海陆家嘴浦东大道店）",
    "hotelAddress": "浦东大道1139弄3号 · 惠扬大厦",
    "station": "14号线 · 源深路站",
    "note": "建筑、坐标与连线为游览示意，不按真实比例，也不代表实际轨道走向。交通、候车和排队均为规划预留。",
    "verified": "票务与校园规则于2026年9月26日复核；国庆安排以官方最新公告为准。",
    "flightNote": "05:51是当前第三方时刻表参考。请在10月4日晚用上海地铁官方渠道复核首班和换乘；地铁方案预计06:45—07:00到T2出发大厅，不能保证到达时刻。"
  },
  "places": [
    {
      "id": "hotel",
      "name": "全季酒店 · 浦东大道店",
      "short": "全季酒店",
      "subtitle": "每一天从这里出发",
      "position": [
        6,
        -4
      ],
      "kind": "hotel",
      "day": 0,
      "time": "10月2日晚入住 · 10月5日05:20退房",
      "duration": "3晚住宿",
      "wait": "离店前预留10分钟退房与整理",
      "ticket": "酒店入住按你的订单办理；随身带好身份证。",
      "transport": "浦东大道1139弄3号惠扬大厦。步行至14号线源深路站约5分钟，另留进站安检时间。",
      "description": "陆家嘴、艺术馆、校园与机甲，白天向城市出发，夜晚回到浦东大道。2日晚的到达交通待抵达地点和时间确定后补充。",
      "tags": [
        "源深路站",
        "住宿",
        "行程起点"
      ],
      "sourceUrl": "https://hotels.ctrip.com/hotels/6257126.html"
    },
    {
      "id": "china",
      "name": "上海美术馆／中华艺术宫",
      "short": "中华艺术宫",
      "subtitle": "中国红，开启艺术的一天",
      "position": [
        4,
        5.5
      ],
      "kind": "museum",
      "day": 3,
      "time": "10月3日 09:35到达 · 10:15—11:45参观",
      "duration": "看展90分钟",
      "wait": "等开馆25分钟＋安检15分钟",
      "ticket": "常设展免费，按现场指引领票；收费特展另购。个人常规参观通常无需提前预约，出发前核对国庆公告。",
      "transport": "酒店08:35出发 → 源深路14号线往封浜 → 大世界换8号线往沈杜公路 → 中华艺术宫3号口 → 步行到西门。全程预留60分钟，含安检及候车约15分钟。",
      "description": "先在馆外看红色建筑，再挑感兴趣的展厅。入馆按最新指引前往上南路153号西门；把精力留给下午的浦东美术馆。",
      "tags": [
        "10.03",
        "常设展免费",
        "艺术"
      ],
      "sourceUrl": "https://www.artmuseumonline.org/art/art/visitGuide/fwxx/index.html"
    },
    {
      "id": "map",
      "name": "浦东美术馆",
      "short": "浦东美术馆",
      "subtitle": "在黄浦江边慢下来",
      "position": [
        2.2,
        -2.5
      ],
      "kind": "gallery",
      "day": 3,
      "time": "10月3日 12:50到达 · 13:10—15:10看展",
      "duration": "看展120分钟",
      "wait": "检票、安检预留20分钟",
      "ticket": "建议提前买10月3日日间适用票。日常凭票入馆，无需另预约；高峰可能临时限流或分时预约。官方票务页注明售出不退不换，购买前先核对展览。",
      "transport": "中华艺术宫 → 8号线往市光路 → 大世界换14号线往桂桥路 → 陆家嘴 → 步行至富城路近明珠塔路口的馆入口。全程65分钟，含候车安检15分钟。",
      "description": "午间直接衔接浦东美术馆，保留两小时看展。之后去三件套机位和上海中心，晚上再到北外滩看江岸夜景。",
      "tags": [
        "提前购票",
        "看展",
        "江景"
      ],
      "sourceUrl": "https://www.museumofartpd.org.cn/ticketing"
    },
    {
      "id": "tower",
      "name": "三件套机位＋上海中心",
      "short": "三件套／上海中心",
      "subtitle": "从街头抬头，到云端俯瞰",
      "position": [
        4.3,
        -0.8
      ],
      "kind": "tower",
      "day": 3,
      "time": "10月3日 15:40拍照 · 17:25—18:25观景",
      "duration": "拍照30分钟＋观景60分钟",
      "wait": "机位约20分钟＋上楼60分钟＋下楼30分钟",
      "ticket": "街头机位免费。上海中心购买“上海之巅”118层观光厅门票；如须选入场时段，选择覆盖16:25的场次。若已购票，先核对场次与退改规则，勿重复购买。",
      "transport": "浦东美术馆步行30分钟 → 花园石桥路×东泰路拍照 → 步行15分钟到上海中心观光入口。下楼吃晚饭后，从陆家嘴14号线往封浜 → 豫园换10号线往基隆路 → 天潼路换12号线往金海路 → 国际客运中心，步行到北外滩滨江。全段预留60分钟，含步行换乘30分钟、乘车15分钟、安检候车15分钟。",
      "description": "下午在街头收下三件套，再在高空看城市从傍晚走入夜色。观景后下楼吃晚饭，接着去北外滩散步；日落、亮灯与能见度按当天情况。",
      "tags": [
        "提前购票",
        "傍晚观景",
        "三件套"
      ],
      "sourceUrl": "https://www.shanghaitower.com/shagnhai.html"
    },
    {
      "id": "northbund",
      "name": "北外滩 · 滨江夜游",
      "short": "北外滩",
      "subtitle": "换到江的另一边，看亮起来的陆家嘴",
      "position": [
        -1.5,
        -4.8
      ],
      "kind": "waterfront",
      "day": 3,
      "time": "10月3日 20:45—21:25",
      "duration": "滨江散步40分钟",
      "wait": "已含拍照等位约10—15分钟；不排热门机位长队",
      "ticket": "公共滨江步道通常无需门票或预约。只安排户外散步；岸线开放时间、国庆临时限流或封闭以现场公告为准。",
      "transport": "19:45从陆家嘴出发 → 14号线往封浜到豫园 → 10号线往基隆路到天潼路 → 12号线往金海路到国际客运中心，3号口出站后按指引步行到国客中心滨江段。去程60分钟；21:25返程，12号线往七莘路 → 天潼路换10号线往虹桥火车站／航中路 → 豫园换14号线往桂桥路 → 源深路，连同步行、换乘、安检候车共65分钟，预计22:30回酒店。",
      "description": "围绕国客中心滨江段慢走、拍陆家嘴天际线，不把整条北外滩走完。21:25收尾返程；若岸线临时管控，按现场指引改走开放的公共步道。",
      "tags": [
        "10.03晚",
        "户外散步",
        "浦江夜景"
      ],
      "sourceUrl": "https://www.shhk.gov.cn/qyfwy/030002/030002002/030002002004/20210628/78d6265e-8fa3-41cb-8c2b-2c30fdddb759.html"
    },
    {
      "id": "yida",
      "name": "中共一大纪念馆＋一大会址",
      "short": "一大纪念馆／会址",
      "subtitle": "石库门里的历史坐标",
      "position": [
        -1.6,
        1
      ],
      "kind": "historic",
      "day": 4,
      "time": "10月4日 08:40到达 · 09:20—11:30参观",
      "duration": "纪念馆90分钟＋会址约15分钟",
      "wait": "等开馆与安检40分钟；会址另排队约20分钟",
      "ticket": "普通参观免费、免预约，两处分别入场排队。讲解和宣誓服务另有预约规则。常规9:00开馆，国庆安排出发前复核。",
      "transport": "酒店07:50出发 → 源深路14号线往封浜 → 一大会址·黄陂南路 → 步行到纪念馆。含步行、候车和安检共50分钟。",
      "description": "先看纪念馆展陈，再走到会址。参观后在新天地街区散步半小时，随后直接前往交大徐汇校区。",
      "tags": [
        "免费免预约",
        "历史",
        "新天地"
      ],
      "sourceUrl": "https://www.zgyd1921.com/about.html"
    },
    {
      "id": "wukang",
      "name": "武康路夜游＋武康大楼",
      "short": "武康路／武康大楼",
      "subtitle": "让梧桐街巷，为这趟漫游收尾",
      "position": [
        -5,
        0.7
      ],
      "kind": "historic",
      "day": 4,
      "time": "10月4日 18:40—19:40",
      "duration": "街区夜游60分钟",
      "wait": "含拍照停留与人流缓冲约15分钟",
      "ticket": "安排武康路公共街道与武康大楼外观，无需门票或预约。夜间不安排故居、美术馆等室内参观，商户开放以现场为准。",
      "transport": "17:40从萨姆周边出发 → 桂林公园12号线往金海路 → 龙华换11号线往嘉定北／花桥 → 交通大学，步行到武康大楼。乘车20分＋步行换乘25分＋安检候车15分，共60分钟。19:40从武康路南段收尾 → 步行交通大学站 → 10号线往基隆路 → 豫园换14号线往桂桥路 → 源深路，预留65分钟回酒店。",
      "description": "从武康大楼看起，沿武康路南段走到武康庭与泰安路一带，再折返淮海中路。慢走、拍街景，19:40结束，预计20:45回店整理行李。",
      "tags": [
        "10.04晚",
        "梧桐街巷",
        "外观拍照"
      ],
      "sourceUrl": "https://www.shanghai.gov.cn/citywalk/20260625/3492b1b945c146fc96c4585d7b04f00d.html"
    },
    {
      "id": "sjtu",
      "name": "上海交通大学 · 徐汇校区",
      "short": "交大徐汇",
      "subtitle": "在老校园走一段慢时光",
      "position": [
        -5.5,
        2.4
      ],
      "kind": "campus",
      "day": 4,
      "time": "10月4日 13:10—14:40",
      "duration": "校园散步90分钟",
      "wait": "指定校门入校核验预留20分钟",
      "ticket": "参观免费，个人须实名登记／预约并带身份证。“上海交通大学”公众号 → 参观交大 → 徐汇校区；当日登记及开放时段以公众号当前页面为准。",
      "transport": "12:00从新天地出发 → 一大会址·新天地站10号线往虹桥火车站／航中路 → 交通大学 → 步行到登记页面指定校门。交通预留50分钟（乘车10分＋步行换乘30分＋安检候车10分），再留20分钟入校核验。离校后乘11号线往迪士尼 → 龙华换12号线往七莘路 → 桂林公园，前往萨姆机甲。",
      "description": "计划13:10开始参观，须以校方当日开放和实名登记成功为准。若只能登记其他时段，需相应调整下午安排；未能入校可改校门外观，武康路仍留在晚上。",
      "tags": [
        "实名登记",
        "免费",
        "校园"
      ],
      "sourceUrl": "https://gk.sjtu.edu.cn/Assets/userfiles/sys_eb538c1c-65ff-4e82-8e6a-a1ef01127fed/files/20250702/20250702141303220.pdf"
    },
    {
      "id": "sam",
      "name": "流萤·萨姆机甲／元界街区",
      "short": "萨姆机甲",
      "subtitle": "给这趟旅程一个次元出口",
      "position": [
        -7,
        5
      ],
      "kind": "robot",
      "day": 4,
      "time": "10月4日 15:40—16:50",
      "duration": "打卡与街区散步70分钟",
      "wait": "拍照等位预留15—20分钟",
      "ticket": "常设户外打卡无需门票或预约；街区装置和临时活动以现场为准。",
      "transport": "交大14:40出发 → 交通大学11号线往迪士尼 → 龙华换12号线往七莘路 → 桂林公园 → 漕宝路×叠彩路。乘车20分＋步行换乘25分＋安检候车15分，共60分钟。晚饭后反向乘12号线往金海路 → 龙华换11号线往嘉定北／花桥 → 交通大学，步行到武康大楼。",
      "description": "预留70分钟与萨姆合影、逛元界街区，包含拍照等位。16:50—17:40吃晚饭，随后去武康路散步，不再从萨姆直接回酒店。",
      "tags": [
        "免费",
        "游戏IP",
        "元界街区"
      ],
      "sourceUrl": "https://ghzyj.sh.gov.cn/xh/20250729/2b4a6d940d33445c93ed5e3b055e3e34.html"
    },
    {
      "id": "airport",
      "name": "虹桥机场 · T2",
      "short": "虹桥T2",
      "subtitle": "08:40，带着上海的记忆回青岛",
      "position": [
        -11,
        -3
      ],
      "kind": "airport",
      "day": 5,
      "time": "10月5日 08:40起飞 · 计划06:45—07:00到大厅",
      "duration": "酒店到T2大厅约90分钟",
      "wait": "豫园换乘候车15分钟＋出站步行15分钟",
      "ticket": "核对机票航站楼与航空公司的值机、托运、登机截止时间。到达后先办理手续，再吃早餐。",
      "transport": "05:30离店 → 源深路14号线往封浜 → 豫园换10号线往虹桥火车站 → 虹桥2号航站楼。不要乘航中路支线，也不要坐到终点虹桥火车站。",
      "description": "当前第三方时刻表列源深路往封浜首班05:51，仅作规划参考。4日晚复核国庆运营；若首班或换乘异常，及时改约车，不继续消耗机场缓冲。",
      "tags": [
        "08:40起飞",
        "T2",
        "首班需复核"
      ],
      "sourceUrl": "https://www.metroman.cn/cities/shanghai/stations/yuanshen-road"
    }
  ],
  "days": [
    {
      "id": "3",
      "title": "浦东与北外滩 · 艺术和夜色",
      "subtitle": "白天看艺术，夜晚沿江散步",
      "color": "#c98244",
      "route": [
        "hotel",
        "china",
        "map",
        "tower",
        "northbund",
        "hotel"
      ],
      "schedule": [
        {
          "time": "08:35—09:35",
          "title": "从酒店前往中华艺术宫",
          "detail": "14号线源深路往封浜 → 大世界换8号线往沈杜公路 → 中华艺术宫3号口。步行换乘20分＋乘车25分＋安检候车15分。",
          "type": "transit",
          "placeId": "china"
        },
        {
          "time": "09:35—10:15",
          "title": "建筑外观 · 等开馆与安检",
          "detail": "09:35到西门；开馆前25分钟可拍外观，再留15分钟入馆。",
          "type": "wait",
          "placeId": "china"
        },
        {
          "time": "10:15—11:45",
          "title": "上海美术馆／中华艺术宫",
          "detail": "常设展挑重点看，实际参观90分钟。",
          "type": "visit",
          "placeId": "china"
        },
        {
          "time": "11:45—12:50",
          "title": "直接前往浦东美术馆",
          "detail": "8号线往市光路 → 大世界换14号线往桂桥路 → 陆家嘴。乘车20分＋步行换乘30分＋安检候车15分。",
          "type": "transit",
          "placeId": "map"
        },
        {
          "time": "12:50—13:10",
          "title": "浦东美术馆 · 检票与安检",
          "detail": "预留20分钟；国庆高峰可能延长。",
          "type": "wait",
          "placeId": "map"
        },
        {
          "time": "13:10—15:10",
          "title": "浦东美术馆",
          "detail": "保留两小时看展，再前往三件套机位。",
          "type": "visit",
          "placeId": "map"
        },
        {
          "time": "15:10—15:40",
          "title": "步行到三件套机位",
          "detail": "导航花园石桥路×东泰路，含过街与人流缓冲30分钟。",
          "type": "transit",
          "placeId": "tower"
        },
        {
          "time": "15:40—16:10",
          "title": "三件套街头拍照",
          "detail": "等机位约20分钟＋拍照10分钟。",
          "type": "visit",
          "placeId": "tower"
        },
        {
          "time": "16:10—17:25",
          "title": "上海中心入场与上楼",
          "detail": "步行找入口15分钟，16:25计划开始入场；检票、安检、等电梯共留60分钟。",
          "type": "wait",
          "placeId": "tower"
        },
        {
          "time": "17:25—18:25",
          "title": "上海之巅 · 傍晚到入夜",
          "detail": "观景60分钟，日落与夜景体验随天气、能见度和实际排队变化。",
          "type": "visit",
          "placeId": "tower"
        },
        {
          "time": "18:25—18:55",
          "title": "等待下行电梯",
          "detail": "排队下楼与出楼预留30分钟。",
          "type": "wait",
          "placeId": "tower"
        },
        {
          "time": "18:55—19:45",
          "title": "陆家嘴晚饭",
          "detail": "保留晚饭50分钟，含约15分钟点餐或等位。",
          "type": "meal"
        },
        {
          "time": "19:45—20:45",
          "title": "前往北外滩滨江",
          "detail": "陆家嘴14号线往封浜 → 豫园换10号线往基隆路 → 天潼路换12号线往金海路 → 国际客运中心，出站步行到江岸。乘车15分＋步行换乘30分＋安检候车15分。",
          "type": "transit",
          "placeId": "northbund"
        },
        {
          "time": "20:45—21:25",
          "title": "北外滩 · 滨江散步",
          "detail": "国客中心滨江段走走、拍陆家嘴天际线，共40分钟，含10—15分钟拍照等位；只走当晚开放区域。",
          "type": "visit",
          "placeId": "northbund"
        },
        {
          "time": "21:25—22:30",
          "title": "北外滩返回全季酒店",
          "detail": "国际客运中心12号线往七莘路 → 天潼路换10号线往虹桥火车站／航中路 → 豫园换14号线往桂桥路 → 源深路。乘车20分＋步行换乘30分＋安检候车15分。",
          "type": "transit",
          "placeId": "hotel"
        }
      ],
      "note": "北外滩安排40分钟，预计22:30回店。国庆排队超出预留时可缩短散步，不压缩返程交通时间；岸线开放与地铁末班以出行当天信息为准。上海中心计划入场已调整为16:25，已购票先核对场次。",
      "start": "08:35",
      "end": "22:30",
      "lines": "14 / 8 / 10 / 12",
      "summary": "先看艺术和天际线，晚饭后换到北外滩，把江岸夜色也收进旅程。"
    },
    {
      "id": "4",
      "title": "浦西 · 人文与街巷夜游",
      "subtitle": "看过历史与萨姆，夜游武康路",
      "color": "#419681",
      "route": [
        "hotel",
        "yida",
        "sjtu",
        "sam",
        "wukang",
        "hotel"
      ],
      "schedule": [
        {
          "time": "07:50—08:40",
          "title": "前往中共一大纪念馆",
          "detail": "源深路14号线往封浜 → 一大会址·黄陂南路 → 步行到馆。乘车20分＋步行20分＋安检候车10分。",
          "type": "transit",
          "placeId": "yida"
        },
        {
          "time": "08:40—09:20",
          "title": "等开馆与安检",
          "detail": "开馆前20分钟＋入馆缓冲20分钟。",
          "type": "wait",
          "placeId": "yida"
        },
        {
          "time": "09:20—10:50",
          "title": "中共一大纪念馆",
          "detail": "集中看展陈，参观90分钟。",
          "type": "visit",
          "placeId": "yida"
        },
        {
          "time": "10:50—11:30",
          "title": "中共一大会址",
          "detail": "步行约5分＋排队约20分＋参观约15分。两处分别入场。",
          "type": "visit",
          "placeId": "yida"
        },
        {
          "time": "11:30—12:00",
          "title": "新天地 · 石库门街区散步",
          "detail": "保留30分钟街区散步与外观拍照，随后直接前往交大。",
          "type": "walk"
        },
        {
          "time": "12:00—12:50",
          "title": "前往交大指定校门",
          "detail": "一大会址·新天地站10号线往虹桥火车站／航中路 → 交通大学，再步行到登记页面指定校门。乘车10分＋步行换乘30分＋安检候车10分。",
          "type": "transit",
          "placeId": "sjtu"
        },
        {
          "time": "12:50—13:10",
          "title": "交大入校核验",
          "detail": "预留20分钟，带身份证，按实名登记页面指定入口入校。",
          "type": "wait",
          "placeId": "sjtu"
        },
        {
          "time": "13:10—14:40",
          "title": "上海交大徐汇校区",
          "detail": "校园参观90分钟；以实名登记成功和校方当日开放为前提。",
          "type": "visit",
          "placeId": "sjtu"
        },
        {
          "time": "14:40—15:40",
          "title": "前往萨姆机甲",
          "detail": "交通大学11号线往迪士尼 → 龙华换12号线往七莘路 → 桂林公园。乘车20分＋步行换乘25分＋安检候车15分。",
          "type": "transit",
          "placeId": "sam"
        },
        {
          "time": "15:40—16:50",
          "title": "萨姆与元界街区",
          "detail": "合影、散步共70分钟，包含15—20分钟拍照等位。",
          "type": "visit",
          "placeId": "sam"
        },
        {
          "time": "16:50—17:40",
          "title": "附近晚饭",
          "detail": "保留晚饭50分钟，包含点餐和等位。",
          "type": "meal"
        },
        {
          "time": "17:40—18:40",
          "title": "前往武康路",
          "detail": "桂林公园12号线往金海路 → 龙华换11号线往嘉定北／花桥 → 交通大学，再步行到武康大楼。乘车20分＋步行换乘25分＋安检候车15分。",
          "type": "transit",
          "placeId": "wukang"
        },
        {
          "time": "18:40—19:40",
          "title": "武康路夜游＋武康大楼",
          "detail": "武康大楼外观 → 武康路南段 → 武康庭与泰安路一带 → 折返淮海中路。共60分钟，含约15分钟拍照停留与人流缓冲。",
          "type": "visit",
          "placeId": "wukang"
        },
        {
          "time": "19:40—20:45",
          "title": "回酒店，准备早班机",
          "detail": "步行交通大学站 → 10号线往基隆路 → 豫园换14号线往桂桥路 → 源深路。乘车25分＋步行换乘25分＋安检候车15分。",
          "type": "transit",
          "placeId": "hotel"
        },
        {
          "time": "20:45以后",
          "title": "整理行李与复核返程",
          "detail": "复核源深路05:51首班参考与豫园换乘班次，准备身份证和登机手续，早点休息。",
          "type": "stay",
          "placeId": "hotel"
        }
      ],
      "note": "武康大楼与武康路统一放在晚上，不再下午重复打卡。交大13:10为计划参观时间，须以校方开放和登记成功为准；19:40结束夜游，预计20:45回店，为次日早班机留出休息时间。",
      "start": "07:50",
      "end": "20:45",
      "lines": "14 / 10 / 11 / 12",
      "summary": "白天走进石库门与老校园，傍晚打卡萨姆，最后在武康路慢慢收尾。"
    },
    {
      "id": "5",
      "title": "返程 · 虹桥 T2",
      "subtitle": "赶上清晨的地铁，08:40飞回青岛",
      "color": "#94bbfa",
      "route": [
        "hotel",
        "airport"
      ],
      "schedule": [
        {
          "time": "05:20—05:30",
          "title": "退房并离店",
          "detail": "提前一晚收好行李，早晨预留10分钟退房。",
          "type": "stay",
          "placeId": "hotel"
        },
        {
          "time": "05:30—05:45",
          "title": "前往源深路站",
          "detail": "酒店步行约5分钟，另留安检、进站、到站台时间。",
          "type": "transit",
          "placeId": "hotel"
        },
        {
          "time": "05:45—05:51",
          "title": "等往封浜方向首班车",
          "detail": "05:51是当前第三方时刻参考，须在10月4日晚按官方渠道复核，不是已确认的国庆班次。",
          "type": "wait"
        },
        {
          "time": "约05:51—06:00",
          "title": "14号线 → 豫园",
          "detail": "源深路上车，往封浜方向，在豫园下车换乘。乘车时长为估算。",
          "type": "transit"
        },
        {
          "time": "约06:00—06:15",
          "title": "换10号线，候车",
          "detail": "换乘步行与候车合计预留15分钟。上“虹桥火车站方向”，不要上航中路支线。",
          "type": "wait"
        },
        {
          "time": "约06:15—06:45",
          "title": "10号线 → 虹桥2号航站楼",
          "detail": "在虹桥2号航站楼站下车，不要坐到终点虹桥火车站。发车与到站均为规划估算。",
          "type": "transit",
          "placeId": "airport"
        },
        {
          "time": "约06:45—07:00",
          "title": "出站，步行到T2出发大厅",
          "detail": "跟随机场／T2出发指引，预留15分钟出站步行。",
          "type": "transit",
          "placeId": "airport"
        },
        {
          "time": "抵达后",
          "title": "值机、托运、安检",
          "detail": "先办理手续再吃早餐，候机与截止时间按航空公司和登机牌执行。",
          "type": "wait",
          "placeId": "airport"
        },
        {
          "time": "08:40",
          "title": "虹桥 T2 → 青岛",
          "detail": "机票计划起飞时间。地铁方案需正常运行并赶上早班；遇异常及时改车。",
          "type": "flight",
          "placeId": "airport"
        }
      ],
      "note": "此方案预计到出发大厅距起飞约1小时40分—1小时55分。若有托运或希望更从容，可改预约车；地铁首班与国庆安排必须提前复核。",
      "start": "05:30",
      "end": "08:40",
      "lines": "14 / 10",
      "summary": "早点出发，从容告别。首班时刻记得前一晚再确认。"
    }
  ],
  "bookings": [
    {
      "id": "map-ticket",
      "placeId": "map",
      "title": "浦东美术馆 · 日间票",
      "when": "10月3日 13:10参观",
      "status": "提前购票",
      "priority": "required",
      "detail": "选10月3日日间适用票，先看当天展览与退改规则。通常无需另预约，高峰可能分时入馆。",
      "url": "https://www.museumofartpd.org.cn/ticketing"
    },
    {
      "id": "tower-ticket",
      "placeId": "tower",
      "title": "上海之巅 · 118层观光",
      "when": "10月3日 16:25计划入场",
      "status": "提前购票",
      "priority": "required",
      "detail": "核对118层观光厅票种；需要选时段时覆盖16:25，留60分钟上楼排队。若已购票，先核对场次与退改，勿重复购买。",
      "url": "https://www.shanghaitower.com/shagnhai.html"
    },
    {
      "id": "sjtu-register",
      "placeId": "sjtu",
      "title": "交大徐汇 · 个人实名登记",
      "when": "10月4日 13:10计划参观",
      "status": "实名登记",
      "priority": "required",
      "detail": "微信公众号“上海交通大学” → 参观交大 → 徐汇校区。核对13:10计划时段是否开放，按当日规则登记，保存成功页并带身份证。",
      "url": "https://gk.sjtu.edu.cn/Assets/userfiles/sys_eb538c1c-65ff-4e82-8e6a-a1ef01127fed/files/20250702/20250702141303220.pdf"
    },
    {
      "id": "china-free",
      "placeId": "china",
      "title": "中华艺术宫 · 常设展",
      "when": "10月3日 10:15参观",
      "status": "常设展免费",
      "priority": "optional",
      "detail": "常规个人参观按现场指引领票；收费特展另购，国庆临时规则出发前核对。",
      "url": "https://www.artmuseumonline.org/art/art/visitGuide/fwxx/index.html"
    },
    {
      "id": "yida-free",
      "placeId": "yida",
      "title": "一大纪念馆＋会址",
      "when": "10月4日上午",
      "status": "免费免预约",
      "priority": "optional",
      "detail": "普通参观分别排队安检，讲解或宣誓服务需另外核对。",
      "url": "https://www.zgyd1921.com/about.html"
    },
    {
      "id": "outdoor-free",
      "placeId": "sam",
      "title": "户外拍照与散步",
      "when": "三件套、北外滩、武康路、萨姆等",
      "status": "无需门票",
      "priority": "optional",
      "detail": "安排公共街道外观及常设户外装置。店内消费、临时展览和活动另计。",
      "url": ""
    }
  ],
  "sources": [
    {
      "id": "map",
      "title": "浦东美术馆 · 官方票务",
      "url": "https://www.museumofartpd.org.cn/ticketing",
      "note": "日常预约、票种及退改规则"
    },
    {
      "id": "yida",
      "title": "中共一大纪念馆 · 开放信息",
      "url": "https://www.zgyd1921.com/about.html",
      "note": "免预约、常规开放时间"
    },
    {
      "id": "china",
      "title": "中华艺术宫 · 官方服务信息",
      "url": "https://www.artmuseumonline.org/art/art/visitGuide/fwxx/index.html",
      "note": "常设展、现场领票和开放时间"
    },
    {
      "id": "china-entrance",
      "title": "上海文旅 · 美术馆入口公告",
      "url": "https://whlyj.sh.gov.cn/yshd/20260915/26c3d72ecd5f48fe85cd39f021f71f4f.html",
      "note": "前序行程参考的西门入口公告"
    },
    {
      "id": "sjtu",
      "title": "上海交大 · 校园访客管理办法",
      "url": "https://gk.sjtu.edu.cn/Assets/userfiles/sys_eb538c1c-65ff-4e82-8e6a-a1ef01127fed/files/20250702/20250702141303220.pdf",
      "note": "免费参观、个人实名预约及身份证要求"
    },
    {
      "id": "tower",
      "title": "上海中心 · 上海之巅",
      "url": "https://www.shanghaitower.com/shagnhai.html",
      "note": "观光项目与官方购票入口"
    },
    {
      "id": "sam",
      "title": "上海市规划资源局 · 元界街区",
      "url": "https://ghzyj.sh.gov.cn/xh/20250729/2b4a6d940d33445c93ed5e3b055e3e34.html",
      "note": "萨姆机甲位置参考"
    },
    {
      "id": "metro",
      "title": "MetroMan · 源深路站时刻表",
      "url": "https://www.metroman.cn/cities/shanghai/stations/yuanshen-road",
      "note": "第三方首班参考；国庆当日请用官方渠道复核"
    },
    {
      "id": "hotel",
      "title": "携程 · 全季浦东大道店",
      "url": "https://hotels.ctrip.com/hotels/6257126.html",
      "note": "酒店地址参考；以订单上的门店名称为准"
    },
    {
      "id": "northbund",
      "title": "虹口区政府 · 北外滩国客中心滨江入口",
      "url": "https://www.shhk.gov.cn/qyfwy/030002/030002002/030002002004/20210628/78d6265e-8fa3-41cb-8c2b-2c30fdddb759.html",
      "note": "12号线国际客运中心站与滨江入口参考；历史开放时间不作为2026国庆承诺"
    },
    {
      "id": "wukang",
      "title": "上海市政府 · 武康路街区",
      "url": "https://www.shanghai.gov.cn/citywalk/20260625/3492b1b945c146fc96c4585d7b04f00d.html",
      "note": "武康路街区与夜游外观路线参考"
    }
  ]
};
