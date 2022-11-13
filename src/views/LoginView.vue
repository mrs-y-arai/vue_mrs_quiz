<template>
    <v-app>
        <div class="form-wrap">
            <h2 class="form-wrap__title">Login</h2>
            <p class="form-wrap__text">ユーザー情報を入力してください。</p>
            <router-link class="form-wrap__link" to="/signup">新規登録はこちら</router-link>

            <v-form
                ref="form"
                v-model="valid"
                lazy-validation                
            >
                <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
                ></v-text-field>

                <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                required
                :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                :type="passwordShow ? 'text' : 'password'"
                @click:append="passwordShow = !passwordShow"
                ></v-text-field>

                <div class="login-btn-wrap mb-4">
                    <v-btn
                    class="mr-2"
                    @click="login"
                    color="success"
                    :disabled="isValid"
                    >
                    Login
                    </v-btn>

                    <v-btn
                    color="error"
                    class="ml-2"
                    @click="reset"
                    >
                    Reset
                    </v-btn>
                </div>

                <v-alert
                type="success"
                v-if="message"
                outlined
                >
                {{message}}
                </v-alert>

                <v-alert
                type="error"
                v-if="errorMessage"
                outlined
                >
                {{errorMessage}}
                </v-alert>

            </v-form>
        </div>
    </v-app>
</template>

<script>
import firebase from '@/firebase/firebase'
  export default {
    name: 'LoginView',    
    data: () => ({
      valid: true,
      zenkaku: '/^[^\x01-\x7E\uFF61-\uFF9F]+$/',
      email: '',
      emailRules: [
        v => !!v || 'メールアドレスを入力してください。',
        v => /.+@.+\..+/.test(v) || '無効なメールアドレスです。',
        v => (v || '').indexOf(' ') < 0 || '空欄が入力されています。',        
        v => (v || '').indexOf('　') < 0 || '空欄が入力されています。',
      ],
      password: '',
      passwordRules: [
        v => !!v || 'パスワードを入力してください。',
        v => (v && 6 <= v.length) || '6文字以上のパスワードを入力してください。',
        v => (v || '').indexOf(' ') < 0 || '空欄が入力されています。',
        v => (v || '').indexOf('　') < 0 || '空欄が入力されています。',
      ],
      passwordShow: false,
      message: '',
      errorMessage: '',
      successMessageFlg: false,      
    }),
    methods: {
      login () {
        firebase.auth().signInWithEmailAndPassword( this.email, this.password)
        .then((result) => {            

            console.log( "success", result )

            const auth = {
                displayName: result.user.displayName,
                email: result.user.email,
                userId: result.user.uid,
                refreshToken: result.user.refreshToken,
                photoURL: result.user.photoURL,
                password: this.password,
            }

            sessionStorage.setItem( 'user', JSON.stringify(auth))

            // TOPページへリダイレクト
            this.$router.push('/')
        })
        .catch((error) => {
            console.log( "fail", error )

            this.errorMessage = "ログインに失敗しました。"
            setTimeout(() => this.errorMessage='', 3000 )
        })
      },
      validate () {
        this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
      },
    },
    computed: {
      isValid() {
          return !this.valid
      }
    },
    mounted() {
      if( localStorage.status ){
        this.message = localStorage.status
        localStorage.status = ''
        setTimeout(() => this.message='', 3000 )
      }
    },
  }
</script>