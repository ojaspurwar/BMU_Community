# BMU_Community • CampusPulse OS

> **A Unified Real-Time Campus Operating System & Community Hub for BML Munjal University (BMU)**  
> *Consolidating Student Events, Peer Skill/Hardware Trade, Sports Arena Court Bookings, and Verified Academic Circulars into One Live Telemetry Grid.*

[![Test Run Mode](https://img.shields.io/badge/Test_Run-Active_Sandbox-amber?style=for-the-badge&logo=flask)](https://github.com/ojaspurwar/BMU_Community)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

---

## 🧪 Test Run / Prototype Environment Notice

> [!NOTE]
> **This repository is configured in Test Run / Demo Mode for project submission and evaluation.**
> - **Pre-Populated Mock Data:** Realistically seeded with BMU campus data (HackBMU 7.0 with ₹3L prize pool, Hostel Premier League matches, SOET hardware swaps, and CoE circulars).
> - **Test Website Popup & Label:** When launched, a test run disclaimer highlights the evaluation environment. A `🧪 Test Run` badge is permanently available in the navigation bar to reopen test guidance at any time.
> - **Multi-Student Personas:** Switch between verified accounts (*Aarav Sharma, Ananya Verma, Kabir Mehta, Priya Sundaram*) or create custom student identities.
> - **Real-Time Multi-Tab Synchronization:** Open two browser tabs side-by-side to witness real-time cross-tab sync (RSVPs, court bookings, marketplace saves, notice acknowledgements).

---

## 🌟 Executive Overview & Problem Statement

At **BML Munjal University**, student life is vibrant but fragmented across dozens of disconnected WhatsApp groups, lost email circulars, unstructured spreadsheets, and manual notices.

**BMU_Community (CampusPulse)** solves this by unifying four fundamental campus pillars into a single, cohesive, cyber-aesthetic real-time web platform:

```
                   ┌──────────────────────────────────────────┐
                   │          BMU_Community Platform          │
                   │        (Live Telemetry & Sync OS)        │
                   └────────────────────┬─────────────────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         ▼                              ▼                              ▼
┌──────────────────┐          ┌───────────────────┐          ┌───────────────────┐
│ 1. Events & Fest │          │ 2. Peer Skill &   │          │ 3. Sports & Arena │
│   Radar + QR Pass│          │    Gear Swap Hub  │          │    Court Booking  │
└──────────────────┘          └───────────────────┘          └───────────────────┘
                                        │
                                        ▼
                           ┌─────────────────────────┐
                           │ 4. Verified Circulars   │
                           │   (CoE, CDC, DSW Feeds) │
                           └─────────────────────────┘
```

---

## 🚀 Key Modules & Capabilities

### 1. 🎟️ Live Event & Fest Radar
- **Dynamic Scheduling:** HackBMU 7.0 countdown telemetry, Pro-Nites, GDSC AI workshops, and SOET hackathons.
- **1-Click RSVP Sync:** Live synchronized attendee counters across all browser windows.
- **Holographic QR Gate Pass:** Generates printable/saveable verified BMU check-in passes for turnstiles and auditorium entry.
- **Calendar Generator:** Instant `.ics` file generation compatible with Google Calendar, Apple Calendar, and Outlook.
- **Event Proposer:** Enables student clubs (ACM, Culrav, IEEE, Enactus) to propose campus workshops.

### 2. 🔄 Peer Skill & Gear Marketplace
- **Zero-Commission Student Trade:** Buy, sell, borrow, or swap dorm electronics, books, and workshop gear.
- **Dedicated Skill-Swap Matching:** Trade knowledge (e.g. *DSA & LeetCode prep ⇄ UI/UX Figma Design*).
- **BMU Course Hardware:** Direct listings for Arduino/ESP32 kits, sensor packs, and SOET lab equipment.
- **Simulated Chat Drawer:** In-app negotiation interface with preset campus pickup locations (Library Ground Floor, H1 Foyer, Café Nook).

### 3. 🏆 Sports & Arena Matrix
- **Real-Time Court Booking:** Live reservation system for Badminton, Cricket Nets, Football Turf, and Table Tennis courts.
- **Live Match Scoreboard:** Cheer for hostel teams (H1 Warriors vs. H3 Titans) with synchronized cheering counters.
- **Squad Pickup Challenges:** Post open challenges when short on players (e.g. *"Need 2 players for 5v5 Turf Football at 7:30 PM"*).

### 4. 📢 Verified Campus Circular Stream
- **Official Seals:** Verified cryptographic seals from Controller of Examinations (CoE), Career Development Centre (CDC), and Dean of Student Welfare (DSW).
- **Priority Escalation:** Color-coded priority tags (Urgent Red, Important Amber, General Blue).
- **Target Batch Filtering:** Instant filtering for B.Tech, MBA, Law, and School of Management.
- **Interactive Acknowledgement:** Track unread circulars and acknowledge circulars with 1-click feedback.

### 5. 🛡️ Campus Safety & Focus Tools
- **24/7 SOS Helpline:** Instant quick-dial triggers for Campus Ambulance, Gate 1 Security, Hostel Wardens, and Student Counseling.
- **Focus Soundscape Player:** Ambient lofi, café, and study tracks with built-in volume mixer.
- **Interactive Campus Map & Telemetry:** Zone status, weather indicators, and AQI monitoring for Sidhrawali campus.

---

## 🛠️ Tech Stack & Architecture

| Category | Technology |
|---|---|
| **Repository Name** | `BMU_Community` |
| **Frontend** | React 19, TypeScript |
| **Styling & Theme** | Tailwind CSS (BMU Cyber Tri-color Palette: Emerald `#10b981`, Crimson `#ef4444`, Sapphire `#3b82f6`, Deep Slate `#06090e`) |
| **Icons & Micro-Interactions** | Lucide React, Canvas-Confetti |
| **Real-time Sync** | React Context + `BroadcastChannel` API (`campuspulse_bmu_sync`) + LocalStorage fallback |
| **Build & Dev Server** | Custom zero-bundle Node server (`server.cjs`) powered by Sucrase + PostCSS + Tailwind |

---

## 👥 Demo Student Profiles

The test run includes preloaded student personas for evaluation:

| Student Name | Roll Number | Department | Hostel | Specialization / Role |
|---|---|---|---|---|
| **Aarav Sharma** | `220101048` | B.Tech CSE (3rd Year) | Hostel 1 (Boys) | ACM Tech Lead, Full-Stack Dev |
| **Ananya Verma** | `230102015` | B.Tech ECE (2nd Year) | Hostel 2 (Girls) | Robotics Core & IoT Specialist |
| **Kabir Mehta** | `240201009` | School of Management (MBA) | Hostel 3 (Boys) | Enactus Secretary & FinTech |
| **Priya Sundaram** | `210101002` | B.Tech CSE (4th Year) | Hostel 6 (Girls) | HackBMU Champion & AI Researcher |

*You can also click **"Create / Edit My Profile"** to create a custom student ID card!*

---

## 🚦 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (bundled with Node.js)

### Installation & Execution

```bash
# 1. Clone the repository
git clone https://github.com/ojaspurwar/BMU_Community.git

# 2. Navigate to the project directory
cd BMU_Community

# 3. Install dependencies
npm install

# 4. Launch the development server
npm run dev
```

The application will start immediately at:
👉 **`http://localhost:4040`**

### Testing Multi-Tab Live Synchronization
1. Open `http://localhost:4040` in **Tab A**.
2. Open `http://localhost:4040` in **Tab B** (or in an incognito window).
3. RSVP to an event or book a court slot in Tab A — watch Tab B update **instantly in real time**!

---

## 📂 Project Structure

```
BMU_Community/
├── index.html                   # Entry HTML shell & dark theme bootstrapper
├── package.json                 # Package metadata, scripts & dependencies
├── server.cjs                   # Fast local development server with ESM transformation
├── build-app.cjs                # Production CSS & asset compilation script
├── tailwind.config.cjs          # Custom BMU tri-color palette tokens
├── tsconfig.json                # TypeScript compiler configuration
├── .gitignore                   # Clean repository exclusions
├── README.md                    # Project documentation & test guide
├── public/                      # Compiled CSS & static assets
│   └── globals.css
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── app/
    │   ├── globals.css          # Core CSS variables & utility classes
    │   ├── layout.tsx           # Application layout wrapper
    │   └── page.tsx             # Master dashboard with telemetry header
    ├── components/
    │   ├── Navbar.tsx           # Top navigation bar with test badge & profile switcher
    │   ├── TestRunModal.tsx     # Test website notice & evaluation guide
    │   ├── EventModule.tsx      # HackBMU timetable, RSVPs, and ticket pass
    │   ├── EventPassModal.tsx   # Verified holographic QR gate pass modal
    │   ├── MarketplaceModule.tsx# Peer goods & skill exchange engine
    │   ├── MarketplaceChatDrawer.tsx # Simulated negotiation chat drawer
    │   ├── SportsModule.tsx     # Turf booking & match cheer grid
    │   ├── NoticeStreamModule.tsx # Verified circular stream & acknowledgements
    │   ├── NoticeDetailModal.tsx# Circular viewer & PDF attachments
    │   ├── ProfileModal.tsx     # Student ID card generator & editor
    │   ├── EmergencyQuickDial.tsx # 24/7 SOS helpline modal
    │   ├── GlobalSearchModal.tsx# ⌘K instant search engine
    │   ├── StudyRadarModule.tsx # Campus zone telemetry & noise radar
    │   └── StudyPodDrawer.tsx   # Ad-hoc Pomodoro study pods
    ├── data/
    │   └── mockData.ts          # Seed data for BMU campus entities
    ├── lib/
    │   ├── store.tsx            # Global state provider & BroadcastChannel sync
    │   └── utils.ts             # Date formatters & helper utilities
    └── types/
        └── index.ts             # TypeScript interface definitions
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Developed with ❤️ for the **BML Munjal University** student community.
