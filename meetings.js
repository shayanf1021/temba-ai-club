// ============================================================
// TEMBA AI Club — Meeting Data
// This is the ONLY file you need to edit to update the site.
//
// To add a meeting, copy one of the blocks below and change the
// values. Dates are "YYYY-MM-DD". Times are plain text.
// Resources are optional — leave the list empty [] if none yet.
// Add `cancelled: true` for an off-week (shows as a break, and
// the "Next Meeting" banner skips over it).
// ============================================================

const CLUB_INFO = {
  name: "TEMBA AI Club",
  tagline: "Business students exploring artificial intelligence together",
  // Default meeting time & room, shown in the header banner.
  meetingTime: "5:15–5:50 PM",
  meetingRoom: "RRH 5.402",
  meetingDay: "Every other Monday",
};

// Weekly AI news lives in news-source.md (mirrored from the
// "TEMBA AI Club Notes" Google Doc). After updating the doc,
// paste the new week into news-source.md and run:
//   node tools/build-news.js

const MEETINGS = [
  {
    date: "2026-03-09",
    topic: "Vibe Coding Intro",
    time: "5:15–5:50 PM",
    room: "RRH 3.406",
    description: "Intro to vibe coding at McCombs — building things with AI, fast.",
    resources: [
      { label: "Deck: McCombs Vibe Coding Intro", url: "https://docs.google.com/presentation/d/1xjWISC2UmjBv9gDjQNawq1vli8-LoUJyAFz8wBdBTBE/edit?usp=sharing" },
    ],
  },
  {
    date: "2026-04-20",
    topic: "Spring Session — 4/20",
    time: "5:15–5:50 PM",
    room: "RRH 3.406",
    description: "Spring meeting of the TEMBA AI Club.",
    resources: [
      { label: "Deck: TEMBA AI Club 4/20", url: "https://docs.google.com/presentation/d/1BRdYDh_QJz_24zAozqP7cs0HubREPVS7W83viKupkQY/edit?usp=sharing" },
    ],
  },
  {
    date: "2026-06-15",
    topic: "Summer Session — 6/15",
    time: "5:15–5:50 PM",
    room: "RRH 3.406",
    description: "Summer meeting of the TEMBA AI Club.",
    resources: [
      { label: "Deck: TEMBA AI Club 6/15", url: "https://docs.google.com/presentation/d/1MUJFT3XTtfB49l3iAnHI7SxZqraan1Nuw084cjXrfKg/edit?usp=sharing" },
    ],
  },
  {
    date: "2026-06-29",
    topic: "Guest Speaker: Prof. John Graff",
    time: "5:15–5:50 PM",
    room: "RRH 3.406",
    description: "Join us for a talk with Prof. John Graff.",
    speaker: "John Graff",
    bio: [
      "John Graff is an assistant professor of instruction in the McCombs School of Business at The University of Texas at Austin, where he leads MBA and undergraduate classes on business strategy. Graff has more than 25 years of senior management experience at a variety of technology companies, where he has been part of driving successful growth initiatives, IPOs, turnarounds, and acquisitions. He has a strong track record of building highly engaged teams, working across functional/organizational boundaries, and helping inspire a company culture that led to recognition as one of the Best Places to Work. Graff served as interim chief marketing officer for McCombs from December 2022 to May 2023.",
      "Before joining McCombs, Graff was the chief marketing officer at Sonim Technologies, a leading manufacturer of rugged mobile handsets used in mission-critical applications. He previously served as vice president of marketing for Austin-based startup Uhnder, which was coming out of stealth mode as it launched the industry’s first digital automotive radar, enabling enhanced automotive safety and autonomy capabilities. He also served as the chief revenue officer of Xplore Technologies, a leading supplier and authority in rugged mobility. After Zebra Technologies acquired Xplore Technologies in 2018, Graff became the vice president of sales and marketing, where he led the rugged tablet business and ensured the rapid integration of the former Xplore Technologies business. He also worked at National Instruments for 29 years in a variety of sales and marketing management roles. During his tenure at NI, the company delivered consistent growth and profitability as it grew from $13 million in revenue to over $1 billion.",
      "A science, technology, engineering, and math (STEM) evangelist, Graff serves on the Past Presidents’ Council of Thinkery (previously the Austin Children’s Museum).",
      "Graff earned a bachelor’s degree in electrical engineering from The University of Texas at Austin."
    ],
    resources: [],
  },
  {
    date: "2026-08-20",
    topic: "Academic Intensive Lunch & Learn",
    time: "12:00–1:00 PM",
    room: "TBD",
    description: "Academic Intensive Lunch & Learn session.",
    resources: [
      { label: "Deck: Academic Intensive Lunch & Learn", url: "https://docs.google.com/presentation/d/1XyD06D6jCUbBTNpUE_RDsU3vuZT3zmiXaPbzAq9yrKM/edit?usp=sharing" }
    ],
  },
  {
    date: "2026-09-14",
    topic: "Guest Speaker: Prof. Ben Bentzin",
    time: "5:15–5:50 PM",
    room: "RRH 5.402",
    description: "Join us for a talk with Prof. Ben Bentzin.",
    // Speaker bio. Shows as an expandable note on the next-meeting
    // card. Each string is its own paragraph.
    speaker: "Ben Bentzin",
    bio: [
      "Ben Bentzin is an associate professor of instruction in marketing at The University of Texas at Austin's McCombs School of Business. As a McCombs Teaching Fellow, Bentzin is focused on helping faculty integrate AI into the classroom. He is also a marketing practitioner, as the previous co-founder and chairman of Interactive Health Technologies LLC.",
      "In his previous 10-year career at Dell Inc., Bentzin had various responsibilities in marketing, product development, and e-commerce. His roles included heading marketing for Dell's consumer/small business division, product marketing for Dell Dimension and Latitude brand computers, and the development of business-to-business e-commerce.",
      "Bentzin has been appointed by the president of The University of Texas to be a faculty board member of the University Co-op nonprofit and is the immediate past president of the board of trustees of the Austin Symphony Orchestra. His past volunteer leadership includes chairman of the board for the Long Center for the Performing Arts, board president of the Travis County Center for Child Protection, campaign chairman for the United Way of the Capital Area, committee chair for Boy Scout Troop 990, and board positions with Ballet Austin and Austin public radio stations KUT/KUTX.",
      "He holds an MBA in marketing and strategic management from the Wharton School at the University of Pennsylvania and a B.S. in finance from Arizona State University.",
    ],
    resources: [],
  },
  {
    date: "2026-09-28",
    // TODO: swap in the real session title once it's set.
    topic: "Guest Speaker: Prof. Clint Tuttle",
    time: "5:15–5:50 PM",
    room: "RRH 5.402",
    description: "Join us for a talk with Prof. Clint Tuttle.",
    speaker: "Clint Tuttle",
    bio: [
      "Clint Tuttle is an associate professor of instruction in the Department of Information, Risk, and Operations Management at The University of Texas at Austin's McCombs School of Business. He has taught a number of traditional and online versions of core management information systems BBA classes, a Master of Science SQL programming boot camp, and data and information management classes for various M.S. programs.",
      "Tuttle has received the Harkins Award for Innovation and the Texas Excellence in Teaching Award and was honored by Texas Exes as one of the Texas 10 inspiring professors in 2017. He has also won the BBA Honor Roll for more than five semesters. He is passionate about teaching innovation and creating new courses that stress how far students can learn. He's proud to be a member of the Provost Teaching Fellows.",
      "Tuttle cares deeply about serving others at UT. For 12 years he taught the MIS 374 Capstone course that helped hundreds of clients with their IT project needs. He also built The Drivers Exercise, which is a framework that helps students think about their values before setting goals, and has administered it to more than 4,000 people. He recently took on the challenge of reviewing how MIS teaches web development and built an experimental full-stack elective for MIS students. He also has started to create an Excel Esports team for UT students to compete in a national collegiate challenge.",
      "Tuttle worked for nine years as an information technology consultant for Accenture, focusing on IT project management and delivering custom Oracle and SAP ERP implementations for the retail, high-tech, and health care industries.",
      "He holds a BBA in management information systems from Texas McCombs and an M.S. in MIS from the University of Arizona in Tucson.",
    ],
    resources: [],
  },
  {
    // Internal note: Dabeer from Stripe?
    date: "2026-10-12",
    topic: "Guest Speaker (TBA)",
    time: "5:15–5:50 PM",
    room: "RRH 5.402",
    description: "Speaker to be announced — stay tuned.",
    resources: [],
  },
  {
    date: "2026-10-26",
    topic: "Hackathon 👀",
    time: "5:15–5:50 PM",
    room: "RRH 5.402",
    description: "No speaker this week — just time to build. Bring your projects.",
    resources: [],
  },
  {
    // Internal note: Scott Wallace's boss?
    date: "2026-11-09",
    topic: "Guest Speaker (TBA)",
    time: "5:15–5:50 PM",
    room: "RRH 5.402",
    description: "Speaker to be announced — stay tuned.",
    resources: [],
  },
  {
    date: "2026-11-23",
    topic: "No Meeting — Thanksgiving Break",
    cancelled: true,
    time: "",
    room: "",
    description: "Off for the week of Thanksgiving. See you on Nov 30!",
    resources: [],
  },
  {
    date: "2026-11-30",
    topic: "Guest Speaker (TBA)",
    time: "5:15–5:50 PM",
    room: "RRH 5.402",
    description: "Speaker to be announced — stay tuned.",
    resources: [],
  },
];
