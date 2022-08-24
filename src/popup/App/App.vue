<template>
  <div class="main_app">
    <h2 class="title">友好天气</h2>
    <div class="main_box">
      <a-tabs centered class="tabbar-box" v-model:active="active">
        <a-tab-pane key="home" tab="主页">
          <div class="cell">
            实时天气/多日天气切换:
            <a-switch v-model:checked="isWeatherType" size="small"  @change="setIsWeatherType"/>
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
              <div class="cell font_small">
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
                  <div v-if="!isSetCityShow">
                    <span>{{ `${toDayData.province}-${toDayData.city}` }}</span>
                    <a-button type="text" @click="setCityShow" >
                      <template #icon>
                        <form-outlined />
                      </template>
                    </a-button>
                  </div>
                  <div class="set_city_box" v-else>
                    <a-select v-model:value="cityId"
                              style="width: 150px"
                              :filterOption="filterCity"
                              show-search>
                      <a-select-opt-group
                          v-for="item in CITY_LIST"
                          :key="item.adcode"
                          :label="item.cityname">
                        <a-select-option
                            v-for="children in item.children"
                            :key="children.cityname+'-'+children.adcode"
                            :value="children.adcode">
                          {{children.cityname}}
                        </a-select-option>
                      </a-select-opt-group>
                    </a-select>
                    <a-button type="text" @click="submitCity" >
                      <template #icon>
                        <check-outlined />
                      </template>
                    </a-button>
                  </div>
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
          <div class="cell" v-if="false">
            开启下雨提示:
            <a-switch v-model:checked="checked" size="small" @change="setOpenRainTips" />
          </div>
          <div class="cell">
            敬请期待
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import WuIcon from '../components/wu-icon.vue';
import { FormOutlined,CheckOutlined } from '@ant-design/icons-vue'
import {CONTROL_MAP,CITY_LIST} from '../utils/data';

const checked = ref(false);
const isWeatherType = ref(false);
const isToDayLoading = ref(false);
const isSetCityShow = ref(false);
const active = ref('home');
const cityId = ref(110105);

let toDayData = reactive({})
let weeksData = reactive({})
let chrome = window.chrome;

const getTodayData = () => {
  isToDayLoading.value = true;
  chrome.runtime.sendMessage({ type: "getCityIdList", cityId: cityId.value, extensions: 'base' }, (res) => {
    if (res.info == 'OK') {
      toDayData = Object.assign(toDayData, res.lives[0]);
    }
    isToDayLoading.value = false;
  })
}

const getWeekDataList = () => {
  chrome.runtime.sendMessage({ type: "getCityIdList", cityId: cityId.value, extensions: 'all' }, (res) => {
    if (res.info == 'OK') {
      weeksData = Object.assign(weeksData, res.forecasts[0]);
    }
  })
}

const openRainTips = () => {
  chrome.runtime.sendMessage({ type: "openRainTips" }, () => {
    console.log("开启成功");
  })
}

const closeRainTips = () => {
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

const filterCity = (inputValue,option)=>{
  let target = option['label'] != undefined ? option.label : option.key;
  return target.includes(inputValue);
}

const setCityShow = () => {
  isSetCityShow.value = true;
}

const submitCity = () => {
  chrome.storage.sync.set({cityActionId:cityId.value});
  getTodayData();
  getWeekDataList();
  isSetCityShow.value = false;
}

const setIsWeatherType = (checked) => {
  chrome.storage.sync.set({weatherType:checked});
}

const getWeatherIcon = (weacher) => {
  return CONTROL_MAP[weacher];
}

const init = () => {
  chrome.storage.sync.get(['weatherType','cityActionId'], ({weatherType = false,cityActionId = 110105}) => {
    isWeatherType.value = weatherType;
    cityId.value = cityActionId;
    getTodayData();
    getWeekDataList();
  });
}

onMounted(() => {
  init();
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

.font_small {
  font-size: 12px;
}

.big_size {
  font-size: 45px;
  line-height: 45px;
}

.set_city_box{
  display: inline-block;
}
</style>
