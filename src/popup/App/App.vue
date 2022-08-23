<template>
  <div class="main_app">
    <h2 class="title">友好天气</h2>
    <div class="main_box">
      <a-tabs centered class="tabbar-box" v-model:active="active">
        <a-tab-pane key="home" tab="主页">
          <div class="cell">
            实时天气/多日天气切换:
            <a-switch v-model:checked="isWeatherType" size="small" />
          </div>
          <div v-if="isWeatherType">
            <div>
              <div class="cell">
                地区：
                <span>
                  {{ `${weeksData.province}-${weeksData.city}` }}
                </span>
              </div>
              <div class="list">
                <div class="list_item_box" v-for="item in weeksData.casts" :key="item.date">
                  <div class="item_title">
                    {{ `周${getNumToChinese(item.week)}` }}
                  </div>
                  <div class="item_weather">
                    <span>{{ (item.dayweather == item.nightweather) ? item.dayweather :
                        `${item.dayweather}转${item.nightweather}`
                    }}</span>
                  </div>
                  <div class="item_temperature">
                    <span>{{ item.daytemp }} </span>
                    <span>{{ item.nighttemp }}</span>
                  </div>
                </div>
              </div>
              <div class="cell font-small">
                更新时间:
                <span>
                  {{ `${weeksData.reporttime}` }}
                </span>
              </div>
            </div>
          </div>
          <div v-else>
            <div>
              <div class="weather-box">
                <div class="weather-icon">
                  <WuIcon style="font-size:140px" :icon="getWeatherIcon(toDayData.weather)" />
                </div>
                <div>
                  <span>{{ `${toDayData.province}-${toDayData.city}` }}</span>
                </div>
                <div class="weatcher-info">
                  <div>
                    <span class="big_size">{{ toDayData.temperature }}</span>
                  </div>
                  <div>
                    <div>
                      °C
                    </div>
                    <div>
                      {{ toDayData.weather }}
                    </div>
                  </div>


                </div>
                <div>
                  <span>
                    {{ `${toDayData.winddirection}风` }}
                  </span>
                  <span>
                    {{ `${toDayData.windpower}级` }}
                  </span>
                </div>
              </div>
              <div class="cell">
                更新时间:
                <span>
                  {{ `${toDayData.reporttime}` }}
                </span>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="setting" tab="设置">
          <div class="cell">
            开启下雨提示:
            <a-switch v-model:checked="checked" size="small" @change="setOpenRainTips" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import WuIcon from '../components/wu-icon.vue';

const checked = ref(false);
const isWeatherType = ref(false);
const isToDayLoading = ref(false);
const active = ref('home');

let toDayData = reactive({})
let weeksData = reactive({})

const getTodayData = () => {
  isToDayLoading.value = true;
  // eslint-disable-next-line no-undef
  chrome.runtime.sendMessage({ type: "getCityIdList", cityId: 110105, extensions: 'base' }, (res) => {
    if (res.info == 'OK') {
      toDayData = Object.assign(toDayData, res.lives[0]);
    }
    isToDayLoading.value = false;
  })
}

const getWeekDataList = () => {
  // eslint-disable-next-line no-undef
  chrome.runtime.sendMessage({ type: "getCityIdList", cityId: 110105, extensions: 'all' }, (res) => {
    if (res.info == 'OK') {
      weeksData = Object.assign(weeksData, res.forecasts[0]);
    }
  })
}

const openRainTips = () => {
  // eslint-disable-next-line no-undef
  chrome.runtime.sendMessage({ type: "openRainTips" }, () => {
    console.log("开启成功");
  })
}

const closeRainTips = () => {
  // eslint-disable-next-line no-undef
  chrome.runtime.sendMessage({ type: "closeRainTips" }, () => {
    console.log("关闭成功");
  })
}

const setOpenRainTips = (checked) => {
  console.log(checked);
  if (checked) {
    openRainTips()
  }
}

const getNumToChinese = (num) => {
  let control = {
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "日"
  }
  return control[num]
}
const getWeatherIcon = (weacher) => {
  let control = {
    '晴': 'icon-qing',
    '少云': 'icon-duoyun-copy',
    '晴间多云': 'icon-duoyun-copy',
    '多云': 'icon-duoyun-copy',
    '阴': 'icon-yin',
    '有风': 'icon-feng',
    '平静': 'icon-qing',
    '微风': 'icon-feng',
    '和风': 'icon-qing',
    '清风': 'icon-feng',
    '强风': 'icon-dafeng',
    '劲风': 'icon-dafeng',
    '疾风': 'icon-dafeng',
    '大风': 'icon-dafeng',
    '烈风': 'icon-dafeng',
    '风暴': 'icon-taifeng',
    '狂爆风': 'icon-taifeng',
    '飓风': 'icon-taifeng',
    '热带风暴': 'icon-taifeng',
    '霾': 'icon-wumai',
    '中度霾': 'icon-wumai',
    '重度霾': 'icon-wumai',
    '严重霾': 'icon-wumai',
    '阵雨': 'icon-zhenyu',
    '雷阵雨': 'icon-leizhenyu-copy',
    '雷阵雨并伴有冰雹': 'icon-yujiaxue',
    '小雨': 'icon-xiaoyu1',
    '中雨': 'icon-zhongyu',
    '大雨': 'icon-xiaoyu',
    '暴雨': 'icon-baoyu',
    '大暴雨': 'icon-baoyu',
    '特大暴雨': 'icon-baoyu',
    '强阵雨': 'icon-leizhenyu-copy',
    '强雷阵雨': 'icon-leizhenyu-copy',
    '极端降雨': 'icon-baoyu',
    '毛毛雨': 'icon-xiaoyu1',
    '细雨': 'icon-xiaoyu1',
    '雨': 'icon-zhongyu',
    '小雨-中雨': 'icon-zhongyu',
    '中雨-大雨': 'icon-xiaoyu',
    '大雨-暴雨': 'icon-baoyu',
    '暴雨-大暴雨': 'icon-baoyu',
    '大暴雨-特大暴雨': 'icon-baoyu',
    '雨雪天气': 'icon-yujiaxue',
    '雨夹雪': 'icon-yujiaxue',
    '阵雨夹雪': 'icon-yujiaxue',
    '冻雨': 'icon-yujiaxue',
    '雪': 'icon-xiaoxue-copy',
    '阵雪': 'icon-xiaoxue-copy',
    '小雪': 'icon-xiaoxue-copy',
    '中雪': 'icon-daxue-copy',
    '大雪': 'icon-daxue-copy',
    '暴雪': 'icon-daxue-copy',
    '小雪-中雪': 'icon-daxue-copy',
    '中雪-大雪': 'icon-daxue-copy',
    '大雪-暴雪': 'icon-daxue-copy',
    '浮尘': 'icon-fuchen',
    '扬沙': 'icon-fuchen',
    '沙尘暴': 'icon-shachenbao',
    '强沙尘暴': 'icon-shachenbao',
    '龙卷风': 'icon-longjuanfeng',
    '雾': 'icon-wu',
    '浓雾': 'icon-wu',
    '强浓雾': 'icon-wu',
    '轻雾': 'icon-wu',
    '大雾': 'icon-wu',
    '特强浓雾': 'icon-wu',
    '热': 'icon-qing',
    '冷': 'icon-dafeng'
  }
  return control[weacher];
}
// const openNotifications = () =>{
//   new Notification("请注意📢",{
//     body:'今天北京多云有xx',
//     icon:'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
//   });
// }


onMounted(() => {
  getTodayData();
  getWeekDataList();
})

onUnmounted(() => {
  closeRainTips();
})
</script>

<style>
@font-face {
  font-family: "站酷快乐体";
  font-weight: 400;
  src: url("../../../public/TsangerYuYangT_W01_W01.ttf");
}

.title {
  text-align: center;
  background-color: #fff;
  width: 100%;
  padding: 4px;
  font-size: 20px;
}

.cell {
  width: 98%;
  margin: 4px auto;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weather-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-weight: 600;
}

.weather-box > div {
  margin: 5px;
}

.weatcher-info > div {
  display: inline-flex;
  height: 45px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.main_app {
  width: 340px;
  margin: 0px 4px;
  background-color: #f2f4f6;
  border-radius: 5px;
  font-size: 14px;
  font-family: "站酷快乐体";
}

.main_box {
  margin-bottom: 60px;
  padding: 0px 10px;
  font-family: "站酷快乐体";
  background-color: #fff;
}

.list {
  background-color: burlywood;
}

.list_item_box {
  border-bottom: 1px solid #fff;
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  padding: 4px 0px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  line-height: 30px;
}

.item_title {
  width: 60px;
}

.item_weather {
  width: 120px;
  text-align: center;
}

.item_temperature {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 80px;
  line-height: 30px;
}

.font-small {
  font-size: 12px;
}

.big_size {
  font-size: 45px;
  line-height: 45px;
}
</style>
