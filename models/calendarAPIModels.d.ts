/**
 * data models used in 'calendar api'
 * for non-custom interface, visited ref for detailed explaination:
 * https://developers.google.com/calendar/api/guides/overview
 */

interface Window {
  gapi: typeof gapi
}

interface CalendarAPIRes extends gapi.client.HttpRequestFulfilled<any>{
  result: CalendarAPIContent
}

interface CalendarAPIContent {
  kind: "calendar#events",
  etag: string,
  summary: string,
  description: string,
  updated: DateTimestr,
  timeZone: string,
  accessRole: string,
  defaultReminders: Array<
    {
      method: string,
      minutes: number
    }
  >,
  nextPageToken: string,
  nextSyncToken: string,
  items: Array<EventResource>
}

// custom type and interfaces
type DateStr = string; // The date, in the format "yyyy-mm-dd", if this is an all-day event.
type DateTimestr = string; //RFC3339 timestamp

interface APITime {
  date: DateStr,
  dateTime: DateTimestr,
  timeZone: string
}
interface EventResource {
  kind: "calendar#event",
  etag: string,
  id: string,
  status: string,
  htmlLink: string,
  created: DateTimestr,
  updated: DateTimestr,
  summary: string,
  description?: string,
  location?: string,
  colorId?: string,
  creator: {
    id?: string,
    email: string,
    displayName?: string,
    self?: boolean
  },
  organizer: {
    id?: string,
    email: string,
    displayName: string,
    self: boolean
  },
  start: TimeObj,
  end: TimeObj,
  endTimeUnspecified?: boolean,
  recurrence: Array<string>,
  recurringEventId?: string,
  originalStartTime?: TimeObj,
  transparency?: string,
  visibility?: string,
  iCalUID: string,
  sequence: number,
  attendees?: Array<
    {
      id: string,
      email: string,
      displayName: string,
      organizer: boolean,
      self: boolean,
      resource: boolean,
      optional: boolean,
      responseStatus: string,
      comment: string,
      additionalGuests: number
    }
  >,
  attendeesOmitted?: boolean,
  extendedProperties?: {
    private: {
      [key: string]: string
    },
    shared: {
      [key: string]: string
    }
  },
  hangoutLink?: string,
  conferenceData?: {
    createRequest: {
      requestId: string,
      conferenceSolutionKey: {
        type: string
      },
      status: {
        statusCode: string
      }
    },
    entryPoints: Array<
      {
        entryPointType: string,
        uri: string,
        label: string,
        pin: string,
        accessCode: string,
        meetingCode: string,
        passcode: string,
        password: string
      }
    >,
    conferenceSolution: {
      key: {
        type: string
      },
      name: string,
      iconUri: string
    },
    conferenceId: string,
    signature: string,
    notes: string,
  },
  gadget?: {
    type: string,
    title: string,
    link: string,
    iconLink: string,
    width: number,
    height: number,
    display: string,
    preferences: {
      [key: string]: string
    }
  },
  anyoneCanAddSelf?: boolean,
  guestsCanInviteOthers?: boolean,
  guestsCanModify?: boolean,
  guestsCanSeeOtherGuests?: boolean,
  privateCopy?: boolean,
  locked?: boolean,
  reminders: {
    useDefault: boolean,
    overrides?: Array<
      {
        method: string,
        minutes: number
      }
    >
  },
  source?: {
    url: string,
    title: string
  },
  attachments?: Array<
    {
      fileUrl: string,
      title: string,
      mimeType: string,
      iconLink: string,
      fileId: string
    }
  >,
  eventType: string
}



