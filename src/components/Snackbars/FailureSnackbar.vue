<template>
  <v-snackbar
      :timeout="-1"
      v-model="$store.state.failureSnackbarOpen"
      color="red"
      right
      rounded="pill"
      bottom
  >
    {{ this.$store.state.failureMessage }}
  </v-snackbar>
</template>

<script>
export default {
  name: 'failure-snackbar',
}
</script>
