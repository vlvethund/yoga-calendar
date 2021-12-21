<template>
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
    </v-main>
  </v-app>
</template>

<script>
import {CalendarMain} from './components';

export default {
  name: 'App',

  components: {
    CalendarMain,
  },

  data: () => ({
    //
  }),
};
</script>
