<template>
    <v-col class="sidebar-wrap" cols="2">
        <v-sheet rounded="lg">
            <v-list color="transparent">
                <v-list-item
                    v-for="link in links"
                    :key="link.id"
                    text
                >
                    <v-list-item-content>
                        <router-link :to="link.path">
                        {{ link.name }}   
                        </router-link>
                    </v-list-item-content>                    
                </v-list-item>
                <v-list-item>
                    <v-list-item-content class="logout-btn" @click="logout">
                        LOGOUT
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-sheet>
     </v-col>
</template>

<script>
import firebase from '@/firebase/firebase'
export default {
    name: 'sideBarLayout',
    data: () => ({
      links: [
        {
            id: 1,
            name: 'TOP',
            path: '/'
        },
        {
            id: 2,
            name: 'PROFILE',
            path: '/profile'
        },
        {
            id: 3,
            name: 'RANKING',
            path: '/ranking'
        },
      ],
    }),
    methods: {
        logout() {
            firebase.auth().signOut()
            .then( () => {
                sessionStorage.clear()
                this.$router.push('/login')
            })
            .catch(() => {
                console.log("ログアウト失敗しました。")
            })
        }
    }
}
</script>

<style scoped>
.sidebar-wrap .v-list-item__content a {
    color: rgba( 0, 0, 0, 0.87);
    text-decoration: none;
}
.logout-btn {
    cursor: pointer;
}
</style>
