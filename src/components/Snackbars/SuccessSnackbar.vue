<template>
  <v-snackbar
      :timeout="-1"
      v-model="$store.state.successSnackbarOpen"
      color="green"
      absolute
      right
      rounded="pill"
      top
  >
    예약성공!!
  </v-snackbar>
</template>

<script>
export default {
  name: 'success-snackbar',
}
</script>
