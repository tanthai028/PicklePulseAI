### **PicklePulse - Feature List (PWA Version)**

#### **Project Overview**

PicklePulse is a health and performance tracking app for athletes, correlating physical stats (heart rate, sleep, calories) with gameplay performance. It provides AI-driven insights to optimize training and recovery.

---

### **Tech Stack**

* **Framework**: Vite + React (TypeScript)
* **UI Library**: Chakra UI
* **Routing**: React Router
* **Backend/Auth**: Supabase (auth, storage, real-time)
* **Deployment**: Netlify
* **PWA Support**: vite-plugin-pwa

---

### **PWA Setup**

* Initialize Vite project with React + TypeScript template.
* Configure Supabase client for browser-based auth.
* Set up React Router for navigation and route protection.
* Integrate vite-plugin-pwa for offline caching and install prompt.
* Deploy via Netlify with auto CI/CD from GitHub.

---

### **Authentication Flow**

* Email/password or OAuth sign-in (Google/Apple).
* Guest mode for limited functionality.
* Session persistence using Supabase browser sessions.

---

### **Core Features**

#### **1. Daily Check-In Flow**

* Multi-step form (Hunger, fatigue, soreness) with quantified inputs.
* AI suggestion ("Should I play today?") based on health stats.
* Post-game rating (1-5) and notes for reflection.

#### **2. Health Stats Integration**

* Sync Apple Watch data (via manual entry or import workaround).
* Manual entry fallback for missing metrics.
* Graph view (daily/weekly trends) with performance correlation.

#### **3. Performance Analytics**

* AI-generated weekly summaries highlighting health-performance links.
* Sortable stats (e.g., "Peak days vs. low sleep").
* Exportable reports for progress tracking.

#### **4. Player & Team Tracking**

* Notes on opponents/teammates (strengths/weaknesses).
* Group chats and shared calendars for scheduling.
* Progress comparison (user vs. others).

#### **5. Profile Customization**

* Avatar, bio, and privacy settings.
* Toggle health data visibility for teams/groups.

#### **6. Offline Support**

* Cache check-in data and sync when online.
* Access recent stats without connection via service worker.

---

### **Mobile Web Considerations**

* Responsive layout for phones and tablets.
* Touch-friendly UI elements and spacing.
* Smooth transitions and adaptive layouts (e.g., stacked to grid view).

---

**Next Steps**

* Finalize MVP scope (Check-In + Health Stats).
* Build responsive Chakra UI layout.
* Set up Supabase integration and test auth flow.
* Integrate and test vite-plugin-pwa (offline + installable).
* Deploy early version to Netlify and share feedback loop.
