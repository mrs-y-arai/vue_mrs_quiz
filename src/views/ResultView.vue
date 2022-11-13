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
            <v-sheet class="result-page__content"              
              rounded="lg"
            >
                <h2 class="page-title">Result</h2>
                <p class="result-page__name">{{name}}さんの結果は...</p>
                <p class="result-page__point">{{point}}点</p>
                <p class="result-page__correct-count">{{totalCount}}問中{{correctCount}}問正解!!</p>
                <v-btn
                    color="orange darken-1 result-page__btn"
                    rounded
                    to="/"
                >
                TOP
                </v-btn>
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
  export default {
    components: {
      headerLayout,
      sideBarLayout,
      loadingScreen,      
    },    
    data: () => ({
      name: '',
      userId: '',
      email: '',
      password: '',
      auth: null,
      correctCount: 0,
      totalCount: 0,
      point: 0,
      totalPoint: 0,
      recordsFlg: false,
      isLoading: true,
    }),    
    methods: {
      countUp() {
        this.count = setInterval(() => this.point++ , 10)
      },
      async setRecord() {
        // アカウント認証        
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

        // 記録をセット
        const accountsScoreRef = firebase.firestore().collection("accounts_best_score")
        const snapShot = await accountsScoreRef.get()

        for( let i = 0; i < snapShot.docs.length; i++ ) {
          const userId = snapShot.docs[i].data().userId
          const score = snapShot.docs[i].data().bestScore
          const docId = snapShot.docs[i].id

          // 最高記録更新
          if( userId == this.userId && score < this.totalPoint  ){
              
            await accountsScoreRef.doc(docId).delete()
            .then( () => {
              console.log('過去記録削除成功')
            })
            .catch( error => {
              console.log( '過去記録削除失敗' ,error)
            })
            
            await accountsScoreRef.doc().set({
              name: this.name,
              userId: this.userId,
              bestScore: this.totalPoint
            })
            .then( () => {
              console.log( '最高記録更新成功')
              this.recordsFlg = true
            })
            .catch( error => {
              console.log( '最高記録更新失敗' ,error)
            })
            // 記録変わらず
            }else if( userId == this.userId ){

              this.recordsFlg = true
              console.log('最高記録変わらず')
          }
        }

        // まだ記録がない場合
        if( this.recordsFlg === false ){

          await accountsScoreRef.doc().set({
            name: this.name,
            userId: this.userId,
            bestScore: this.totalPoint
          })
          .then( () => {
            console.log('記録成功')
          })
          .catch( (error) => {
            console.log( '記録失敗' ,error)
          })
        }
      },
    },
    async mounted() {      
      // セッションから名前を取得
      this.auth = JSON.parse(sessionStorage.getItem('user'))
      this.name = this.auth.displayName
      this.userId = this.auth.userId
      this.email = this.auth.email
      this.password = this.auth.password

      // ローカルストレージから正解数を取得
      this.correctCount = localStorage.correctCount
      this.totalCount = localStorage.totalCount
      this.totalPoint = Math.round(this.correctCount/this.totalCount*100)
      localStorage.correctCount = ''
      localStorage.totalCount = ''

      await this.setRecord()
      this.isLoading = false
      this.countUp()
    },
    updated() {
      if( this.point >= this.totalPoint ){
        clearInterval(this.count)
      }        
    },
  }
</script>

<style scoped>
.result-page__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
}
.result-page__btn {
    color: #fff;
    width: 150px;
    margin-bottom: 40px;
}
.result-page__correct-count {
    font-size: 1.5rem;
}
.result-page__point {
  font-size: 3rem;
}
</style>