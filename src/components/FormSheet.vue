<template>
  <v-card>
    <v-card-title>예약하기 [{{ getReservatingDate }}]</v-card-title>
    <v-container
        id="input-usage"
        fluid
    >
      <v-row>
        <v-col cols="10">
          <v-text-field
              label="성함"
              prepend-icon="mdi-account-circle"
              :value="this.$data.name"
              @input="onNameInput"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10">
          <v-text-field
              label="전화번호"
              prepend-icon="mdi-phone"
              :value="mobile"
              @input="onMobileInput"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-btn @click="reserve">예약</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import dayjs from 'dayjs'
import axios from 'axios'
import staticField from '../assets/static'

export default {
  name: 'form-sheet',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data() {
    return ({
      model: this.event,
      name: '',
      mobile: ''
    });
  },
  computed: {
    getReservatingDate() {
      return dayjs(this.model.start).format('MM월 DD일 HH시');
    }
  },
  methods: {
    async reserve() {

      this.event.details.attendees.push({name: this.name, mobile: this.mobile})

      const refreshData = {
        client_id: staticField.clientId,
        client_secret: staticField.clientSecret,
        grant_type: staticField.grantType,
        refresh_token: staticField.refreshToken,
      }

      console.log(refreshData);

      const tokenData = await axios.post('https://oauth2.googleapis.com/token', refreshData)
      console.log(tokenData)

      const body = {
        summary: `민들레 (${this.event.details.attendees.length}/${this.event.details.maxCount})`,
        description: JSON.stringify(this.event.details)}
      const config = {
        headers: {
          Authorization: `Bearer ${tokenData.data.access_token}`
        }
      }

      const {calendarID, googleKey} = staticField;
      try {
        await axios.patch(`/api/googleapis/calendar/v3/calendars/${calendarID}/events/${this.model.id}?key=${googleKey}`, body, config).then((_item, error) => {
          if (error) {
            this.$emit('error')
            return
          }
          this.$emit('success')
        })
      } catch (e) {
        console.log(e)
      }
    },
    onNameInput(value) {
      this.name = value
    },
    onMobileInput(value) {
      this.mobile = value;
    }
  }
}
</script>
