<template>
    <v-app>
        <div class="form-wrap">
            <h2 class="form-wrap__title">Sign Up</h2>
            <p class="form-wrap__text">登録するユーザー情報を入力してください。</p>
            <router-link class="form-wrap__link" to="/login">ログインはこちら</router-link>

            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >
                <v-text-field
                v-model="name"
                :counter="10"
                :rules="nameRules"
                label="Name(本名を入力しないでください)"
                required
                ></v-text-field>

                <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
                ></v-text-field>

                <v-text-field
                class="sign-in__password-area"
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
                    @click="submit"
                    color="success"
                    :disabled="isValid"
                    >
                    REGISTER
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
      name: '',
      nameRules: [
        v => !!v || '名前を入力してください。',
        v => (v && v.length <= 10) || '10文字以内の名前を入力してください。',
      ],
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
      errorMessage: ''
    }),
    methods: {
      submit () {
        firebase.auth().createUserWithEmailAndPassword( this.email, this.password)
        .then(async (result) => {            
            await result.user.updateProfile(
                {displayName: this.name}
            )
            console.log( "ユーザー新規作成成功", result )

            localStorage.setItem('status', 'ユーザーの新規作成に成功しました。')

            // TOPページへリダイレクト
            this.$router.push('/login')
        })
        .catch((error) => {
            console.log( "ユーザー新規作成失敗", error )
            this.errorMessage = "ユーザーの新規作成に失敗しました。"
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
      this.message = localStorage.status
      localStorage.status = ''
      setTimeout(() => this.message='', 3000 )
    }
  }
</script>