<template>
    <v-app>
      <v-app-bar
          app
          dense
          elevation="0"
          color="white"
          class="d-flex justify-center"
      >
        <div class="align-center">
          <v-img
              src="./assets/logo.png"
              max-width="95"
          />
        </div>
      </v-app-bar>
      <v-main>
        <calendar-main/>
      </v-main>
      <success-snackbar/>
      <failure-snackbar/>
    </v-app>
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
