<template>    
    <router-view/>
</template>

<script>

export default {
  name: 'App',
};
</script>

<style>
body {
  font-family: Roboto, sans-serif !important;
  background-image: linear-gradient(90deg, rgba(197, 225, 165, 0.8), rgba(252, 204, 144, 0.8)) !important;  
}
.page-title {
  color: #fff;
  background-color: #C5E1A5;
  text-align: center;
  font-size: 1.8rem !important;
  padding:10px; 
  margin-bottom: 40px;
  width: 100%;
  border-radius: 8px 8px 0 0;
}
li {
  list-style-type: none;
}
a {
  color: #03A9F4;
  text-underline-offset: 2px;
}
.v-main {
  background: linear-gradient(90deg, rgba(197, 225, 165, 0.8), rgba(252, 204, 144, 0.8));
  animation-name: gradation;
  background-size: 150% 150%;
  animation-duration: 3.0s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
}
.v-application--wrap {
  background: linear-gradient(90deg, rgba(197, 225, 165, 0.8), rgba(252, 204, 144, 0.8));
  animation-name: gradation;
  background-size: 150% 150%;
  animation-duration: 3.0s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
}
@keyframes gradation {
  0% {
      background-position: 0% 0%;
  }
  100% {
      background-position: 100% 100%;
  }
}
.vue-loading-wrap {
  position: fixed !important;
}
/* フォームページ共通 */
.form-wrap {
    width: 600px;
    text-align: center;
    margin: 0 auto;
    margin-top: 100px;
    border-radius: 3px;
    box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
    padding: 30px;
    background-color: #fff;
}
.form-wrap__title {
    margin-bottom: 20px;
}
.form-wrap__text {
    margin: 10px;
}
</style>
