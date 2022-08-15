// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case 'get':
            fetch(request.url)
                .then(function(response) { sendResponse(response.json()) })
                .then(function(json) { sendResponse(json) })
                .catch(function(error) { sendResponse(null) });
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
                .then(function(response) {
                    console.log(response)
                    sendResponse(response.json())
                })
                .then(function(json) {
                    console.log(json)
                    sendResponse(json)
                })
                .catch(function(error) {
                    console.log(error)
                    sendResponse(null)
                });
            break;
        // 你可以定义任意内容，使用sendResponse()来返回它
        case 'getCityIdList': {
            const {cityId, extensions} = request;
            getCityIdList(cityId, extensions).then(data=>{
                data.json().then(res=>{
                    sendResponse(res);
                })
            });
            return true;
        }
    }
});

function getCityIdList (cityId,extensions){
    try{
       return  fetch(`https://restapi.amap.com/v3/weather/weatherInfo?city=${cityId}&key=bd9c1495b0c133bfc6f0d55d46d05e32&extensions=${extensions}`,{
            method:'GET',
            async:false,
        })
    }catch (err){
        console.error(err);
    }
}
