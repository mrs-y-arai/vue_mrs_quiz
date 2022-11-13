<template>
    <div class="vue-loading-wrap">
      <vue-loading      
      type="spiningDubbles"
      color="#C5E1A5"
      :size="{ width: '100px', height: '100px' }">
      </vue-loading>
    </div>
</template>

<script>
import {VueLoading} from 'vue-loading-template';

export default {
  name: 'loadingScreen',
  components: {
    VueLoading
  },
};
</script>

<style scoped>
.vue-loading-wrap {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba( 255, 255, 255, 0.95);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.vue-loading {
  z-index: 999;
}
</style>


