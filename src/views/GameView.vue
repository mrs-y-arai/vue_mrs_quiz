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
              <v-sheet class="game-page__content"
                min-height="80vh"
                rounded="lg"
              >
              <h2 class="page-title">第{{questionCount}}問目 / 全{{totalCount}}問中</h2>
              <v-card
                elevation="2"
                class="game-page__card"
              >
                <div class="question-block">
                  <v-card-title class="question-block__title">この歌詞は、どの曲の歌詞でしょう？</v-card-title>
                  <p class="question-block__lyric-text">【{{lyric}}】</p>
                </div>
                  <v-dialog
                  v-model="dialog"
                  persistent
                  max-width="600"
                  >
                  <template v-slot:activator="{ on, attrs }">
                    <div class="answer-block">
                      <h3 class="page-title answer-block__title">選択肢</h3>
                      <div class="answer-block__btn-wrap">
                        <v-btn
                          color="orange darken-1"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          rounded
                          @click="answer"
                          class="answer-block__btn"
                        >{{choiceList[0]}}</v-btn>
                        <v-btn
                          color="orange darken-1"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          rounded
                          @click="answer"
                          class="answer-block__btn"
                        >{{choiceList[1]}}</v-btn>
                        <v-btn
                          color="orange darken-1"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          rounded
                          @click="answer"
                          class="answer-block__btn"
                        >{{choiceList[2]}}</v-btn>
                      </div>
                      <router-link
                      class="answer-block__top-link"
                      to="/"
                      >
                        EXIT
                      </router-link>
                    </div>                    
                  </template>
                  <v-card class="result-block">
                    <v-card-title class="text-h5 result-block__title --correct" v-if="correctMessage">
                      {{correctMessage}}
                    </v-card-title>
                    <v-card-title class="text-h5 result-block__title --mistake" v-if="mistakeMessage">
                      {{mistakeMessage}}
                    </v-card-title>
                    <v-card-text class="result-block__text">
                      正解の曲名は、
                    </v-card-text>
                    <v-card-text class="result-block__answer">
                      {{this.correctSong}}
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        color="orange darken-1 result-block__btn"
                        rounded
                        @click="next"
                        v-if="!lastFlag"
                      >
                        NEXT
                      </v-btn>
                      <v-btn
                        color="orange darken-1 result-block__btn"
                        rounded
                        @click="end"
                        v-if="lastFlag"
                      >
                        END
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>              
              </v-card>            
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
import loadingScreen from '@/components/loadingScreen.vue'
import firebase from '@/firebase/firebase'
  export default {    
    data: () => ({
      auth: null,
      name: '',
      email: '',
      password: '',
      songsArray: [],
      correctSong: '',
      lyric: '',
      choiceList: [],
      dialog: false,
      correctMessage: '',
      mistakeMessage: '',
      correctCount: 0,
      totalCount: 0,
      questionCount: 0,
      lastFlag: false,
      isLoading: true      
    }),
    components: {
      headerLayout,
      sideBarLayout,
      loadingScreen,
    },    
    methods: {
      // 問題の値を取得
      async getValue () {
        firebase.auth().onAuthStateChanged((user) => {
            if(!user){
                sessionStorage.removeItem('user')
                if (this.$route.name !== 'login') {
                  this.$router.push('/login')
                }
            }
        })

        const targetUser = await firebase.auth().currentUser
        console.log(targetUser)

        if( targetUser === null ) {
          this.$router.push('/')
        }

        const credential = await firebase.auth.EmailAuthProvider.credential(
          this.email,
          this.password
        )
        await targetUser.reauthenticateWithCredential(credential)
        .then(() => {
            console.log("アカウント認証成功")
        })
        .catch((error) => {
            this.isLoading = false
            console.log( "アカウント認証失敗", error )
        })
        const songsRef = firebase.firestore().collection("songs")
        const snapShot = await songsRef.get()

        snapShot.forEach( (doc) => {
          const songData = {...doc.data()}
          this.songsArray.push(songData)
          this.songsArray = this.arrayShuffle(this.songsArray)          
        })

        // 合計問題数
        this.totalCount = this.songsArray.length

        // 1つ目の問題をセットする
        this.setQuestion()
      },

      // 配列をシャッフルする
      arrayShuffle(array) {
        for(let i = (array.length - 1); 0 < i; i--){

          let r = Math.floor(Math.random() * (i + 1));

          let tmp = array[i];
          array[i] = array[r];
          array[r] = tmp;
        }
        return array;
      },

      // 問題をセットする
      setQuestion() {
        this.lyric = this.songsArray[0].lyric
        this.correctSong = this.songsArray[0].correctSong

        this.choiceList = []

        this.choiceList.push(this.songsArray[0].correctSong)
        this.choiceList.push(this.songsArray[0].incorrectSong1)
        this.choiceList.push(this.songsArray[0].incorrectSong2)

        this.choiceList = this.arrayShuffle(this.choiceList)

        this.questionCount++

        // 最後の問題の場合    
        if( this.songsArray.length <= 1 ){
          this.lastFlag = true
        }
      },

      answer(e) {
        firebase.auth().onAuthStateChanged((user) => {
            if(!user){
                sessionStorage.removeItem('user')
                if (this.$route.name !== 'login') {
                  this.$router.push('/login')
                }
            }
        })
        // 正誤判定
        if( e.target.textContent === this.correctSong ) {
          this.correctMessage = '正解!!'
          this.correctCount++
        }else {
          this.mistakeMessage = '間違い!!'
        }        
      },

      next() {
        firebase.auth().onAuthStateChanged((user) => {
            if(!user){
                sessionStorage.removeItem('user')
                if (this.$route.name !== 'login') {
                  this.$router.push('/login')
                }
            }
        })
        this.dialog = false
        delete this.songsArray[0]
        this.songsArray = this.songsArray.filter(Boolean)
        setTimeout(() => { this.setQuestion() }, 200)      
        this.correctMessage = ''
        this.mistakeMessage = ''
      },

      end() {
        firebase.auth().onAuthStateChanged((user) => {
            if(!user){
                sessionStorage.removeItem('user')
                if (this.$route.name !== 'login') {
                  this.$router.push('/login')
                }
            }
        })
        localStorage.setItem('correctCount', this.correctCount)
        localStorage.setItem('totalCount', this.totalCount)        
        this.$router.push('/result')
      }
    },
    async created(){
      await this.getValue()
      this.isLoading = false 
    },
    mounted() {
      this.auth = JSON.parse(sessionStorage.getItem('user'))
      this.name = this.auth.displayName
      this.email = this.auth.email
      this.password = this.auth.password
    },
  }
</script>

<style scoped>
body {
  position: relative;
}
.page-title {
  margin-bottom: 0;
}
.game-page__content {
  background: transparent;
} 
.game-page__card {
  box-shadow: none !important;
  background: transparent;
}
.question-block {
  padding: 10px;
  margin-bottom: 70px;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
}
.question-block__title {
  justify-content: center;
}
.question-block__lyric-text {
  text-align: center;
  font-size: 1.8rem;
}
.answer-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;  
}
.answer-block__title {
  font-weight: bold;
}
.answer-block__btn-wrap {
  padding: 30px;
}
.answer-block__btn {
  margin-right: 10px;
  font-weight: 700;
  text-transform: none;
}
.answer-block__btn:last-of-type {
  margin-right: 0;
}
.answer-block__top-link {
  margin-bottom: 20px;
  font-size: 16px;
}
.result-block__title {  
  color: #fff;
  padding: 5px;
  justify-content: center;
}
.result-block__title.--correct {
  background-color: #4caf50;
}
.result-block__title.--mistake {
  background-color: #FF5252;
}
.result-block__text {
  text-align: center;
  font-size: 20px;
  margin-top: 20px;
}
.result-block__answer {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
.result-block__btn {
  margin: 0 auto;
  padding: 10px;
  width: 150px;
  color: #fff;  
  margin-bottom: 20px;  
}
</style>
