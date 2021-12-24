import Vue from 'vue'
import {initializeApp} from "firebase/app";
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'

Vue.config.productionTip = false

const firebaseConfig = {
    apiKey: process.env.VUE_APP_API_KEY ,
    authDomain: process.env.VUE_APP_AUTH_DOMAIN ,
    projectId: process.env.VUE_APP_PROJECT_ID ,
    storageBucket: process.env.VUE_APP_STORAGE_BUCKET ,
    messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID ,
    appId: process.env.VUE_APP_APP_ID ,
    measurementId: process.env.VUE_APP_MEASUREMENT_ID
};

initializeApp(firebaseConfig);

new Vue({
    vuetify,
    store,
    render: h => h(App)
}).$mount('#app')
