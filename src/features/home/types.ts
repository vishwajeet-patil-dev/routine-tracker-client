export type Segment = {
  title: string;
  start: number;
  end: number;
  days: number[];
  _id?: string;
};

export type CurrentSegment = Segment & {
  totalMins: number;
  completeMins: number;
  pendingMins: number;
  percentage: number;
};

// const sessions: Segment[] = [
//   { title: "Wake", start: 360, end: 370 },
//   { title: "Workout / DSA-coding", start: 370, end: 450 },
//   { title: "Get ready", start: 450, end: 500 },
//   { title: "Commute", start: 500, end: 540 },
//   { title: "Office focus block", start: 540, end: 1050 },
//   { title: "Commute home", start: 1050, end: 1080 },
//   { title: "Freshen up, decompress", start: 1080, end: 1110 },
//   { title: "Dinner", start: 1110, end: 1155 },
//   { title: "Deep work — DSA/interview prep", start: 1155, end: 1230 },
//   { title: "Free time", start: 1230, end: 1275 },
//   { title: "Project work", start: 1275, end: 1335 },
//   { title: "Reading", start: 1335, end: 1365 },
//   { title: "Wind down", start: 1365, end: 1380 },
// ];

export type Todo = {
  segmentId?: string;
  title: string;
  isCompleted: boolean;
  scheduledOn?: Date;
};
