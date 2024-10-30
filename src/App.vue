<template>
  <div id="app">
    <Toast />
    <div class="tab-header">
      <Button
          label="MAIN"
          @click="activeTab = 'main'"
          :class="{'p-button-text': true, 'active': activeTab === 'main'}"
      />
      <Button
          label="MANAGE"
          @click="activeTab = 'manage'"
          :class="{'p-button-text': true, 'active': activeTab === 'manage'}"
      />
    </div>
    <div class="tab-content">
      <MainPage v-if="activeTab === 'main'" />
      <PromptManagementPage v-else />
    </div>
  </div>
</template>

<script>
import MainPage from './components/MainPage.vue';
import PromptManagementPage from './components/PromptManagementPage.vue';

export default {
  name: 'App',
  components: {
    MainPage,
    PromptManagementPage,
  },
  data() {
    return {
      activeTab: 'main',
    };
  },
};
</script>

<style>
#app {
  min-width: 400px;
  min-height: 600px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* 탭 헤더 스타일 */
.tab-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}

/* 탭 콘텐츠 영역 */
.tab-content {
  position: absolute;
  top: 60px; /* 헤더의 높이만큼 아래로 */
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  padding: 10px;
}

/* 선택된 탭 버튼 스타일 */
.tab-header .active {
  font-weight: bold;
  border-bottom: 2px solid #007ad9;
}
</style>
