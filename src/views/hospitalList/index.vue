<template>
  <div class="hospital-page">
    <!-- 左侧字母索引 -->
    <AlphabetSidebar v-if="indexList.length" :letters="indexList" @select="handleAlphabetClick" />

    <CityAnchorSidebar
      :hot-list="hotList"
      :hot-arr="hotArr"
      :index-list="indexList"
      :index-suffix="indexSuffix"
      :selected-value="selectedValue"
      :get-hot-obj="getHotObj"
      :filtered-city-list="filteredCityList"
      @cityClick="handleCityClick"
    />

    <!-- 左侧城市索引 -->
    <div class="left-city">
      <div class="hot-item-list flex flex-direction-column" v-if="hotList.length">
        <div
          v-for="(hot, index) in hotArr"
          :key="index"
          class="hot-city city-name"
          :class="{ selected: selectedValue?.cityEnName === getHotObj(hot).cityEnName }"
          :data-en-value="getHotObj(hot).cityEnName"
          :data-py-value="getHotObj(hot).cityPinYin"
          @click="handleCityClick(getHotObj(hot))"
        >
          {{ hot }}<br /><span>{{ getHotObj(hot).cityEnName }}</span>
        </div>
      </div>

      <!-- 字母分类城市 -->
      <div
        v-for="name in indexList"
        :key="name"
        class="city-item"
        :id="`${indexSuffix}${name.toUpperCase()}${indexSuffix}`"
      >
        <div class="city-item-header">{{ name.toUpperCase() }}</div>
        <div class="city-item-content">
          <div v-for="city in filteredCityList(name)" :key="city.cityEnName" class="city-item-row">
            <div
              class="city-name"
              :class="{
                selected:
                  selectedValue?.cityEnName === city.cityEnName ||
                  selectedValue?.cityPinYin === city.cityPinYin,
              }"
              :data-en-value="city.cityEnName"
              :data-py-value="city.cityPinYin"
              @click="handleCityClick(city)"
            >
              {{ city.cityName }}<br /><span>{{ city.cityEnName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧医院列表 -->
    <div class="hospital-list" ref="content">
      <div
        v-for="(group, index) in filteredHospitals"
        :key="index"
        :ref="group.letter"
        class="hospital-group"
      >
        <h3>{{ group.letter }}</h3>
        <div v-for="hospital in group.list" :key="hospital.id" class="hospital-item">
          {{ hospital.name }} <br />
          {{ hospital.enName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import api from '@/api';
import Pinyin from './pinyin';
import AlphabetSidebar from './components/AlphabetSidebar.vue';
import CityAnchorSidebar from './components/CityAnchorSidebar.vue';

// 定义状态
const data = ref([]);
const indexList = ref([]);
const hotList = ref([]);
const cityList = ref([]);
const selectedValue = ref(null);
const cityLists = ref([]);
const filteredHospitals = ref([]);
const searchKeyword = ref('');
const selectedPayType = ref('');
const showToast = ref(false);
const toastText = ref('');

const selectedCity = ref(null);
const selectedLetter = ref(null);

// 定义常量
const hotArr = ['北京', '上海', '广州', '深圳'];
const indexSuffix = '__';
const payTypeOptions = [
  { label: '请选择 Please Select', value: '' },
  { label: '住院 Inpatient', value: '1' },
  { label: '门诊 Outpatient', value: '2' },
];

// 产品相关配置
const productId = ref('');
const titleDoc = {
  XSD: '欣生代儿科直付医院列表',
  HM_SGC: '重疾普通部合作医疗机构列表',
  EC2: '欣享人生直付医院列表',
  XSD2023: '欣生代2023版儿科直付医院列表',
  MSH: 'MSH万欣和 直付医院列表',
  YY2024: '曜影专属产品直付医院列表',
};
const titleDescList = [
  { XIANGGANG: '包含医院和诊所 including hospitals and clinics' },
  { AOMEN: '包含医院和诊所 including hospitals and clinics' },
];

const hospitals = ref([
  {
    id: 1,
    city: '上海',
    name: '复旦大学附属儿科医院',
    enName: "Children's Hospital of Fudan University",
    letter: 'B',
  },
  { id: 2, city: '上海', name: '复旦大学附属华东医院', enName: 'Huadong Hospital', letter: 'B' },
  {
    id: 3,
    city: '北京',
    name: '北京协和医院',
    enName: 'Peking Union Medical College Hospital',
    letter: 'C',
  },
]);

// 点击字母
const handleAlphabetClick = name => {
  showToast.value = true;
  toastText.value = name;

  setTimeout(() => {
    showToast.value = false;
  }, 500);

  const anchorElement = document.getElementById(
    `${indexSuffix}${name.toUpperCase()}${indexSuffix}`
  );
  anchorElement?.scrollIntoView({ behavior: 'smooth' });
};

const getHotObj = hotName => {
  if (!hotName) return {};
  return (
    hotList.value.find(hot => {
      if (!hot) return false;
      return hot.cityName?.trim() === hotName.trim();
    }) || {}
  );
};

const filteredCityList = name => {
  return cityList.value.filter(city => {
    const cFirstLetter = (city.cityEnName?.trim().substr(0, 1) || '').toUpperCase();
    const pFirstLetter = (city.cityPinYin?.trim().substr(0, 1) || '').toUpperCase();
    return cFirstLetter === name || pFirstLetter === name;
  });
};

const handleCityClick = city => {
  console.log(city, 'city handleClick');
  if (!city) return;

  const cityObj = searchArrObj(cityList.value, 'cityEnName', city.cityEnName);
  console.log(cityObj, 'cityObj');
  if (!cityObj) return;

  selectedValue.value = {
    cityName: cityObj.cityName,
    cityEnName: cityObj.cityEnName,
    cityPinYin: cityObj.cityPinYin,
    count: cityObj.count,
  };

  // 更新医院列表
  cityLists.value = cityObj.others || [];
  filteredHospitals.value = [...cityLists.value];
};

const toPinYin = str => {
  if (!str) return '';
  const cReg = /[\u4e00-\u9fa5]/; // 简化正则写法
  const eReg = /[a-zA-Z0-9 ]/;

  // 优化：直接遍历导入的 Pinyin 模块，无需全局对象
  const searchPinYin = s => {
    for (const pinyinKey in Pinyin) {
      if (Pinyin.hasOwnProperty(pinyinKey) && Pinyin[pinyinKey].includes(s)) {
        return pinyinKey;
      }
    }
    return '';
  };

  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (cReg.test(char)) {
      result += (searchPinYin(char) || '').toUpperCase();
    } else if (eReg.test(char)) {
      result += char;
    }
  }

  // 特殊拼音修正（保留原有逻辑）
  if (result === 'ZHONGQING') return 'CHONGQING';
  if (result === 'XIANGGANG') return 'Hong KOng';
  if (result === 'AOMEN') return 'Macau';

  return result;
};
const searchArrObj = (arr, key, value) => {
  if (!arr) return null;

  if (Array.isArray(arr)) {
    for (const obj of arr) {
      if (obj && obj[key] === value) {
        return obj;
      }
    }
    return null;
  } else if (typeof arr === 'object') {
    return arr[key] === value ? arr : null;
  }

  return null;
};

const initData = () => {
  if (data.value.length === 0) return;

  const tempIndexList = [];
  const tempHotList = [];
  const tempCityList = [];

  const insertToIndexList = str => {
    const s = str.substr(0, 1);
    if (s && !tempIndexList.includes(s.toUpperCase())) {
      tempIndexList.push(s.toUpperCase());
    }
  };

  const getObjCountByPinYin = pinYin => {
    if (!pinYin) return 0;

    // 根据产品ID和年份获取默认计数
    const defaultCountList =
      productId.value === 'ADVB' && getYear() === '2024'
        ? []
        : [{ XIANGGANG: '1140+' }, { AOMEN: '26' }];

    for (const d of defaultCountList) {
      if (d[pinYin]) {
        return d[pinYin];
      }
    }
    return 0;
  };

  data.value.forEach(d => {
    const enName = d.cityEnglishName || '';
    const zhName = d.cityChineseName || '';
    let pinYin = toPinYin(enName) || '';

    // 处理特殊拼音
    if (pinYin === 'ZHONGQING') pinYin = 'CHONGQING';
    if (pinYin === 'XIANGGANG') pinYin = 'Hong KOng';
    if (pinYin === 'AOMEN') pinYin = 'Macau';

    if (enName) {
      insertToIndexList(enName);
      insertToIndexList(pinYin);
    }

    // 热门城市处理
    if (zhName && hotArr.includes(zhName.trim())) {
      if (!searchArrObj(tempHotList, 'cityEnName', enName)) {
        const hotObj = {
          cityName: zhName,
          cityEnName: enName,
          cityPinYin: pinYin,
        };
        tempHotList.push(hotObj);

        // 默认选中第一个热门城市
        if (zhName.trim() === hotArr[0] && !selectedValue.value) {
          selectedValue.value = hotObj;
        }
      }
    }

    // 城市列表处理
    if (zhName) {
      const obj = searchArrObj(tempCityList, 'cityEnName', enName);
      if (!obj) {
        const defaultCount = getObjCountByPinYin(pinYin) || 0;
        tempCityList.push({
          cityName: zhName,
          cityEnName: enName,
          cityPinYin: pinYin,
          others: [
            {
              ...d,
              name: d.pChineseName || '',
              enName: d.pEnglishName || '',
              repFlag: d.proRepFlag || '',
              vaccineFlag: d.vaccineFlag || '',
              providerId: d.providerId || '',
              preNetFlag: d.preNetFlag || '',
              expensiveFlag: d.expensiveFlag || '',
              allDayFlag: d.allDayFlag || '',
              hasFlags:
                d.proRepFlag === '1' ||
                d.preNetFlag === '1' ||
                d.expensiveFlag === '1' ||
                d.allDayFlag === '1',
            },
          ],
          count: defaultCount === 0 ? 1 : defaultCount,
        });
      } else {
        obj.others.push({
          ...d,
          name: d.pChineseName || '',
          enName: d.pEnglishName || '',
          repFlag: d.proRepFlag || '',
          vaccineFlag: d.vaccineFlag || '',
          providerId: d.providerId || '',
          preNetFlag: d.preNetFlag || '',
          expensiveFlag: d.expensiveFlag || '',
          allDayFlag: d.allDayFlag || '',
          hasFlags:
            d.proRepFlag === '1' ||
            d.preNetFlag === '1' ||
            d.expensiveFlag === '1' ||
            d.allDayFlag === '1',
        });

        if (typeof obj.count !== 'string') {
          obj.count++;
        }
      }
    }
  });

  // 排序并赋值
  indexList.value = [...new Set(tempIndexList)].sort();
  console.log(indexList.value, 'vvvvv');
  hotList.value = tempHotList;
  cityList.value = tempCityList.sort((a, b) => a.cityEnName.localeCompare(b.cityEnName));

  // 设置选中城市的计数
  if (selectedValue.value) {
    const selectedObj = searchArrObj(cityList.value, 'cityEnName', selectedValue.value.cityEnName);
    if (selectedObj) {
      selectedValue.value.count = selectedObj.count;
      cityLists.value = selectedObj.others || [];
      filteredHospitals.value = [...cityLists.value];
    }
  }
};

function selectCity(city) {
  selectedCity.value = city;
  scrollToLetter(selectedLetter.value);
}

function selectLetter(letter) {
  selectedLetter.value = letter;
  scrollToLetter(letter);
}

const content = ref(null);

function scrollToLetter(letter) {
  if (!letter) return;
  nextTick(() => {
    const el = content.value.querySelector(`div[ref='${letter}']`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

onMounted(() => {
  const fd = new FormData();
  fd.append('productId', 'WSMA');
  api.hospitalList.list(fd).then(res => {
    console.log('res:', res);
    data.value = res || [];
    initData();
  });
});
</script>

<style scoped>
.hospital-page {
  display: flex;
  height: 100vh;
}

.hospital-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px;
}

.hospital-group {
  margin-bottom: 20px;
}

.hospital-item {
  padding: 5px;
  border-bottom: 1px solid #eee;
}

.city-item-header {
  border-bottom: 1px solid #dcdcdc;
  text-align: center;
  background: #f5f5f5;
  width: 90px;
  padding: 5px 0;
}

.city-name {
  width: 90px;
  border-bottom: 1px solid #dcdcdc;
  padding: 10px 0;
  text-align: center;
  background: #fff3e6;
  font-size: 16px;
}
.city-name span {
  font-size: 12px;
}

.selected {
  color: #f08106;
}

.left-city {
  height: 100%;
  overflow: auto;
}
</style>
