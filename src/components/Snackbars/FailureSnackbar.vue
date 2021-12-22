<template>
  <v-snackbar
      :timeout="3"
      v-model="open"
      color="red"
      absolute
      right
      rounded="pill"
      top
  >
    {{ this.$store.state.failureMessage }}
  </v-snackbar>
</template>

<script>
export default {
  name: 'failure-snackbar',
  data(){
    return({
      open: this.$store.state.failureSnackbarOpen
    })
  }
}
</script>
