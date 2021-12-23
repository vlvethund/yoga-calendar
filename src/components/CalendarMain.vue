<template>
  <div>
    <v-container>
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat color="white">
              <v-btn fab text small @click="prev">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-toolbar-title>{{ title }}</v-toolbar-title>
              <v-btn fab text small @click="next">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
              <div class="flex-grow-1"></div>
              <v-btn-toggle v-model="toggleExclusive" dense mandatory borderless>
                <v-btn @click="onClickToggleMonth">
                                    <v-icon >mdi-calendar-month</v-icon>
<!--                  📅-->
                </v-btn>

                <v-btn @click="onClickToggleWeek">
                                    <v-icon >mdi-view-week-outline</v-icon>
<!--                  📄-->
                </v-btn>
              </v-btn-toggle>

            </v-toolbar>
          </v-sheet>
          <v-sheet height="80vh">
            <v-calendar
                ref="calendar"
                v-model="focus"
                :events="events"
                :event-color="getEventColor"
                :event-margin-bottom="3"
                :now="today"
                :type="type"
                @click:event="showEvent"
                @click:more="viewDay"
                @click:date="setDialogDate"
                @change="updateRange"
                locale="ko"
                :weekdays="[1,2,3,4,5]"
            />
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <div v-if="this.$store.state.selectedOpen">
      <v-dialog
          :value="this.$store.state.selectedOpen"
          @click:outside="clickOutside"
          @keydown="onKeyDown"
          max-width="600"
      >
        <FormSheet v-bind:event="selectedEvent" :onSucess="getEvents"></FormSheet>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import staticField from '../assets/static'
import FormSheet from './FormSheet';
import Util from '../assets/util'

export default {
  name: 'calendar-main',
  components: {
    FormSheet,
  },
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
    },
    name: null,
    details: null,
    start: null,
    end: null,
    color: '#1976D2', // default event color
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    events: [],
    dialog: false,
    dialogDate: false,
    toggleExclusive: 0
  }),
  computed: {
    title() {
      const {start, end} = this
      if (!start || !end) {
        return ''
      }
      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth
      const startYear = start.year
      const endYear = end.year
      const prefixYear = startYear === endYear ? '' : endYear + '년'
      const startDay = start.day + '일'
      const endDay = end.day + '일'

      switch (this.type) {
        case 'month':
          return `${startYear}년 ${startMonth}`
        case 'week':
          return `${startYear}년 ${startMonth} ${startDay} - ${prefixYear} ${suffixMonth} ${endDay} `
      }
      return ''
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long',
      })
    },
  },
  methods: {
    async getEvents() {
      this.events = [];
      const calendarID = staticField.calendarID
      const minTime = this.toISOString(this.start)
      const maxTime = this.toISOString(this.end)
      const googleKey = staticField.googleKey
      console.log(minTime);
      console.log(maxTime);

      const {data} = await axios.get(`${process.env.VUE_APP_GOOGLE_API}/calendar/v3/calendars/${calendarID}/events?orderBy=startTime&singleEvents=true&timeMax=${maxTime}&timeMin=${minTime}&key=${googleKey}`)
      console.log(data.items);

      data.items.map(({description, start, end, id}) => {
        let details;
        let defaultMaxCount = 3;
        const defaultDescription = `{"attendees": [],"maxCount": ${defaultMaxCount}}`;
        details = JSON.parse(defaultDescription)

        if (description) {
          if (Number.parseInt(description)) {
            details.maxCount = Number.parseInt(description);
          } else {
            details = JSON.parse(description);
          }
        }

        const hourForColor = new Date(start.dateTime).getHours()
        this.events.push({
          name: `(${details.attendees.length}/${details.maxCount})`,
          color: staticField.colors[hourForColor - 9],
          start: new Date(start.dateTime),
          end: new Date(end.dateTime),
          timed: true,
          details,
          id,
        });
      })
    },
    setDialogDate() {
      this.type = 'week'
      this.toggleExclusive = 1;
    },
    viewDay({date}) {
      this.focus = date
      this.type = 'week'
      this.toggleExclusive = 1;
    },
    getEventColor(event) {
      return event.color
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({nativeEvent, event}) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => this.$store.dispatch('setSelectedOpen', true), 10)
      };

      if (this.selectedOpen) {
        this.$store.dispatch('setSelectedOpen', false)
        setTimeout(open, 10)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    updateRange({start, end}) {
      this.start = start
      this.end = end
      this.getEvents();
    },
    toISOString(date) {
      const {year, month, day, hour, minute} = date
      console.log(date)
      return new Date(year, month-1, day, hour, minute).toISOString();
    },
    clickOutside() {
      this.$store.dispatch('setSelectedOpen', false)
    },
    onClickToggleMonth() {
      this.toggleExclusive = 0
      this.type = 'month';
    },
    onClickToggleWeek() {
      this.toggleExclusive = 1
      this.type = 'week';
    },
    onKeyDown(e) {
      Util.keyDownEventHandler(e, () => this.$store.dispatch('setSelectedOpen', false));
    },
  }
}
</script>
