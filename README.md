# CampusPulse • BML Munjal University Operating System (BMU OS)

> A unified, real-time campus operating system for student events & fests, peer skill & hardware trading, live study spot radar, and verified university announcements.

---

## 🌟 Executive Overview & Hackathon Scope

**CampusPulse** solves the fragmented campus communication and collaboration experience across BML Munjal University (BMU). Instead of scattered WhatsApp groups, lost email circulars, and unstructured peer inquiries, CampusPulse consolidates four core real-time pillars into a cohesive, responsive web platform:

```
                 ┌───────────────────────────────────────┐
                 │        CampusPulse Dashboard         │
                 └───────────────────┬───────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│ Real-Time Events  │       │ Peer Skill & Gear │       │ Ad-Hoc Study Spot │
│  & Fest Timetable │       │    Marketplace    │       │   Finder & Chat   │
└───────────────────┘       └───────────────────┘       └───────────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────┐
                        │ Verified Notice Stream  │
                        │ (DSW, CoE, CDC Signed)  │
                        └─────────────────────────┘
```

---

## 🚀 Key Modules Built

### 1. Live Event & Fest Timetable
- **Dynamic Scheduling:** HackBMU 7.0 (36-hr flagship), 67th Milestone Pro-Nites, GDSC AI Workshops, Box Cricket Tournaments, and SOET Executive Masterclasses.
- **Category & Date Filters:** Instant classification (`Coding`, `Cultural`, `Workshops`, `Sports`, `Academic`, `Fest`).
- **Live RSVP Sync:** Instant 1-click RSVP with real-time attendee counter updates synchronized across connected client tabs.
- **Digital QR Gate Pass:** Generates verified BMU check-in passes for turnstiles and auditorium doors with print/save support.
- **Calendar Integration:** Instant `.ics` calendar generator compatible with Google Calendar, Apple Calendar, and Outlook.
- **Host / Propose Modal:** Allows student clubs (ACM, IEEE, Culrav, GDSC) to publish upcoming workshops with venue allocation.

### 2. Campus Peer Marketplace & Skill Trade
- **Zero-Fee Peer Economy:** Eliminates middleman markups for textbooks, lab supplies, and dorm appliances.
- **🔄 Dedicated Skill Swap Engine:** Matches students trading skills (e.g. *Advanced DSA & LeetCode prep ⇄ UI/UX Figma Design*, *Calculus III ⇄ Python Web Scraping*).
- **BMU Course Hardware:** Listings for ESP32/Arduino microcontroller kits, sensor shields, and workshop boiler suits used in SOET labs.
- **In-App Peer Chat Drawer:** Real-time simulated negotiation drawer with quick prompts (`"Meet at Library Ground Floor?"`, `"Is price negotiable?"`).
- **Hostel Pickups:** Displays seller's hostel block (H1, H2, H3, H4, Tower A, Tower B, Tower C) and room numbers for safe campus handoffs.

### 3. Live Campus Study Group & Room Radar
- **Crowdsourced Telemetry Grid:** Live monitoring across 6 key BMU study zones:
  - *Library Level 2 (Silent Sanctum)*
  - *Library Level 1 (Collaborative Discussion Pods)*
  - *Academic Block 2 Courtyard Pods*
  - *Student Activity Centre (Cafeteria Nook & Lounge)*
  - *Workshop Building Innovation Pod 304*
  - *Radhakrishnan Hostel (H2) Study Lounge*
- **Real-Time Sensor Indicators:** Noise Level (Silent, Low, Moderate, Lively), Power Outlets (Plentiful, Moderate, Scarce), Wi-Fi Speed (Mbps), Climate (Optimal, Chilled, Warm), and Occupancy %.
- **1-Click Telemetry Reporting:** Enables any student to update live zone conditions with preset chips.
- **Instant Ad-Hoc Study Pods:** 1-click feature to spin up temporary peer study rooms with:
  - Synchronized **25-Minute Pomodoro Focus Timer** (Start / Pause / Reset).
  - Built-in live group chat with peer participant roster.
  - One-click shareable pod invitation link.

### 4. Verified Campus Notice Stream
- **Actionable Circular Streams:** Filters spam into verified channels (`Exams & Academic`, `Placement & Internships`, `Club Recruitment`, `Hostel & Mess`, `Administrative & Shuttles`).
- **Cryptographic Authority Seals:** Official badges from the *Office of the Controller of Examinations (CoE)*, *Career Development Centre (CDC)*, *Dean of Student Welfare (DSW)*, and *Hostel Warden Office*.
- **Priority Escalation:** Urgent Red Alerts (Exam timetables, placement deadlines), Important Amber warnings, and General Blue updates.
- **Actionable Attachments:** PDF syllabus/datesheet downloads and single-click *Acknowledge / Mark as Read* counters.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19, TypeScript |
| **Styling & Design System** | Tailwind CSS with custom BMU Deep Navy (`#0B192C`) & Amber-Orange (`#FF6500`) theme tokens |
| **Iconography & Polish** | Lucide Icons, Canvas Confetti particle engine |
| **State & Real-Time Sync** | React Context + `BroadcastChannel` (`campuspulse_bmu_sync`) + LocalStorage persistence for true multi-tab real-time sync |
| **Search Engine** | Global modal index search (Ctrl/Cmd + K shortcut) across events, items, pods, and circulars |
| **Campus Safety** | Integrated 24/7 SOS Quick Dial (Campus Ambulance, Gate 1 Security, Warden, Counseling) |

---

## 👥 Multi-Student Profile Switcher (Demo Mode)

To experience real-time peer interactions, RSVPs, and marketplace listings, click the profile avatar in the top navigation bar to switch between verified student accounts:
1. **Aarav Sharma** – 3rd Year B.Tech CSE (Radhakrishnan Hostel H2, ACM Tech Lead)
2. **Ananya Verma** – 2nd Year B.Tech ECE (Tower C Girls Hostel, Robotics Core)
3. **Kabir Mehta** – 1st Year MBA (Tower A Boys Hostel, Enactus Secretary)
4. **Priya Sundaram** – 4th Year B.Tech AI & Data Science (Tower D, HackBMU Winner)

---

## 🚦 How to Run Locally

```bash
# 1. Clone or navigate to the workspace
cd "Project_Test2"

# 2. Start the local server
npm run dev

# 3. Open in your browser
http://localhost:4040
```

Open two browser tabs side-by-side to observe **instant real-time RSVP updates, marketplace listings, and study pod sync** across both windows!
