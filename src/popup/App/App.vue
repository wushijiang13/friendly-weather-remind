<template>
  <div class="main_app">
    <van-nav-bar title=" 友好天气" />
    <div class="main_box">
      <div v-show="active == 'home'">
        <van-cell center title="实时天气/多日天气切换">
          <template #right-icon>
            <van-switch v-model="isWeatherType" size="24" />
          </template>
        </van-cell>
<!--        <van-cell>-->
<!--          <template #title>-->
<!--            <van-button type="primary" size="small" icon="replay" :loading="isToDayLoading" @click="getTodayData">刷新今天天气</van-button>-->
<!--          </template>-->
<!--          <template #value>-->
<!--            <van-button type="primary" size="small" @click="getWeekDataList">获取一周天气</van-button>-->
<!--          </template>-->
<!--        </van-cell>-->
        <div v-show="!isWeatherType">
          <van-cell-group>
            <van-cell title="地区" :value="`${toDayData.province}-${toDayData.city}`" />
            <van-cell title="实时温度">
              <template #value>
                <span class="big_size">{{toDayData.temperature}}°C</span>
              </template>
            </van-cell>
            <van-cell title="实时天气">
              <template #value>
                {{toDayData.weather}}
                {{getWeatherIcon(toDayData.weather)}}
                <i :class="`iconfont ${getWeatherIcon(toDayData.weather)}`"></i>
              </template>
            </van-cell>
            <van-cell title="空气湿度" :value="`${toDayData.humidity}%`"/>
            <van-cell title="风向" :value="`${toDayData.winddirection}风`"/>
            <van-cell title="风力" :value="`${toDayData.windpower}级`"/>
            <van-cell title="更新时间" :value="`${toDayData.reporttime}`"/>
          </van-cell-group>
        </div>
        <div v-show="isWeatherType">
          <van-cell>
            <template #title>
              <van-button type="primary" size="small"  @click="preDayWeather">上一天</van-button>
            </template>
            <template #value>
              <van-button type="primary" size="small" @click="nextDayWeather">下一天</van-button>
            </template>
          </van-cell>
          <van-cell title="地区" :value="`${weeksData.province}-${weeksData.city}`"/>
          <van-swipe class="my-swipe" ref="swiper" indicator-color="white">
            <template v-for="item in weeksData.casts" :key="item.date">
              <van-swipe-item >
                <van-cell title="日期" :value="`${item.date}  -  周${getNumToChinese(item.week)}`"/>
                <van-cell title="天气">
                  <template #value>
                    <span>{{ (item.dayweather == item.nightweather) ? item.dayweather : `${item.dayweather}转${item.nightweather}`}}({{item.daywind}}风)</span>
                  </template>
                </van-cell>
                <van-cell title="温度" :value="`${item.daytemp}°C ~ ${item.nighttemp}°C`"/>
                <van-cell title="风力" :value="`${item.daypower}`"/>
              </van-swipe-item>
            </template>
          </van-swipe>
          <van-cell title="更新时间" :value="`${weeksData.reporttime}`"/>
        </div>
      </div>
      <div v-show="active == 'setting'">
        <van-cell center title="开启下雨提示">
          <template #right-icon>
            <van-switch v-model="checked" size="12" />
          </template>
        </van-cell>
      </div>
    </div>
    <van-tabbar class="tabbar-box" v-model="active" active-color="#ee0a24" inactive-color="#000">
      <van-tabbar-item name="home" icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item name="setting" icon="setting-o">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
  import {ref,reactive,onMounted} from 'vue';

  const checked = ref(false);
  const isWeatherType = ref(false);
  const isToDayLoading = ref(false);
  const active = ref('home');
  let toDayData = reactive({})
  let weeksData = reactive({})
  let swiper = ref(null);


  const nextDayWeather = ()=>{
    swiper.value.next();
  }

  const preDayWeather = ()=>{
    swiper.value.prev();
  }

  const getTodayData = () =>{
    isToDayLoading.value = true;
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ type: "getCityIdList", cityId:110105,extensions:'base' }, (res) => {
      if (res.info == 'OK') {
        toDayData = Object.assign(toDayData,res.lives[0]);
      }
      isToDayLoading.value = false;
    })
  }
  const getWeekDataList = () =>{
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ type: "getCityIdList", cityId:110105,extensions:'all' }, (res) => {
      if (res.info == 'OK') {
        weeksData = Object.assign(weeksData,res.forecasts[0]);
      }
    })
  }

 const getNumToChinese = (num)=>{
    let control ={
      1:"一",
      2:"二",
      3:"三",
      4:"四",
      5:"五",
      6:"六",
      7:"日"
    }
   return  control[num]
 }
 const getWeatherIcon = (weacher) =>{
    let control = {
      '晴':'icon-qing',
      '少云':'icon-duoyun-copy',
      '晴间多云':'icon-duoyun-copy',
      '多云': 'icon-duoyun-copy',
      '阴':'icon-yin',
      '有风':'icon-feng',
      '平静':'icon-qing',
      '微风':'icon-feng',
      '和风':'icon-qing',
      '清风':'icon-feng',
      '强风':'icon-dafeng',
      '劲风':'icon-dafeng',
      '疾风':'icon-dafeng',
      '大风':'icon-dafeng',
      '烈风':'icon-dafeng',
      '风暴':'icon-taifeng',
      '狂爆风':'icon-taifeng',
      '飓风':'icon-taifeng',
      '热带风暴':'icon-taifeng',
      '霾':'icon-wumai',
      '中度霾':'icon-wumai',
      '重度霾':'icon-wumai',
      '严重霾':'icon-wumai',
      '阵雨':'icon-zhenyu',
      '雷阵雨':'icon-leizhenyu-copy',
      '雷阵雨并伴有冰雹':'icon-yujiaxue',
      '小雨':'icon-xiaoyu1',
      '中雨':'icon-zhongyu',
      '大雨':'icon-xiaoyu',
      '暴雨':'icon-baoyu',
      '大暴雨':'icon-baoyu',
      '特大暴雨':'icon-baoyu',
      '强阵雨':'icon-leizhenyu-copy',
      '强雷阵雨':'icon-leizhenyu-copy',
      '极端降雨':'icon-baoyu',
      '毛毛雨':'icon-xiaoyu1',
      '细雨':'icon-xiaoyu1',
      '雨':'icon-zhongyu',
      '小雨-中雨':'icon-zhongyu',
      '中雨-大雨':'icon-xiaoyu',
      '大雨-暴雨':'icon-baoyu',
      '暴雨-大暴雨':'icon-baoyu',
      '大暴雨-特大暴雨':'icon-baoyu',
      '雨雪天气':'icon-yujiaxue',
      '雨夹雪':'icon-yujiaxue',
      '阵雨夹雪':'icon-yujiaxue',
      '冻雨':'icon-yujiaxue',
      '雪':'icon-xiaoxue-copy',
      '阵雪':'icon-xiaoxue-copy',
      '小雪':'icon-xiaoxue-copy',
      '中雪':'icon-daxue-copy',
      '大雪':'icon-daxue-copy',
      '暴雪':'icon-daxue-copy',
      '小雪-中雪':'icon-daxue-copy',
      '中雪-大雪':'icon-daxue-copy',
      '大雪-暴雪':'icon-daxue-copy',
      '浮尘':'icon-fuchen',
      '扬沙':'icon-fuchen',
      '沙尘暴':'icon-shachenbao',
      '强沙尘暴':'icon-shachenbao',
      '龙卷风':'icon-longjuanfeng',
      '雾':'icon-wu',
      '浓雾':'icon-wu',
      '强浓雾':'icon-wu',
      '轻雾':'icon-wu',
      '大雾':'icon-wu',
      '特强浓雾':'icon-wu',
      '热':'icon-qing',
      '冷':'icon-dafeng'
    }
    return control[weacher];
 }
  // const openNotifications = () =>{
  //   new Notification("请注意📢",{
  //     body:'今天北京多云有xx',
  //     icon:'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
  //   });
  // }


  onMounted(()=>{
    getTodayData();
    getWeekDataList();
  })
</script>

<style>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
@font-face {
  font-family: "站酷快乐体";
  font-weight: 400;
  src: url("../../../public/TsangerYuYangT_W01_W01.ttf");
}

.main_app {
  width: 340px;
  margin: 0px 4px;
  background-color: #f2f4f6;
  border-radius: 5px;
  font-size: 14px;
  font-family: "站酷快乐体";
}
.main_box{
  margin-bottom: 60px;
  padding:0px 10px;
  font-family: "站酷快乐体";
  background-color: #fff;
}
.big_size{
  font-size: 18px;
  font-weight: 600;
}
</style>
