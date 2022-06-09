<template>
  <v-snackbar
      :timeout="-1"
      v-model="$store.state.successSnackbarOpen"
      color="green"
      right
      rounded="pill"
      bottom
  >
    {{ this.$store.state.successMessage }}
  </v-snackbar>
</template>

<script>
export default {
  name: 'success-snackbar',
}
</script>
