<template>
  <div>
    <v-container>
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat color="white" dense>
              <v-btn fab text small @click="prev">
                <v-icon dense>mdi-chevron-left</v-icon>
              </v-btn>
              <v-toolbar-title>{{ title }}</v-toolbar-title>
              <v-btn fab text small @click="next">
                <v-icon dense>mdi-chevron-right</v-icon>
              </v-btn>
              <div class="flex-grow-1"></div>
              <v-btn-toggle v-model="toggleExclusive" dense mandatory borderless>
                <v-btn @click="onClickToggleMonth" small>
                  <v-icon small>mdi-calendar-month</v-icon>
                  <!--                  📅-->
                </v-btn>

                <v-btn @click="onClickToggleWeek" small>
                  <v-icon small>mdi-view-week-outline</v-icon>
                  <!--                  📄-->
                </v-btn>
              </v-btn-toggle>

            </v-toolbar>
          </v-sheet>
          <v-sheet height="90vh">
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
                @change="updateRange"
                locale="ko"
                :weekdays="[1,2,3,4,5]"
                :show-month-on-first="false"
                :light="true"
                :day-format="dayFormat"
                :interval-format="intervalFormat"
            >
              <template v-slot:event="{ event }">
                <div class="v-event-summary" v-html="displayEvent(event)"></div>
              </template>
            </v-calendar>
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
import dayjs from 'dayjs'
import Util from '../assets/util'

export default {
  name: 'calendar-main',
  components: {
    FormSheet,
  },
  mounted() {
    setInterval(() => this.getEvents(), 5000);
  },
  data: () => ({
    today: new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60 * 1000) + 9*60*60*1000).toISOString().substr(0, 10),
    focus: new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60 * 1000) + 9*60*60*1000).toISOString().substr(0, 10),
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
      const startMonth = Number.parseInt(this.monthFormatter(start))
      const endMonth = Number.parseInt(this.monthFormatter(end))
      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : startYear + '.'
      const prefixYear = startYear === endYear ? '' : endYear + '.'
      const startDay = start.day
      const endDay = end.day

      switch (this.type) {
        case 'month':
          return `${startYear}. ${startMonth}.`
        case 'week':
          return `${suffixYear} ${startMonth}. ${startDay} - ${prefixYear} ${endMonth}. ${endDay} `
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
      const calendarID = staticField.calendarID
      const minTime = dayjs(`${this.start.date} ${this.start.hour}:${this.start.minute}`).subtract(1,'M').startOf('month').startOf('week').toDate().toISOString()
      const maxTime = dayjs(`${this.start.date} ${this.start.hour}:${this.start.minute}`).add(1, 'M').endOf('month').startOf('week').toDate().toISOString()
      const googleKey = staticField.googleKey

      const {data} = await axios.get(`${process.env.VUE_APP_GOOGLE_API}/calendar/v3/calendars/${calendarID}/events?orderBy=startTime&singleEvents=true&timeMax=${maxTime}&timeMin=${minTime}&key=${googleKey}&fields=items(id,summary,description,start,end)`)
      data.items.map(({description, start, end, id}) => {
        let details;
        let defaultMaxCount = 4;
        const defaultDescription = `{"attendees": [],"maxCount": ${defaultMaxCount}}`;
        details = JSON.parse(defaultDescription);

        if (description) {
          if (Number.parseInt(description)) {
            details.maxCount = Number.parseInt(description);
          } else {
            details = JSON.parse(description);
          }
        }

        const eventName = `(${details.attendees.length}/${details.maxCount})`

        const hourForColor = new Date(start.dateTime).getHours();
        if (!this.events.some(event => event.id === id)) {

          this.events.push({
            name: eventName,
            color: staticField.colors[hourForColor - 9],
            start: new Date(start.dateTime),
            end: new Date(end.dateTime),
            timed: true,
            details,
            id,
          });
        }
        else {
          this.events.filter(event => event.id === id).map(event => {
            event.details = details
            event.name = eventName
          })
        }
      })
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
    clickOutside() {
      this.$store.dispatch('setSelectedOpen', false)
    },
    onClickToggleMonth() {
      this.toggleExclusive = 0
      this.type = 'month';
    },
    onClickToggleWeek() {
      this.type = 'week'
      this.toggleExclusive = 1;
    },
    onKeyDown(e) {
      Util.keyDownEventHandler(e, () => this.$store.dispatch('setSelectedOpen', false));
    },
    dayFormat(format) {
      let dayFormat = format.day
      if (format.day === 1) {
        dayFormat = `${format.month}.${format.day}`
      }
      return dayFormat;
    },
    intervalFormat(format) {
      return format.time;
    },
    displayEvent(event) {
      const time = `${dayjs(event.start).format('HH:mm')}`
      const quota = `${event.details.attendees.length}/${event.details.maxCount}`
      return this.type === 'month' ? `<div style="display: inline-block;">${time}</div> <div style="display: inline-block; overflow: no-display">(${quota})</div>` :
          `<div>${time}</div> <div>(${quota})</div>`
    }
  }
}
</script>

<style>
.v-event-summary {
  padding-left: 3px;
}
</style>
