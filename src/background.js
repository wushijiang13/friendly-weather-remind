// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.type) {
        case 'get':
            fetch(request.url)
                .then(function (response) { sendResponse(response.json()) })
                .then(function (json) { sendResponse(json) })
                .catch(function (error) { sendResponse(null) });
            break;
        case 'post':
            fetch(request.url, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: JSON.stringify(request.data)
            })
                .then(function (response) {
                    console.log(response)
                    sendResponse(response.json())
                })
                .then(function (json) {
                    console.log(json)
                    sendResponse(json)
                })
                .catch(function (error) {
                    console.log(error)
                    sendResponse(null)
                });
            break;
        // 你可以定义任意内容，使用sendResponse()来返回它
        case 'getCityIdList': {
            const { cityId, extensions } = request;
            getCityIdList(cityId, extensions).then(data => {
                data.json().then(res => {
                    sendResponse(res);
                })
            });
            return true;
        }
        case 'openRainTips': {
            rainCalc();
            sendResponse(null);
            return true;
        }
        case 'closeRainTips': {
            closeRainTips();
            break;
        }
    }
});

let monitorRainTips = null;
let isTips = false; //是否提示过
function openRainTips() {
    const updateTimeList = [10, 13, 15, 18];
    const newDate = new Date();
    const targetDate = new Date().setHours(updateTimeList.find(item => {
        return  item >= newDate.getHours()
    }), 0, 0) || new Date().setHours(updateTimeList[0], 0, 0) + (1000 * 60 * 60 * 24);

    const diffTime =  targetDate - newDate.getTime();
    monitorRainTips = setTimeout(() => {
        rainCalc();
        // closeRainTips();
        // openRainTips();
    },diffTime)

}

function closeRainTips() {
    clearTimeout(monitorRainTips);
}

function rainCalc(){
    getCityIdList(110105, 'all').then(data => {
        data.json().then(res => {
            if (res.info == 'OK') {
                let monitorList = res.forecasts[0].casts.splice(0,2);
                monitorList.find((item,index)=>{
                    let rainName = item.dayweather.includes("雨") ? item.dayweather :
                    item.nightweather.includes("雨") ? item.nightweather : '';
                    if(rainName){
                        chrome.notifications.create('id',{
                            type:'basic',
                            title:'下雨提示',
                            message:`${index == 0 ? '今' : '明'}天，有${rainName}，请注意带伞！路滑请慢行哦~`,
                            iconUrl:'./icon.png'
                        })
                    }
                })
            }
        })
    });
}

function getCityIdList(cityId, extensions) {
    try {
        return fetch(`https://restapi.amap.com/v3/weather/weatherInfo?city=${cityId}&key=bd9c1495b0c133bfc6f0d55d46d05e32&extensions=${extensions}`, {
            method: 'GET',
            async: false,
        })
    } catch (err) {
        console.error(err);
    }
}
