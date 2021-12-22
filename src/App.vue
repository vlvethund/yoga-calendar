<template>
  <div class="aaaa">
  <v-app>
    <v-app-bar
      app
      color="#FFD600"
    >
      <div class="d-flex align-center">
     <h1>mindeulle.yoga</h1>
      </div>
    </v-app-bar>
    <v-main>
      <calendar-main/>
      <success-snackbar/>
      <failure-snackbar/>
    </v-main>
  </v-app>
  </div>
</template>

<script>
import {CalendarMain, FailureSnackbar, SuccessSnackbar} from './components';

export default {
  name: 'App',
  components: {
    CalendarMain,
    FailureSnackbar,
    SuccessSnackbar
  },

  data: () => ({
    //
  }),
};
</script>
