<template>
  <div>
    <v-card>
      <v-card-title>예약정보 [{{ getReservatingDate }}]</v-card-title>
      <v-card-text>
        <v-card>
          <v-container
              id="input-usage"
              fluid
          >
            <v-row>
              <v-col cols="10">
                <v-text-field
                    label="이름"
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
                    @keydown="onsomething"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-card-actions>
                <v-btn @click="reserve" color="#FFD600"><b>예약하기</b></v-btn>
              </v-card-actions>

            </v-row>

          </v-container>
        </v-card>
        <v-spacer></v-spacer>
        <v-card min-height="200">
          <div v-if="event.details.attendees.length !==0">
            <v-list>
              <v-subheader>예약자 명단</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th class="text-field" :rowspan="2">이름</th>
                        <th></th>
                        <th class="text-field" :rowspan="3">전화번호</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr
                          v-for="(attendee, index) in event.details.attendees"
                          :key="index"
                      >
                        <td>
                          <v-avatar color="red" :size="5"></v-avatar>
                          <span>{{ attendee.name }}</span>
                        </td>
                        <td></td>
                        <td>{{ attendee.mobile.substr(3, 1) }}XXX-XXXX</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <v-btn
                              icon
                              small
                              class="mx-2"
                              color="none"
                              @click="()=>onClickDeleteBtn(attendee)"
                          >
                            <v-icon v-text="deleteIcon"></v-icon>
                          </v-btn>
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <!--            <v-list-item-group>-->
            <!--              <v-list-item v-for="(attendee, index) in event.details.attendees" :key="index">-->
            <!--                <v-list-item-icon>-->
            <!--                  <v-avatar color="indigo" :size="29">-->
            <!--                    <span class="white&#45;&#45;text text-h9">{{ attendee.name.substring(0, 1) }}</span>-->
            <!--                  </v-avatar>-->
            <!--                </v-list-item-icon>-->
            <!--                <v-list-item-content>-->
            <!--                  <v-list-item-title v-text="attendee.name"></v-list-item-title>-->
            <!--                </v-list-item-content>-->
            <!--                <v-list-item-icon>-->
            <!--                  <v-icon v-text="deleteIcon"></v-icon>-->
            <!--                </v-list-item-icon>-->
            <!--              </v-list-item>-->
            <!--            </v-list-item-group>-->
          </div>
          <div v-else>
            <v-list>
              <v-subheader>예약자 명단</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <span class="grey--text font-italic text-h8">예약자가 없습니다</span>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-card>

      </v-card-text>
    </v-card>

    <div v-if="this.deleteModalOpen">
      <v-dialog
          v-model="this.deleteModalOpen"
          width="500"
          @click:outside="() => {this.deleteModalOpen = false}"
      >
        <v-card>
          <v-card-title class="text-h5 red white--text ">
            Privacy Policy
          </v-card-title>
          <v-card-text>
            예약 취소를 위해 핸드폰 번호 끝 4자리를 입력하세요
            <v-otp-input v-model="otp" length="4"></v-otp-input>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="red"
                dark
                @click="onSubmitCancelReservation"
            >
              예약 취소
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
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
      mobile: '',
      deleteIcon: 'mdi-delete-outline',
      deleteModalOpen: false,
      otp: '',
      selectedAttendee: null,
    });
  },
  computed: {
    getReservatingDate() {
      return dayjs(this.model.start).format('M월 DD일 HH시');
    }
  },
  methods: {
    async reserve() {

      await this.$store.dispatch('setSelectedOpen', false);

      this.event.details.attendees.push({name: this.name, mobile: this.mobile})

      const tokenData = await this.refreshAccessToken()

      try {

        await this.updateGogleCalendar(tokenData).then((_data, err) => {
          if (err) {
            this.$store.dispatch('setFailureSnackbarOpen', true);
            this.$store.dispatch('setSelectedOpen', false);

            setTimeout(() => {
              this.$store.dispatch('setFailureSnackbarOpen', false)
            }, 4000)
            return
          }

          this.$store.dispatch('setSuccessSnackbarOpen', true);
          this.$emit('submitSuccess')
          setTimeout(() => {
            this.$store.dispatch('setSuccessSnackbarOpen', false)
          }, 4000)
        });
      } catch (e) {
        console.log(e);
      }


    },
    onNameInput(value) {
      this.name = value
    },
    onMobileInput() {
    },
    onsomething(v) {
      console.log(v);
    },
    abc() {
      console.log('hi')
    },
    onClickDeleteBtn(attendee) {
      this.deleteModalOpen = true;

      this.selectedAttendee = attendee

    },
    async onSubmitCancelReservation() {
      console.log(this.otp)
      if (this.selectedAttendee.mobile.substr(7, 4) === this.otp) {

        this.event.details.attendees = this.event.details.attendees.filter((attendee) => {
          return !(attendee.name === this.selectedAttendee.name && attendee.mobile === this.selectedAttendee.mobile)
        })

        console.log(this)

        const tokenData = await this.refreshAccessToken()

        try {
          await this.updateGogleCalendar(tokenData).then((_data, err) => {
            if (err) {
              this.$store.dispatch('setFailureSnackbarOpen', true);
              this.$store.dispatch('setSelectedOpen', false);

              setTimeout(() => {
                this.$store.dispatch('setFailureSnackbarOpen', false)
              }, 4000)
              return
            }

            this.$store.dispatch('setSuccessSnackbarOpen', true);
            this.$emit('submitSuccess')
            setTimeout(() => {
              this.$store.dispatch('setSuccessSnackbarOpen', false)
            }, 4000)
          });
        } catch (e) {
          console.log(e);
        }

        this.deleteModalOpen = false;
      }
    }
  },
  async refreshAccessToken() {
    const refreshData = {
      client_id: staticField.clientId,
      client_secret: staticField.clientSecret,
      grant_type: staticField.grantType,
      refresh_token: staticField.refreshToken,
    }

    return axios.post('https://oauth2.googleapis.com/token', refreshData)
  },
  async updateGogleCalendar(tokenData) {
    const body = {
      summary: `민들레 (${this.event.details.attendees.length}/${this.event.details.maxCount})`,
      description: JSON.stringify(this.event.details)
    }
    const config = {
      headers: {
        Authorization: `Bearer ${tokenData.data.access_token}`
      }
    };

    const {calendarID, googleKey} = staticField;


    return axios.patch(`/api/googleapis/calendar/v3/calendars/${calendarID}/events/${this.model.id}?key=${googleKey}`, body, config).then((_data, error) => {
      if (error) {
        this.$store.dispatch('setFailureSnackbarOpen', true);
        this.$store.dispatch('setSelectedOpen', false);

        setTimeout(() => {
          this.$store.dispatch('setFailureSnackbarOpen', false)
        }, 4000)
        return
      }

      this.$store.dispatch('setSuccessSnackbarOpen', true);
      this.$emit('submitSuccess')
      setTimeout(() => {
        this.$store.dispatch('setSuccessSnackbarOpen', false)
      }, 4000)
    })
  }
}
</script>
