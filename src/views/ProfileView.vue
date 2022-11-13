<template>
<div>
    <loadingScreen
    v-if="isLoading"
    />
    <v-app id="inspire">
        <!-- ヘッダー -->
        <headerLayout/>

        <v-alert
        class="success-message"
        type="success"
        v-bind:class="[successMessageFlg ? 'active' : 'passive']"
        >{{successMessage}}</v-alert>

        <v-alert
        class="error-message"
        type="error"
        v-bind:class="[errorMessageFlg ? 'active' : 'passive']"
        >保存失敗</v-alert>

        <v-main class="grey lighten-3">
        <v-container>
            <v-row>

            <sideBarLayout/>
            
            <v-col>
                <v-sheet class="profile-page__content"
                min-height="80vh"
                rounded="lg"
                >
                <h2 class="page-title">Profile</h2>
                <div class="profile-page__block">
                    <div class="profile-page__block__icon-box">
                        <v-avatar
                        color="white"
                        size="90"
                        class="profile-page__block__box__icon"
                        >
                            <input
                            type="file"
                            ref="inputFile"
                            accept="image/jpeg, image/jpg, image/png"
                            style="display: none;"
                            @change="updateIcon">

                            <v-icon
                            class="profile-page__block__box__icon__default-icon"
                            size="90"
                            dark
                            
                            v-if="!photoUrl"
                            >
                            mdi-account-circle
                            </v-icon>

                            <img
                            class="profile-page__block__box__icon__original-icon"
                            :src="photoUrl"
                            alt="プロフィール写真"
                            v-if="photoUrl"
                            >

                            <span class="
                            profile-page__block__box__icon-change-btn"
                            @click="changeIcon">
                                <img src="@/assets/photo-icon-white.png" alt="アイコン変更">
                            </span>

                        </v-avatar>
                    </div>                    
                    <div class="profile-page__block__box">
                        <h3 class="profile-page__block__box__title">Name: </h3>
                        <p class="profile-page__block__box__text">{{name}}</p>
                        <v-row class="profile-page__block__box__dialog" justify="end">
                            <v-dialog
                            v-model="nameDialog"
                            persistent
                            max-width="600px"
                            >
                            <template v-slot:activator="{ on, attrs }">
                                <img class="profile-page__block__box__change-btn" src="@/assets/change-icon.png" alt="編集する"
                                v-bind="attrs"
                                v-on="on"
                                >
                            </template>
                            <v-card>
                                <v-form
                                    ref="form"
                                    v-model="nameValid"
                                    lazy-validation
                                    @submit.prevent                                    
                                >
                                    <v-card-title>
                                        <span class="text-h5">Update Name</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container>
                                            <v-text-field
                                            label="Name(本名を入力しないでください)"
                                            v-model="updateName"
                                            :rules="nameRules"
                                            :counter="10"
                                            ></v-text-field>
                                            <small>更新したいお名前をご入力ください。</small>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            class="profile-form__btn"
                                            color="#C5E1A5"
                                            text
                                            @click="nameUpdateCancel"
                                        >
                                            CANCEL
                                        </v-btn>
                                        <v-btn
                                            class="profile-form__btn"
                                            color="#C5E1A5"
                                            text
                                            @click="nameUpdate"
                                            :disabled="isNameValid"                                        
                                        >
                                            Update
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card>
                            </v-dialog>
                        </v-row>
                    </div>
                    <div class="profile-page__block__box">
                        <h3 class="profile-page__block__box__title">E-mail: </h3>
                        <p class="profile-page__block__box__text">{{email}}</p>
                        <v-row class="profile-page__block__box__dialog" justify="end">
                            <v-dialog
                            v-model="mailDialog"
                            persistent
                            max-width="600px"
                            >
                            <template v-slot:activator="{ on, attrs }">                            
                                <img class="profile-page__block__box__change-btn" src="@/assets/change-icon.png" alt="編集する"
                                v-bind="attrs"
                                v-on="on"
                                >
                            </template>
                            <v-card>
                                <v-form
                                    ref="form"
                                    v-model="mailValid"
                                    lazy-validation
                                    @submit.prevent
                                >
                                    <v-card-title>
                                        <span class="text-h5">Update E-mail</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container>
                                            <v-text-field
                                            label="E-mail"
                                            v-model="updateMail"
                                            :rules="emailRules"
                                            ></v-text-field>
                                        <small>更新したいメールアドレスをご入力ください。</small>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            class="profile-form__btn"
                                            color="#C5E1A5"
                                            text
                                            @click="mailUpdateCancel"
                                        >
                                            CANCEL
                                        </v-btn>
                                        <v-btn
                                            class="profile-form__btn"
                                            color="#C5E1A5"
                                            text
                                            @click="mailUpdate"
                                            :disabled="isMailValid"
                                        >
                                            Update
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card>
                            </v-dialog>
                        </v-row>
                    </div>
                    <div class="profile-page__block__box">
                        <h3 class="profile-page__block__box__title">UserID: </h3>
                        <p class="profile-page__block__box__text">{{userId}}</p>
                    </div>
                    <div class="profile-page__block__box">
                        <h3 class="profile-page__block__box__title">Password: </h3>
                        <input class="profile-page__block__box__password" :value="password" type="password" readonly>
                        <v-row class="profile-page__block__box__dialog" justify="end">
                            <v-dialog
                            v-model="passwordDialog"
                            persistent
                            max-width="600px"
                            >
                            <template v-slot:activator="{ on, attrs }">                            
                                <img class="profile-page__block__box__change-btn" src="@/assets/change-icon.png" alt="編集する"
                                v-bind="attrs"
                                v-on="on"
                                >
                            </template>
                            <v-card>
                                <v-form
                                    ref="form"
                                    v-model="passwordValid"
                                    lazy-validation
                                    @submit.prevent
                                >
                                    <v-card-title>
                                        <span class="text-h5">Update Password</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container>
                                            <v-text-field
                                            label="Password"
                                            v-model="updatePassword"
                                            :rules="passwordRules"
                                            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                                            :type="passwordShow ? 'text' : 'password'"
                                            @click:append="passwordShow = !passwordShow"
                                            ></v-text-field>
                                        <small>変更したいパスワードをご入力ください。</small>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            class="profile-form__btn"
                                            color="#C5E1A5"
                                            text
                                            @click="passwordUpdateCancel"
                                        >
                                            CANCEL
                                        </v-btn>
                                        <v-btn
                                            class="profile-form__btn"
                                            color="#C5E1A5"
                                            text
                                            @click="passwordUpdate"
                                            :disabled="!passwordValid"
                                        >
                                            Update
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                                </v-card>
                            </v-dialog>
                        </v-row>
                    </div>
                </div>                
                <v-row class="profile-page__block__box__dialog" justify="end">
                    <v-dialog
                    v-model="deleteDialog"
                    persistent
                    max-width="600px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <p
                            class="profile-page__delete-btn"
                            v-bind="attrs"
                            v-on="on"
                            >
                            アカウント削除をする。
                            </p>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">Delete Account</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>                                        
                                    <p>
                                        アカウントの全てのデータが削除されます。<br>
                                        本当にアカウントを削除しますか？
                                    </p>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    class="profile-form__btn"
                                    color="grey darken-1"
                                    @click="deleteDialog = false"
                                >
                                    CANCEL
                                </v-btn>
                                <v-btn
                                    class="profile-form__btn"
                                    color="error"
                                    @click="deleteAccount"
                                >
                                    DELETE
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-row>
                <v-btn
                color="orange darken-1"
                rounded
                to="/"
                class="profile-page__link-btn"
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
        auth: null,
        name: '',
        nameValid: true,
        nameRules: [
            v => !!v || '名前を入力してください。',
            v => (v && v.length <= 10) || '10文字以内の名前を入力してください。',
        ],
        nameDialog: false,
        beforeName: '',
        updateName: '',
        email: '',
        mailValid: true,
        emailRules: [
            v => !!v || 'メールアドレスを入力してください。',
            v => /.+@.+\..+/.test(v) || '無効なメールアドレスです。',
            v => (v || '').indexOf(' ') < 0 || '空欄が入力されています。',
            v => (v || '').indexOf('　') < 0 || '空欄が入力されています。',
        ],
        mailDialog: false,
        updateMail: '',
        password: '',
        passwordValid: true,
        passwordRules: [
            v => !!v || 'パスワードを入力してください。',
            v => (v && 6 <= v.length) || '6文字以上のパスワードを入力してください。',
            v => (v || '').indexOf(' ') < 0 || '空欄が入力されています。',
            v => (v || '').indexOf('　') < 0 || '空欄が入力されています。',
        ],
        updatePassword: '',
        passwordDialog: false,
        passwordShow: false,
        photoUrl: '',
        file: null,
        filePath: null,
        deleteDialog: false,
        userId: '',
        successMessage: '',
        successMessageFlg: false,
        errorMessageFlg: false,
        isLoading: true,
    }),
    methods: {
        validate () {
            this.$refs.form.validate()
        },
        reset () {
            this.$refs.form.reset()
        },
        async nameUpdate() {
            this.isLoading = true

            await firebase.auth().onAuthStateChanged((user) => {
              if(!user){
                  sessionStorage.removeItem('user')
                  if (this.$route.name !== 'login') {
                      this.$router.push('/login')
                  }
              }else{
                console.log(user)
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

            await targetUser.updateProfile({
                displayName: this.updateName,
            })
            .then(() => {
                console.log('名前変更成功', targetUser)                    
                this.name = this.updateName

                // セッションストレージを更新する処理を入れる
                this.auth.displayName = this.updateName                    
                sessionStorage.setItem( 'user', JSON.stringify(this.auth))
            })
            .catch((error) => {
                console.log( "名前変更失敗", error )

                this.isLoading = false

                this.errorMessageFlg = true
                setTimeout(() => { this.errorMessageFlg=false }, 3000)
            })
            
            // ランキングのDBのnameを更新
            const accountsScoreRef = await firebase.firestore().collection("accounts_best_score")
            const snapShot = await accountsScoreRef.get()

            for( let i = 0; i < snapShot.docs.length; i++ ) {
                const bestScore = snapShot.docs[i].data().bestScore
                const userId = snapShot.docs[i].data().userId
                const docId = snapShot.docs[i].id

                if( userId === this.userId ){
                    await accountsScoreRef.doc(docId).set({
                        name: this.updateName,
                        bestScore: bestScore,
                        userId: userId,
                    })
                    .then(() => {
                        console.log('最高記録反映成功', targetUser)
                    })
                    .catch((error) => {
                        console.log( "最高記録反映失敗", error )
                    })

                }
            }

            this.nameDialog = false
            this.isLoading = false
            this.successMessage = '名前変更成功'
            this.successMessageFlg = true
            setTimeout(() => { this.successMessageFlg = false }, 3000)
            setTimeout(() => { this.successMessage = '' }, 4000)
        },
        nameUpdateCancel() {
            this.nameDialog = false
            setTimeout(() => { this.updateName = this.name }, 500)
        },
        async mailUpdate() {
            this.isLoading = true

            await firebase.auth().onAuthStateChanged((user) => {
              if(!user){
                  sessionStorage.removeItem('user')
                  if (this.$route.name !== 'login') {
                      this.$router.push('/login')
                  }
              }else{
                console.log(user)
              }
            })
            
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
                this.mailDialog = false
                this.isLoading = false
                console.log( "アカウント認証失敗", error )
            })
            
            targetUser.updateEmail(this.updateMail)
            .then(() => {
                console.log('メールアドレス変更成功', targetUser)                    
                this.email = this.updateMail

                // セッションストレージを更新する処理
                this.auth.email = this.email
                sessionStorage.setItem( 'user', JSON.stringify(this.auth))

                this.mailDialog = false

                this.isLoading = false

                this.successMessage = 'メールアドレス変更成功'
                this.successMessageFlg = true
                setTimeout(() => { this.successMessageFlg=false }, 3000)
                setTimeout(() => { this.successMessage='' }, 4000)

            })
            .catch((error) => {
                console.log( "メールアドレス変更失敗", error )

                this.mailDialog = false

                this.isLoading = false

                this.updateMail = this.email

                this.errorMessageFlg = true
                setTimeout(() => { this.errorMessageFlg=false }, 3000)
            })
        },
        mailUpdateCancel() {
            this.mailDialog = false
            setTimeout(() => { this.updateMail = this.email }, 500)
        },        
        changeIcon() {
            this.$refs.inputFile.click()
        },
        async updateIcon() {
            this.isLoading = true
            console.log("553")
            await firebase.auth().onAuthStateChanged((user) => {
              if(!user){
                  sessionStorage.removeItem('user')
                  if (this.$route.name !== 'login') {
                      this.$router.push('/login')
                  }
              }else{
                console.log(user)
              }
            })

            // アカウント認証
            const targetUser = await firebase.auth().currentUser

            if( targetUser === null ) {
                this.$router.push('/')
            }

            const credential = firebase.auth.EmailAuthProvider.credential(
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

            if( this.$refs.inputFile.files[0] ){                
                this.file = this.$refs.inputFile.files[0]
                this.filePath = `/user/${this.userId}/${this.file.name}`

                console.log(this.filePath)

                await firebase.storage().ref().child(this.filePath).put(this.file)
                .then(async snapshot => {
                    const photoUrl = await snapshot.ref.getDownloadURL()
                    console.log(photoUrl)

                    firebase.auth().onAuthStateChanged((user) => {
                        if(user) {
                            user.updateProfile({
                                photoURL: photoUrl
                            })
                        }
                    })
                    this.auth.photoURL = photoUrl
                    sessionStorage.setItem( 'user', JSON.stringify(this.auth) )          
                    this.photoUrl = photoUrl

                    console.log( "アイコン変更成功")

                    this.isLoading = false

                    this.successMessage = 'アイコン変更成功'
                    this.successMessageFlg = true
                    setTimeout(() => { this.successMessageFlg=false }, 3000)
                    setTimeout(() => { this.successMessage='' }, 4000)
                })
                .catch((error) => {
                    console.log( "アイコン変更失敗", error )

                    this.isLoading = false

                    this.errorMessageFlg = true
                    setTimeout(() => { this.errorMessageFlg=false }, 3000)
                    console.log("処理終了")
                })
            }else{
                console.log( "写真未選択" )
                this.isLoading = false
                return false
            }
        },
        passwordUpdateCancel() {
            this.passwordDialog = false

            setTimeout(() => { 
                this.updatePassword = ''
                this.passwordValid = true
            }, 500)
        },
        async passwordUpdate() {
            this.isLoading = true
            console.log("641")
            await firebase.auth().onAuthStateChanged((user) => {
              if(!user){
                  sessionStorage.removeItem('user')
                  if (this.$route.name !== 'login') {
                      this.$router.push('/login')
                  }
              }else{
                console.log(user)
              }
            })

            // アカウント認証
            const targetUser = await firebase.auth().currentUser

            if( targetUser === null ) {
                this.$router.push('/')
            }

            const credential = firebase.auth.EmailAuthProvider.credential(
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

            // パスワード変更
            await targetUser.updatePassword(this.updatePassword)
            .then(() => {
                console.log( 'パスワード変更成功' )
                this.password = this.updatePassword

                // セッションストレージを更新する処理
                this.auth.password = this.updatePassword
                sessionStorage.setItem( 'user', JSON.stringify(this.auth))

                this.passwordDialog = false

                this.isLoading = false

                this.successMessage = 'パスワード変更成功'
                this.successMessageFlg = true
                setTimeout(() => { this.updatePassword = '' }, 500)
                setTimeout(() => { this.successMessageFlg = false }, 3000)
                setTimeout(() => { this.successMessage = '' }, 4000)
            })
            .catch((error) => {
                console.log( 'パスワード変更失敗', error )
                this.passwordDialog = false
                this.isLoading = false
                this.errorMessageFlg = true
                setTimeout(() => { this.errorMessageFlg=false }, 3000)                
            })
        },
        async deleteAccount() {
            this.isLoading = true

            await firebase.auth().onAuthStateChanged((user) => {
              if(!user){
                  sessionStorage.removeItem('user')
                  if (this.$route.name !== 'login') {
                      this.$router.push('/login')
                  }
              }else{
                console.log(user)
              }
            })

            // アカウント認証
            const targetUser = await firebase.auth().currentUser

            if( targetUser === null ) {
                this.$router.push('/')
            }

            const credential = firebase.auth.EmailAuthProvider.credential(
                this.email,
                this.password
            )
            await targetUser.reauthenticateWithCredential(credential)
            .then(() => {
                console.log("アカウント認証成功")
            })
            .catch((error) => {
                this.deleteDialog = false
                this.isLoading = false
                console.log( "アカウント認証失敗", error )
            })

            // ランキングデータ削除
            const accountsScoreRef = firebase.firestore().collection("accounts_best_score")
            const snapShot = await accountsScoreRef.get()

            console.log('740')
            for( let i = 0; i < snapShot.docs.length; i++ ) {
                const userId = snapShot.docs[i].data().userId
                const docId = snapShot.docs[i].id

                console.log(userId)
                console.log(this.userId)

                console.log('748')
                if( userId == this.userId ){
                    console.log('750')
                    await accountsScoreRef.doc(docId).delete()
                    .then( () => {
                        console.log( "ランキングデータ削除成功" )
                    })
                    .catch((error) => {
                        this.deleteDialog = false
                        this.isLoading = false
                        console.log( "ランキングデータ削除失敗", error )
                    })
                } 
            }
            
            // アイコンファイル削除
            if( this.photoUrl ){
                const storageRef = firebase.storage().ref()
                const iconListRef = storageRef.child(`/user/${this.userId}`)

                await iconListRef.listAll()
                .then( async(icon) => {
                    for( let i = 0; i < icon.items.length; i++ ){
                        var targetRef = storageRef.child(icon.items[i].fullPath)

                        // アイコン削除
                        await targetRef.delete()
                        .then(() => {
                            console.log('アイコン削除成功')
                        })
                        .catch((error) => {
                            this.deleteDialog = false
                            this.isLoading = false
                            console.log('アイコン削除失敗', error)
                        })
                    }
                })
                .catch((error) => {
                    this.deleteDialog = false
                    this.isLoading = false
                    console.log('アイコン取得失敗', error)
                });
            }

            // アカウント削除
            await targetUser.delete()
            .then(() => {
                console.log("アカウント削除成功")
                sessionStorage.clear()

                firebase.auth().signOut()
                .then(() => {
                    this.isLoading = false                    
                    localStorage.setItem('status', 'アカウント削除が完了しました。')
                    this.$router.push('/signup')
                    console.log( "サインアウト成功")
                })
                .catch((error) => {
                    this.deleteDialog = false
                    this.isLoading = false
                    console.log( "サインアウト失敗", error )
                })
            })
            .catch((error) => {
                this.deleteDialog = false
                this.isLoading = false
                console.log( "アカウント削除失敗", error )
            })
        },
    },
    computed: {
        isNameValid() {
            return !this.nameValid
        },
        isMailValid() {
            return !this.mailValid
        },
    },
    mounted() {
        this.auth = JSON.parse(sessionStorage.getItem('user'))
        this.name = this.auth.displayName
        this.beforeName = this.name
        this.email = this.auth.email
        this.photoUrl = this.auth.photoURL
        this.userId = this.auth.userId
        this.password = this.auth.password        

        setTimeout(() => { this.isLoading = false }, 500)

        this.updateName = this.name
        this.updateMail = this.email
    },
}
</script>

<style scoped>
.profile-page__content {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.profile-page__block {
    width: 60%;
    margin: 0 auto;
    padding: 10px;
}
.profile-page__block__box {
    display: flex;
    align-items: center;
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%);
    padding-bottom: 10px;
    margin-bottom: 30px;
}
.profile-page__block__icon-box {
    display: flex;
    align-items: center;
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%);
    padding-bottom: 10px;
    margin-bottom: 30px;
    box-shadow: none;
}
.profile-page__block__box__icon {
    margin: 0 auto;
    position: relative;
}
.profile-page__block__box__icon-change-btn {
    width: 90px;
    height: 25px;
    background-color: #757575;
    display: flex;
    justify-content: center;
    align-items: center;    
    position: absolute;
    bottom: 0;
    cursor: pointer;
}
.profile-page__block__box__icon-change-btn img {
    width: 20px;
    height: 20px;
    display: block;
}
.profile-page__block__box__icon__default-icon {
    background-color: #757575;
}
.profile-page__block__box__title {
    width: 200px;
}
.profile-page__block__box__text {
    margin-bottom: 0;
}
.profile-page__block__box__dialog {
    margin-right: 0;
}
.profile-page__block__box__change-btn {
    width: 24px;
    height: auto;
}
.profile-page__block__box__password {
    pointer-events: none;
}
.profile-form__btn {
    color: #fff !important;
    background-color: #C5E1A5;
}
.theme--light.v-btn.v-btn--disabled {
    color: rgba(0, 0, 0, 0.26) !important;
    background-color: rgba(0, 0, 0, 0.12) !important;
}
.profile-page__delete-btn {
    text-decoration: underline;
    color: #1976d2;
    cursor: pointer;
    text-underline-offset: 2px;
    margin-bottom: 25px;
}
.profile-page__link-btn {
    color: #fff !important;
    margin-bottom: 40px;
}
.success-message,.error-message {
    z-index: 999;
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 64px;
    transition-duration: 1s;
    margin-bottom: 0 !important;
    border-radius: 0;
}
.v-alert__wrapper {
    width: fit-content;
}
.active {
    transform: translateY(0);
}
.passive {
    transform: translateY(-64px);
}
</style>