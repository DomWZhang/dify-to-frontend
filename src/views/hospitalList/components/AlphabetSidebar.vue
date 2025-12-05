<template>
  <div class="city-index-anchor flex-center flex-direction-column">
    <div
      v-for="(name, index) in letters"
      :key="index"
      class="index-anchor"
      :data-value="name"
      @click="$emit('select', name)"
    >
      {{ name }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  letters: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="less" scoped>
.city-index-anchor {
  width: 25px;
  text-align: center;
  list-style: none;
  padding: 20px 0;
  background: #ffffff;
}
.flex-direction-column {
  flex-direction: column;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
