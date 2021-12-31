<template>
  <div class="text-center">
    <v-card>
      <v-card-title class="text-h6">
        {{ msg }}
      </v-card-title>
      <v-card-text>
        {{ subMsg }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="#FFD600"
            @click="onClickOk"
        >
          {{ okMsg }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'alert',
  props: ['msg', 'okMsg', 'subMsg'],
  methods: {
    onClickOk() {
      this.$emit('clickDialogOk')
    }
  }
}
</script>

<style scoped>
.v-card__text {
  color: black;
}
</style>
