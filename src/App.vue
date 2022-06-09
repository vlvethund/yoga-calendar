<template>
    <v-app>
      <v-app-bar
          app
          color="#F7F7F7"
          dense
      >
        <div class="d-flex align-center">
          <h2>mindeulle.yoga</h2>
          <v-img
              src="./assets/dandelion.png"
              max-width="25"
          />
        </div>
      </v-app-bar>
      <v-main>
        <success-snackbar/>
        <failure-snackbar/>
        <calendar-main/>
      </v-main>
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
