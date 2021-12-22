import Vue from 'vue'
import { initializeApp } from "firebase/app";
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyAYhP9N8D0OHJnsmA0hPXQyUqRW1W5D7ek",
  authDomain: "mindeulle.firebaseapp.com",
  projectId: "mindeulle",
  storageBucket: "mindeulle.appspot.com",
  messagingSenderId: "602199815410",
  appId: "1:602199815410:web:7abd50a6c31dea405c0c6b",
  measurementId: "G-PRB2J1N5C8"
};

initializeApp(firebaseConfig);

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
