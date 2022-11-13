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
                <v-sheet class="ranking-page__content"
                rounded="lg"
                >
                <h2 class="page-title">Ranking</h2>
                <div class="ranking-page__block">
                    <p class="ranking-page__block__text" v-if="!rankingFlg">
                        このゲームの記録は、まだありません。
                        ゲームをプレイしましょう！
                    </p>
                    <v-simple-table
                    class="ranking-table"
                    v-if="rankingFlg"
                    >                        
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-center ranking-table__head">
                                        RANKING
                                    </th>
                                    <th class="text-center ranking-table__head">
                                        USER ID(NAME)
                                    </th>
                                    <th class="text-center ranking-table__head">
                                        SCORE
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                v-for="(item, i) in rankingArray"
                                :key="i"
                                >
                                    <td class="text-center ranking-table__detail">{{ i+1 }}</td>
                                    <td class="text-center ranking-table__detail">{{ item.userId }}({{ item.name }}さん)</td>
                                    <td class="text-center ranking-table__detail">{{ item.bestScore }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </div>   
                <v-btn
                color="orange darken-1"
                rounded
                to="/"
                class="ranking-page__link-btn"
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
    name: 'ProfileView',
    components: {
        headerLayout,
        sideBarLayout,
        loadingScreen,
    },        
    data: () => ({
        name: '',
        auth: null,
        photoUrl: '',
        userId: '',
        isLoading: true,
        rankingArray: [],
        rankingFlg: false
    }),
    methods: {
        async getRanking() {
            await firebase.auth().onAuthStateChanged((user) => {
              if(!user){                
                  sessionStorage.removeItem('user')
                  if (this.$route.name !== 'login') {
                      this.$router.push('/login')
                  }
              }else{
                console.log(user)
              }
              console.log('通っている')
            })

            const targetUser = await firebase.auth().currentUser
            console.log(targetUser)

            if( targetUser === null ) {
                this.$router.push('/')
            }
            
            const credential = await firebase.auth.EmailAuthProvider.credential(this.email,this.password)

            await targetUser.reauthenticateWithCredential(credential)
            .then(() => {
                console.log("アカウント認証成功")
            })
            .catch((error) => {
                this.isLoading = false
                console.log( "アカウント認証失敗", error )
            })

            const accountsScoreRef = firebase.firestore().collection("accounts_best_score")
            const snapShot = await accountsScoreRef.get()

            snapShot.forEach( (doc) => {
                const data = {...doc.data()}
                this.rankingArray.push(data)
            })
            
            // まだ記録がない場合
            if( this.rankingArray.length === 0 ){                
                this.isLoading = false
                return
            }

            // ランキングが高い順に並べ替え
            this.rankingArray.sort(function(a, b) {
                if( a.bestScore < b.bestScore ) {
                    return 1
                } else {
                    return -1
                }
            })
            
            // 10位以下の記録を削除
            this.rankingArray.splice(10)

            this.rankingFlg = true    
            this.isLoading = false

        },
    },
    mounted() {
        this.auth = JSON.parse(sessionStorage.getItem('user'))
        this.email = this.auth.email
        this.password = this.auth.password
        this.getRanking()
    },
}
</script>

<style scoped>
.ranking-page__content {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.ranking-page__block {
    width: 100%;
    margin: 0 auto;
    padding: 10px;
}
.ranking-page__link-btn {
    color: #fff !important;
    margin-bottom: 40px;
}
.ranking-page__block__text {
    text-align: center;
}
.ranking-table {
    margin-bottom: 20px;    
}
table {
    /* border: thin solid rgba(0, 0, 0, 0.12); */
}
.ranking-table__head {
    border-right: thin solid rgba(0, 0, 0, 0.12);
    border-top: thin solid rgba(0, 0, 0, 0.12);
    box-sizing: border-box;
}
.ranking-table__head:first-of-type {
    border-left: thin solid rgba(0, 0, 0, 0.12);
}
.ranking-table td {
    border-right: thin solid rgba(0, 0, 0, 0.12);
}
.ranking-table td:last-of-type {
    border-right: none;
}
.ranking-table__head:first-of-type {
    width: 15%;
}
.ranking-table__detail {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
.ranking-table__detail:first-of-type {
    width: auto !important;
    border-left: thin solid rgba(0, 0, 0, 0.12);
}
.ranking-table__detail:last-of-type {
    border-right: thin solid rgba(0, 0, 0, 0.12) !important;
}
</style>