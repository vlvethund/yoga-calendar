<template>
  <div>
    <v-card>
      <v-card-title>
        예약 정보
        [ {{ reservatingDate }} ]
      </v-card-title>
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
                    color="#FEA401"
                    prepend-icon="mdi-account-circle"
                    :value="this.$data.name"
                    @input="onNameInput"
                    :rules="this.rulesName"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10">
                <v-text-field
                    label="전화번호"
                    color="#FEA401"
                    prepend-icon="mdi-phone"
                    :value="mobile"
                    @input="onMobileInput"
                    @keydown="onsomething"
                    :rules="this.rulesMobile"
                    type="number"
                    pattern="\d*"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-card-actions>
                <v-btn @click="reserve" color="#FFD600" :disabled="this.reserveButtonDisabled">예약하기🧘‍♀️</v-btn>
              </v-card-actions>
            </v-row>
          </v-container>
        </v-card>
        <v-spacer></v-spacer>
        <v-card min-height="200">
          <div v-if="event.details.attendees.length !==0">
            <v-list>
              <v-subheader>예약자 명단 ({{ event.details.attendees.length }}/{{ event.details.maxCount }})</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th class="text-field">이름</th>
                        <th class="text-field">전화번호</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr
                          v-for="(attendee, index) in event.details.attendees"
                          :key="index"
                      >
                        <td>
                          <v-avatar :color="randomColors[index]" :size="5"></v-avatar>
                          <span>{{ attendee.name }}</span>
                        </td>
                        <td>
                          <v-row justify="space-around">
                            {{ attendee.mobile.substr(3, 1) }}XXX-XXXX
                            <v-btn
                                icon
                                small
                                class="mx-2"
                                color="none"
                                @click="()=>onClickDeleteBtn(attendee)"
                            >
                              <v-icon v-text="deleteIcon"></v-icon>
                            </v-btn>
                          </v-row>

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
              <v-subheader>예약자 명단 ({{ event.details.attendees.length }}/{{ event.details.maxCount }})</v-subheader>
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
          @keydown="onDeleteModalKeyDown"
      >
        <v-card>
          <v-card-title class="text-h5 ">
            예약취소
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col md="6">
                <v-otp-input v-model="otp" length="4" type="number" pattern="\d*"></v-otp-input>
              </v-col>
            </v-row>
            예약 취소를 위해 핸드폰 번호 끝 4자리를 입력하세요
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
    <div v-if="this.dialogOpen">
      <v-dialog
          width="500"
          v-model="this.dialogOpen"
          @click:outside="() => {this.dialogOpen = false}"
          @keydown="onDialogKeyDown"
      >
        <alert
            :msg="this.dialogMsg"
            :ok-msg="this.okMsg"
            @clickDialogOk="clickDialogOk"
        />
      </v-dialog>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import axios from 'axios'
import _ from 'lodash'
import staticField from '../assets/static'
import Alert from "./Dialogs/Alert"
import Util from '../assets/util'

const numberPattern = /^[0-9]*$/
const mobilePattern = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;

export default {
  name: 'form-sheet',
  components: {Alert},
  props: {
    event: {
      type: Object,
      required: true
    },
    onSucess: {
      type: Function,
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
      dialogOpen: false,
      dialogMsg: '',
      rulesMobile: [
        value => !!value || '핸드폰 번호를 꼭 입력하셔야돼요',
        value => (value || '').length < 12 || '11자리만 입력해주세요!!',
        value => {
          return numberPattern.test(value) || '숫자만 입력해주세요!!'
        }
      ],
      rulesName: [
        value => !!value || '이름을 알려주세요..'
      ],
      reserveButtonDisabled: true,
      okMsg: ''
    });
  },
  computed: {
    reservatingDate() {
      return dayjs(this.model.start).format('M월 DD일 HH시');
    },
    randomColors() {
      return Util.shuffleArray(staticField.colors)
    }

  },
  methods: {
    async reserve() {

      const {attendees, maxCount} = this.event.details;

      if (attendees.length >= maxCount) {
        this.dialogOpen = true;
        this.dialogMsg = '죄송해요 정원이 가득 찼습니다'
        this.okMsg = '어쩔 수 없죠😥'
        return;
      }

      const index = _.findIndex(attendees, (attendee) => attendee.name === this.name && attendee.mobile === this.mobile);
      if (index >= 0) {
        this.dialogOpen = true;
        this.dialogMsg = '이미 등록하셨는데요?'
        this.okMsg = '알겠습니다😅'
        return;
      }

      await this.$store.dispatch('setSelectedOpen', false);

      this.event.details.attendees.push({name: this.name, mobile: this.mobile})

      const refreshData = {
        client_id: staticField.clientId,
        client_secret: staticField.clientSecret,
        grant_type: staticField.grantType,
        refresh_token: staticField.refreshToken,
      }


      const tokenData = await axios.post('https://oauth2.googleapis.com/token', refreshData)

      const body = {
        summary: `민들레 (${this.event.details.attendees.length}/${this.event.details.maxCount})`,
        description: JSON.stringify(this.event.details)
      }
      const config = {
        headers: {
          Authorization: `Bearer ${tokenData.data.access_token}`
        }
      }

      const {calendarID, googleKey} = staticField;
      try {
        await axios.patch(`${process.env.VUE_APP_GOOGLE_API}/calendar/v3/calendars/${calendarID}/events/${this.model.id}?key=${googleKey}`, body, config).then((_data, error) => {
          if (error) {
            this.$store.dispatch('setFailureMessage', '예약에 실패했습니다. 관리자에게 문의해주세요👾')
            this.$store.dispatch('setFailureSnackbarOpen', true);
            this.$store.dispatch('setSelectedOpen', false);

            setTimeout(() => {
              this.$store.dispatch('setFailureSnackbarOpen', false)
            }, 4000)
            return
          }
          this.$store.dispatch('setSuccessMessage', '예약 성공🥰 🤸‍♀️🙏🎈👨‍🎤🎉😺♥🧎‍♀️🧎‍♂️')
          this.$store.dispatch('setSuccessSnackbarOpen', true);
          setTimeout(() => {
            this.$store.dispatch('setSuccessSnackbarOpen', false)
          }, 4000)
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.onSucess();
      }
    },
    onNameInput(value) {
      this.name = value
      this.activateReserveButton()
    },
    onMobileInput(value) {
      this.mobile = value
      this.activateReserveButton()
    },
    onsomething() {
    },
    onClickDeleteBtn(attendee) {
      this.deleteModalOpen = true;

      this.selectedAttendee = attendee

    },
    async onSubmitCancelReservation() {

      await this.$store.dispatch('setSelectedOpen', false);

      if (this.selectedAttendee.mobile.substr(this.selectedAttendee.mobile.length - 4, 4) === this.otp) {

        this.event.details.attendees = this.event.details.attendees.filter((attendee) => {
          return !(attendee.name === this.selectedAttendee.name && attendee.mobile === this.selectedAttendee.mobile)
        })


        const refreshData = {
          client_id: staticField.clientId,
          client_secret: staticField.clientSecret,
          grant_type: staticField.grantType,
          refresh_token: staticField.refreshToken,
        }


        const tokenData = await axios.post('https://oauth2.googleapis.com/token', refreshData)

        const body = {
          summary: `민들레 (${this.event.details.attendees.length}/${this.event.details.maxCount})`,
          description: JSON.stringify(this.event.details)
        }
        const config = {
          headers: {
            Authorization: `Bearer ${tokenData.data.access_token}`
          }
        }

        const {calendarID, googleKey} = staticField;
        try {
          await axios.patch(`${process.env.VUE_APP_GOOGLE_API}/calendar/v3/calendars/${calendarID}/events/${this.model.id}?key=${googleKey}`, body, config).then((_data, error) => {
            if (error) {
              this.$store.dispatch('setFailureMessage', '예약취소에 실패했어요. 관리자에게 문의해주세요👾')
              this.$store.dispatch('setFailureSnackbarOpen', true);
              this.$store.dispatch('setSelectedOpen', false);

              setTimeout(() => {
                this.$store.dispatch('setFailureSnackbarOpen', false)
              }, 4000)
              return
            }

            this.$store.dispatch('setSuccessMessage', '예약을 취소했습니다👋')
            this.$store.dispatch('setSuccessSnackbarOpen', true);
            this.$emit('success')
            this.$emit('test');
            setTimeout(() => {
              this.$store.dispatch('setSuccessSnackbarOpen', false)
            }, 4000)
          })


        } catch (e) {
          console.log(e)

        } finally {
          this.onSucess();
        }

        this.deleteModalOpen = false;
      } else {
        await this.$store.dispatch('setFailureMessage', '잘못 입력하셨어요 👅')
        await this.$store.dispatch('setFailureSnackbarOpen', true);

        setTimeout(() => {
          this.$store.dispatch('setFailureSnackbarOpen', false)
        }, 4000)
      }

    },
    clickDialogOk() {
      this.dialogOpen = false;
    },
    activateReserveButton() {
      if (numberPattern.test(this.mobile) && this.mobile && mobilePattern.test(this.mobile) && this.name && (this.mobile || '').length < 12) {
        this.reserveButtonDisabled = false;
      } else {
        this.reserveButtonDisabled = true;
      }
    },
    onDeleteModalKeyDown(e) {
      Util.keyDownEventHandler(e, () => this.deleteModalOpen = false);
    },
    onDialogKeyDown(e) {
      Util.keyDownEventHandler(e, () => this.dialogOpen = false);
    },
  }
}
</script>

<style scoped>
.v-avatar {
  margin-right: 10px;
}

</style>
