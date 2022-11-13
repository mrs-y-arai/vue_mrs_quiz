<template>
  <div>
    <loadingScreen
    v-if="isLoading"
    />
    <v-app id="inspire">
      <!-- ヘッダー -->
      <headerLayout/>

      <v-main class="grey lighten-3">
        <v-container>
          <v-row>
            
            <sideBarLayout/>

            <v-col>
              <v-sheet class="top-page__content"
                rounded="lg"
              >
                <div class="top-page__visual">
                  <h2 class="page-title top-page__visual__title mb-4">Mrs.Green Apple Quiz App</h2>
                  <p class="top-page__visual__text mb-4">ようこそ{{name}}さん!!</p>
                  <carousel3d
                  :controls-visible="false"
                  :clickable="false"
                  :autoplay="true"
                  :autoplayTimeout="2000"
                  :animationSpeed="800"                  
                  :height="270"
                  :width="270"
                  >
                    <slide v-for="(slide, i) in slides" :index=i :key="i">
                      <img class="top-page__visual__jkt-img" :src='slide'>
                    </slide>
                  </carousel3d>
                  <v-btn class="top-page__visual__start-btn"
                    color="orange darken-1"
                    depressed
                    elevation="2"
                    large
                    to="/game"
                    rounded
                  >GAME START!!</v-btn>
                </div>
              </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import headerLayout from '@/components/headerLayout.vue'
import sideBarLayout from '@/components/sideBarLayout.vue'
import firebase from '@/firebase/firebase'
import loadingScreen from '@/components/loadingScreen.vue'
import { Carousel3d, Slide } from 'vue-carousel-3d'
  export default {    
    data: () => ({
      name: '',
      auth: null,
      isLoading: true,
      photoUrl: '',
      slides: [
        require ('@/assets/mrsgreenaapple_best.jpg'),
        require ('@/assets/variety.jpg'),
        require ('@/assets/twelve.jpg'),
        require ('@/assets/mga.jpg'),
        require ('@/assets/ensemble.png'),
        require ('@/assets/attitude.jpg'),
        require ('@/assets/unity.jpg'),
      ],
      email: '',
      password: '',
    }),
    components: {
      headerLayout,
      sideBarLayout,
      loadingScreen,
      carousel3d: Carousel3d,
      slide: Slide
    },
    async mounted() {      
      this.auth = JSON.parse(sessionStorage.getItem('user'))
      this.name = this.auth.displayName
      this.email = this.auth.email
      this.password = this.auth.password
      this.photoUrl = this.auth.photoURL
      setTimeout(() => { this.isLoading = false }, 700)

      // 画像URL読み込み
      if( this.photoUrl ) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', this.photoUrl )
        xhr.send()
        console.log(this.auth.photoURL)
        xhr.onload = async () => {
          if (xhr.status === 403) {
            // photoURL初期化
            this.photoUrl = ''
            this.auth.photoURL = ''
            sessionStorage.setItem( 'user', JSON.stringify(this.auth))            
  
            // authのphotoURL初期化
            const targetUser = await firebase.auth().currentUser
            console.log(targetUser)
            await targetUser.updateProfile({
              photoURL: ''
            })
            .then(() => {
              console.log( 'photoURL削除成功' )
            })
            .catch((error) => {
              console.log( 'photoURL削除失敗' ,error )
            })
          }
        }
      }
    },
  }
</script>

<style scoped>
.top-page__content {
  width: 100%;
  display: flex;
  justify-content: center;
}
.top-page__visual {
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
}
.top-page__visual__text {
  font-size: 24px;
  margin-bottom: 20px;
}
.carousel-3d-container {
  overflow: unset;
  margin-bottom: 30px;
}
.carousel-3d-slide {
  background: transparent;
  border: none;
  box-shadow: 0px 0px 14px -3px #777777 !important;
  border-radius: 10px;
}
.top-page__visual__jkt-img {  
  border-radius: 10px;
}
.top-page__visual__start-btn {
  width: 350px;
  font-size: 20px;
  color: #fff;
  margin-bottom: 20px;
}
</style>