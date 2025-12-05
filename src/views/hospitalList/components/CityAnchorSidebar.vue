<template>
  <div class="city-anchor-sidebar">
    <!-- 热门城市 -->
    <div class="hot-item-list flex flex-direction-column" v-if="hotArr.length">
      <div
        v-for="(hot, index) in hotArr"
        :key="index"
        class="hot-city city-name"
        :class="{ selected: selectedValue?.cityEnName === getHotObj(hot).cityEnName }"
        :data-en-value="getHotObj(hot).cityEnName"
        :data-py-value="getHotObj(hot).cityPinYin"
        @click="handleCityClick(getHotObj(hot))"
      >
        {{ hot }}<br />
        <span>{{ getHotObj(hot).cityEnName }}</span>
      </div>
    </div>

    <!-- 字母分类城市 -->
    <div
      v-for="letter in indexList"
      :key="letter"
      class="city-item"
      :id="`${indexSuffix}${letter.toUpperCase()}${indexSuffix}`"
    >
      <div class="city-item-header">{{ letter.toUpperCase() }}</div>

      <div class="city-item-content">
        <div v-for="city in filteredCityList(letter)" :key="city.cityEnName" class="city-item-row">
          <div
            class="city-name"
            :class="{ selected: isSelected(city) }"
            :data-en-value="city.cityEnName"
            :data-py-value="city.cityPinYin"
            @click="handleCityClick(city)"
          >
            {{ city.cityName }}<br />
            <span>{{ city.cityEnName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  hotList: Array,
  hotArr: Array,
  indexList: Array,
  indexSuffix: {
    type: String,
    default: '',
  },
  selectedValue: Object,
  filteredCityList: Function,
});

const emit = defineEmits(['cityClick']);

/**
 * 点击城市
 */
const handleCityClick = city => {
  emit('cityClick', city);
};

/**
 * 判断是否为当前选中项
 */
const isSelected = city => {
  return (
    props.selectedValue?.cityEnName === city.cityEnName ||
    props.selectedValue?.cityPinYin === city.cityPinYin
  );
};

const getHotObj = hotName => {
  if (!hotName) return {};
  console.log(props.hotArr, 'hotArr');
  return (
    props.hotList.find(hot => {
      if (!hot) return false;
      return hot.cityName?.trim() === hotName.trim();
    }) || {}
  );
};
</script>

<style lang="less" scoped>
.city-anchor-sidebar {
  height: 100%;
  overflow: auto;
}

.flex-direction-column {
  flex-direction: column;
}

.hot-city {
  padding: 8px 6px;
  text-align: center;
  cursor: pointer;
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
</style>
