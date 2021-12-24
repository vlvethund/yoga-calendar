<template>
  <v-snackbar
      :timeout="-1"
      v-model="$store.state.failureSnackbarOpen"
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
}
</script>
