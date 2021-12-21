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
    예약에 실패했습니다. 관리자에게 문의해주세요.
  </v-snackbar>
</template>

<script>
export default {
  name: 'failure-snackbar',
  props: ['open']
}
</script>
