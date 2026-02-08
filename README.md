# Pomodoro

A desktop Pomodoro timer app built with [Wails v2](https://wails.io/) (Go backend + React/TypeScript frontend). Features a translucent/acrylic window style for a modern look.
## Download
[Download](https://github.com/MothyLag/pomothydoro/releases/latest)
## Features

- **Pomodoro Timer** — Click anywhere on the screen to start/stop the timer
- **Cycle Management** — Automatically advances through Work, Short Rest, and Long Rest sessions following the classic Pomodoro pattern
- **Session Tracking** — Records all completed sessions with timestamps
- **Task Management** — Backend CRUD for tracking tasks (UI in progress)
- **Translucent Window** — Acrylic effect on Windows, translucent on Linux

### Default Cycle Pattern

| Cycle       | Duration |
|-------------|----------|
| Work        | 20 min   |
| Short Rest  | 5 min    |
| Long Rest   | 15 min   |

Pattern: Work → Short Rest → Work → Short Rest → Work → Short Rest → Work → Long Rest, then repeat.

## Tech Stack

- **Backend:** Go 1.23 with Wails v2
- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS v4
- **Package Manager:** bun

## Prerequisites

- [Go](https://go.dev/dl/) 1.23+
- [Wails CLI](https://wails.io/docs/gettingstarted/installation) v2
- [bun](https://bun.sh/)
- On Linux: WebKit2GTK 4.1 development libraries

## Getting Started

### Install frontend dependencies

```bash
cd frontend && bun install
```

### Development (live reload)

```bash
wails dev -tags webkit2_41
```

This starts a Vite dev server with hot reload for the frontend and live-reloads Go changes. A dev server is also available at `http://localhost:34115` for browser-based development with access to Go methods.

### Build

```bash
# Windows
wails build -tags webkit2_41 -platform=windows
```

The `-tags webkit2_41` flag is required on Linux for WebKit compatibility.

## Project Structure

```
pomodoro/
├── main.go              # Wails app entry point and bindings
├── app.go               # App struct with startup lifecycle
├── clock.go             # Timer engine (sessions, cycle tracking, formatting)
├── Settings.go          # Pomodoro configuration (durations, cycle pattern)
├── Tasks.go             # In-memory task CRUD
├── wails.json           # Wails project config
├── build/               # Build output
└── frontend/
    └── src/
        ├── main.tsx             # React entry point
        ├── App.tsx              # Root layout (menu + clock)
        ├── pages/
        │   └── Clock.tsx        # Main timer view
        ├── components/
        │   ├── Menu.tsx         # Navigation bar
        │   ├── CustomPanel.tsx  # Side panel container
        │   └── Tasks.tsx        # Task list UI
        └── hooks/
            ├── useClock.ts      # Clock Go binding wrappers
            └── useSettings.ts   # Settings Go binding wrappers
```

## Architecture

The frontend communicates with Go directly through Wails-generated TypeScript bindings (no REST API). Each exported method on a bound Go struct becomes an async TypeScript function. Bindings are auto-generated in `frontend/wailsjs/` whenever `wails dev` or `wails build` runs.

### Bound Go structs

- **App** — Application lifecycle
- **Clock** — Start/stop sessions, get remaining time, track cycle position
- **Settings** — Retrieve Pomodoro configuration
- **Tasks** — Add, get, update, and delete tasks

## Author

mothylag (decagufy30@gmail.com)
