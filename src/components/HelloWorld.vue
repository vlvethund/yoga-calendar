<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>

          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <div class="flex-grow-1"></div>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="900">
        <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
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
        />
        <div v-if="selectedOpen">
          <v-dialog
              v-model="selectedOpen"
              max-width="600"
          >
            <form-sheet v-bind:event="selectedEvent"></form-sheet>
          </v-dialog>
        </div>

      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios';
import FormSheet from "./FormSheet";
import staticField from '../assets/static'

export default {
  name: 'HelloWorld',
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
    selectedOpen: false,
    events: [],
    dialog: false,
    dialogDate: false
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

      const {data} = await axios.get(`/api/googleapis/calendar/v3/calendars/${calendarID}/events?orderBy=startTime&singleEvents=true&timeMax=${maxTime}&timeMin=${minTime}&key=${googleKey}`)

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

        this.events.push({
          name: `(${details.attendees.length}/${details.maxCount})`,
          color: '#2196F3',
          start: new Date(start.dateTime),
          end: new Date(end.dateTime),
          timed: true,
          details,
          id
        });
      })

    },
    setDialogDate() {
    },
    viewDay({date}) {
      this.focus = date
      this.type = 'week'
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = this.today
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    editEvent(ev) {
      this.currentlyEditing = ev.id
    },
    async updateEvent() {
      // await db.collection('calEvent').doc(this.currentlyEditing).update({
      //   details: ev.details
      // })
      // this.selectedOpen = false,
      //     this.currentlyEditing = null
    },
    showEvent({nativeEvent, event}) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => this.selectedOpen = true, 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
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

      return new Date(`${year}-${month}-${day} ${hour}:${minute}`).toISOString();
    },
  }
}
</script>
