# Welcome Modal - Architecture & Flow Diagram

## 📐 Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js Application                      │
│                        (_app.tsx)                               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐  ┌─────▼─────┐  ┌────▼──────┐
   │   Hook  │  │  Component│  │ Background│
   │────────┐│  │────────┐  │  │────────┐  │
   │useFirst│  │Welcome  │  │  │   Orbs │  │
   │ Visit()│  │ Modal   │  │  │ & Grain│  │
   └────┬────┘  └─────┬─────┘  └────┬──────┘
        │             │             │
    ┌───▼──────────────▼─────────────▼──┐
    │    Portal Render to <body>        │
    │  (Modal rendered at top level)    │
    └───┬──────────────────────────────┘
        │
        │ isFirstVisit && isHomePage?
        │
        ├─ Yes → Show WelcomeModal
        │        ├─ Video Container
        │        │  ├─ <video> element
        │        │  │  ├─ source: MP4 (H.264)
        │        │  │  ├─ source: WebM (VP9)
        │        │  │  └─ source: Ogg (Theora)
        │        │  └─ Play Button (fallback)
        │        │
        │        ├─ Close Button (X)
        │        └─ Brand Text
        │
        └─ No → Render nothing
```

---

## 🔄 First Visit Detection Flow

```
┌─────────────────────────────────────────────────────┐
│  User visits website for the first time            │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │  useFirstVisit()│
        │    hook runs    │
        └────────┬────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
  ┌─▼─────────────────┐   ┌──▼──────────────┐
  │ localStorage      │   │ Check condition │
  │ contains key?     │   │ isFirstVisit &&│
  │                   │   │    isHomePage  │
  │ NO ✗              │   │                │
  └────────┬──────────┘   └──┬─────────────┘
           │                  │
   ┌───────▼──────────┐   ┌───▼────────────┐
   │ isFirstVisit:    │   │ true:          │
   │      TRUE        │   │ Show Modal     │
   │                  │   │                │
   │ Set localStorage │   │ Play Video     │
   │ key='true'       │   │ Autoplay       │
   └───────┬──────────┘   │ (with sound)   │
           │              │                │
           │              └────┬───────────┘
           │                   │
           │              ┌────▼─────────┐
           │              │ User Action  │
           │              ├─ Click X     │
           │              ├─ Press ESC   │
           │              └─ Click outside
           │                   │
           │              ┌────▼──────────┐
           │              │ Modal closes  │
           │              │ Video pauses  │
           │              └────┬──────────┘
           │                   │
   ┌───────▴───────────────────▴─────┐
   │  User visits again (same domain) │
   │  localStorage still has key      │
   │  ✓ isFirstVisit = FALSE          │
   │  ✗ Modal NOT shown               │
   └───────────────────────────────────┘
```

---

## 🎥 Video Format Fallback Chain

```
┌─────────────────────────────────────────┐
│     Browser needs to play video        │
└──────────────┬──────────────────────────┘
               │
        ┌──────▼──────┐
        │ Can play    │
        │ MP4?        │
        │ (H.264)     │
        │ ✓           │
        └──────┬──────┘
               │ YES
          ┌────▼────────────────┐
          │ Play welcome.mp4    │
          │ (Browser uses this) │
          └────┬───────────────┘
               │ NO
        ┌──────▼──────┐
        │ Can play    │
        │ WebM?       │
        │ (VP9)       │
        └──────┬──────┘
               │ YES
          ┌────▼────────────────┐
          │ Play welcome.webm   │
          │ (More compressed)   │
          └────┬───────────────┘
               │ NO
        ┌──────▼──────┐
        │ Can play    │
        │ Ogg?        │
        │ (Theora)    │
        └──────┬──────┘
               │ YES
          ┌────▼───────────────┐
          │ Play welcome.ogv   │
          │ (Compat mode)      │
          └────┬──────────────┘
               │ NO
          ┌────▼──────────────┐
          │ Show Play Button  │
          │ (Fallback)        │
          │ User clicks to    │
          │ play manually     │
          └───────────────────┘

⚠️  Modern browser her zaman en az MP4'ü oynatabilir!
```

---

## 🎨 Component Tree

```
App (_app.tsx)
│
├─ WelcomeModal (Portal)
│  │
│  ├─ AnimatePresence (Framer Motion)
│  │  │
│  │  └─ motion.div (modalOverlay)
│  │     │
│  │     ├─ button.closeButton
│  │     │  └─ SVG (X icon)
│  │     │
│  │     └─ motion.div (modalContent)
│  │        │
│  │        ├─ div.videoContainer
│  │        │  ├─ video
│  │        │  │  ├─ source (MP4)
│  │        │  │  ├─ source (WebM)
│  │        │  │  └─ source (Ogg)
│  │        │  │
│  │        │  └─ motion.button.playButton (conditional)
│  │        │     └─ SVG (play icon)
│  │        │
│  │        └─ div.brandText
│  │           ├─ h1 ("Welcome to Glindent")
│  │           └─ p ("Discover premium dental supplies")
│  │
│  └─ Portal to body tag
│
├─ AnimatedBackground
│  ├─ div.orb.orb-1
│  ├─ div.orb.orb-2
│  ├─ div.orb.orb-3
│  └─ div.overlay
│
├─ GrainOverlay
│
├─ ToothParticles (lazy)
│
└─ MainLayout / DefaultLayout
   └─ Component (page content)
```

---

## 📦 File Dependencies

```
src/pages/_app.tsx
│
├── Imports ─────────────┐
│                        │
├─ react                 │
├─ next/app              │
├─ @ikas/storefront      │
├─ next/router           │
├─ framer-motion         │
├─ config.json           │
├─ NavigationProvider    │
├─ MainLayout            │
├─ DefaultLayout         │
├─ ToothParticles        │
├─ WelcomeModal ◄────────┼──────────┐
│  │                     │          │
│  ├─ src/components/    │          │
│  │   welcome-modal/    │          │
│  │   index.tsx         │          │
│  │                     │          │
│  └─ Dependencies:      │          │
│     ├─ react           │          │
│     ├─ framer-motion   │          │
│     ├─ react-dom       │          │
│     └─ CSS Module ─────┼──────┐   │
│        welcome-modal.  │      │   │
│        module.css      │      │   │
│                        │      │   │
└─ useFirstVisit ◄───────┼──────┼───┼──────┐
   │                     │      │   │      │
   └─ src/hooks/        │      │   │      │
      use-first-visit.ts │      │   │      │
                        │      │   │      │
      Dependencies:     │      │   │      │
      ├─ react          │      │   │      │
      └─ None (vanilla) │      │   │      │
                        │      │   │      │
                        │      │   │      │
public/videos/ ◄────────┘      │   │      │
│                              │   │      │
├─ welcome.mp4 ───────────────┤   │      │
├─ welcome.webm ───────────────┤   │      │
└─ welcome.ogv ────────────────┤   │      │
                               │   │      │
Test Utilities: ────────────────┤   │      │
src/utils/                     │   │      │
welcome-modal-test.ts ◄────────┘   │      │
                                   │      │
Docs: ──────────────────────────────┴──────┼───┐
WELCOME_MODAL_DOCS.md                      │   │
WELCOME_MODAL_INTEGRATION.md ◄──────────────┘   │
WELCOME_MODAL_COMPLETION_REPORT.md ◄─────────┘
```

---

## 🔄 Data Flow

```
┌────────────────────────────────────────┐
│  Browser Load (First Time)             │
└──────────────┬─────────────────────────┘
               │
        ┌──────▼─────────┐
        │  _app.tsx      │
        │  initializes   │
        └──────┬─────────┘
               │
        ┌──────▼──────────────────┐
        │ useFirstVisit() called  │
        │                         │
        │ 1. Check localStorage   │
        │ 2. Set isFirstVisit=true│
        │ 3. Set hasChecked=true  │
        └──────┬──────────────────┘
               │
        ┌──────▼────────────────┐
        │ Render WelcomeModal   │
        │                       │
        │ Props:                │
        │ - isOpen:             │
        │   isFirstVisit &&     │
        │   isHomePage &&       │
        │   hasChecked          │
        │                       │
        │ - onClose: () => {}   │
        └──────┬────────────────┘
               │
        ┌──────▼─────────────────┐
        │ Modal appears with     │
        │ animation (300ms)      │
        └──────┬─────────────────┘
               │
        ┌──────▼──────────────────┐
        │ Video mounts            │
        │ 300ms wait timer starts │
        └──────┬───────────────────┘
               │
        ┌──────▼────────────────┐
        │ Auto-play attempted   │
        │                       │
        │ If success:           │
        │ → setIsPlaying=true   │
        │                       │
        │ If fail (browser):    │
        │ → Show play button    │
        └──────┬───────────────┘
               │
        ┌──────▼─────────────────┐
        │ User interaction:      │
        │ - Video playing...     │
        │ - User closes modal    │
        │   (X / ESC / outside)  │
        └──────┬─────────────────┘
               │
        ┌──────▼──────────────────┐
        │ handleClose() triggered │
        │                         │
        │ 1. videoRef.pause()    │
        │ 2. setIsPlaying(false) │
        │ 3. onClose() called    │
        └──────┬───────────────────┘
               │
        ┌──────▼──────────────────┐
        │ Modal closes with       │
        │ animation (300ms)       │
        │                         │
        │ localStorage still has  │
        │ key='glindent_first_...'
        └──────┬───────────────────┘
               │
        ┌──────▼────────────────┐
        │ Next visit:           │
        │ WelcomeModal still in │
        │ tree but isOpen=false │
        │ → Not rendered        │
        └────────────────────────┘
```

---

## 🎬 Video Playback State Machine

```
                    ┌─────────────┐
                    │   STOPPED   │
                    │ (Component  │
                    │  mounted)   │
                    └──────┬──────┘
                           │
                    300ms delay
                           │
                    ┌──────▼──────────┐
                    │  ATTEMPTING     │
                    │  AUTOPLAY       │
                    │  videoRef.play()│
                    └──────┬──────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         SUCCESS                   FAILURE
              │                    (Browser
              │                    blocked)
         ┌────▼──────┐            ┌───▼─────────┐
         │  PLAYING  │            │  FALLBACK   │
         │ (autoplay)│            │  SHOW PLAY  │
         │ isPlaying │            │  BUTTON     │
         │   = true  │            │             │
         └────┬──────┘            └───┬─────────┘
              │                       │
              │                   User clicks
              │                   play button
              │                       │
              │                  ┌───▼──────┐
              │                  │ PLAYING  │
              │                  │ (manual) │
              │                  │          │
              │          ┌───────┴──────────┘
              │          │
              ├──────────┤
              │          │
         User closes     User closes
         modal (any      modal (any
         way)           way)
              │          │
              └──┬───┬───┘
                 │   │
         ┌───────▼───▼────┐
         │  STOPPING      │
         │ videoRef.pause()
         │  setIsPlaying  │
         │     = false    │
         └────────┬───────┘
                  │
           ┌──────▼──────────┐
           │   UNMOUNTED     │
           │   or HIDDEN     │
           │ (Modal closed)  │
           └─────────────────┘
```

---

## 🔐 Security & Privacy

```
┌─────────────────────────────────────────────┐
│  Data Storage & Privacy                     │
└─────────────────────────────────────────────┘

localStorage ('glindent_first_visit')
│
├─ Domain: Current domain only (same-origin)
├─ Persistence: Until user clears browser data
├─ Visibility: Visible to page JavaScript
├─ Size: Only 1 byte (string 'true')
│
└─ ✅ GDPR Compliant
   (Only tracks visit, no personal data)
   (No analytics, no 3rd party cookies)

Video Files
│
├─ Served from /public/videos/
├─ No tracking parameters
├─ No analytics endpoints
├─ Browser cache only
│
└─ ✅ User Privacy
   (No PII stored or transmitted)
   (Only local state management)
```

---

## 📊 State Management

```
┌─────────────────────────────────────────┐
│  Component State (WelcomeModal)         │
└─────────────────────────────────────────┘

1. mounted (useState)
   └─ type: boolean
   └─ purpose: Client-side only rendering
   └─ initial: false
   └─ set: useEffect (client mount)

2. isPlaying (useState)
   └─ type: boolean
   └─ purpose: Track video playback state
   └─ initial: false
   └─ set: When autoplay succeeds or user clicks

3. videoRef (useRef)
   └─ type: HTMLVideoElement | null
   └─ purpose: Direct video control
   └─ methods: .play(), .pause(), .volume

┌─────────────────────────────────────────┐
│  App State (useFirstVisit hook)         │
└─────────────────────────────────────────┘

1. isFirstVisit
   └─ type: boolean
   └─ source: localStorage check
   └─ updates: After first useEffect

2. hasChecked
   └─ type: boolean
   └─ source: Completion flag
   └─ purpose: Prevent SSR hydration mismatch

┌─────────────────────────────────────────┐
│  Persistent State (localStorage)        │
└─────────────────────────────────────────┘

Key: 'glindent_first_visit'
Value: 'true'
Type: String
Scope: Domain
TTL: Infinite (user clears or expires)
```

---

## ✨ Animations Timeline

```
Modal Open Animation (300ms)
┌────────────────────────────────────────┐
│                                        │
│  t=0ms          t=150ms        t=300ms │
│  Start          Mid            End     │
│                                        │
│  overlay:                              │
│  opacity: 0 ─────────────────────► 1 │
│                                        │
│  content:                              │
│  scale:  0.9 ──────────────────► 1   │
│  opacity: 0 ─────────────────────► 1 │
│                                        │
│  easing: easeInOut                    │
│                                        │
└────────────────────────────────────────┘

Play Button Show (animation on-demand)
┌────────────────────────────────────────┐
│                                        │
│  playButton:                           │
│  opacity: 0 ──► 1 (optional)         │
│  duration: auto (immediate)            │
│                                        │
│  On hover:                             │
│  scale: 1 ──────────────────────► 1.1 │
│  duration: 0.3s                        │
│                                        │
│  On click:                             │
│  scale: 1 ──────────────────────► 0.95│
│  duration: 0.2s                        │
│                                        │
└────────────────────────────────────────┘

Modal Close Animation (300ms)
┌────────────────────────────────────────┐
│  (Reverse of Open)                     │
│                                        │
│  overlay:                              │
│  opacity: 1 ───────────────────────► 0│
│                                        │
│  content:                              │
│  scale:  1 ────────────────────────► 0.9
│  opacity: 1 ───────────────────────► 0│
│                                        │
│  duration: 0.3s                        │
│                                        │
└────────────────────────────────────────┘
```

---

**Diagram Generated:** 2026-02-02  
**Updated:** v1.0 Final
