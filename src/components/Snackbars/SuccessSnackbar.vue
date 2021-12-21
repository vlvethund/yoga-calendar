<template>
  <v-snackbar
      :timeout="3"
      v-model="open"
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
  props: ['open']
}
</script>
