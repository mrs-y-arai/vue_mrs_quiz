<template>
    <v-app-bar
      app
      flat
      color="light-green lighten-3"
      class="header"
    >
      <v-container class="py-0 fill-height header-wrap">
        <router-link to="/">
          <img class="game-logo" src="@/assets/game-logo.png" alt="mrs.green apple ロゴ">
        </router-link>
      </v-container>
    </v-app-bar>
</template>

<script>
export default {
    name: 'headerLayout',    
}
</script>

<style scoped>
.header-wrap {
  justify-content: center;
}
.game-logo {
  width: 300px;
  height: auto;
}
</style>
