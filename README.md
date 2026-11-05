# Digital Diary Application

A full-stack diary application built with React + TypeScript on the frontend and Node.js/Express on the backend, with MongoDB for persistent server-side storage and JWT-based authentication.

> **U21AD502 – Application Development | Assignment 2**

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Diary Entries](#diary-entries)
  - [Tags](#tags)
  - [User Settings](#user-settings)
  - [AI Generation](#ai-generation)
- [Database Design](#database-design)
- [Authentication & Security](#authentication--security)

---

## Overview

Assignment 2 evolves the Digital Diary from the basic client-side application built in Assignment 1 into a component-based React frontend connected to a full Express REST API. The original application used browser `localStorage` for data persistence. This version provides persistent server-side storage through MongoDB via Mongoose, while preserving the React/TypeScript interface.

---

## Features

- **Authentication** – Register, login, and session restoration via JWT
- **Diary Entries** – Full CRUD with mood tracking and tag association
- **Tags** – User-defined tags with cascade delete across entries
- **Full-Text Search** – Search entries by title, content, or tag name
- **User Settings** – Theme, diary preferences, and notification settings
- **AI Entry Generation** – AI-assisted diary entry creation via local Ollama
- **Light/Dark Theme** – Controlled via appearance settings
- **Responsive Design** – Mobile-friendly layout with Tailwind CSS

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React, TypeScript, Vite, Tailwind CSS   |
| Routing    | React Router                            |
| HTTP Client| Axios                                   |
| Icons      | lucide-react                            |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB, Mongoose                       |
| Auth       | JWT (`jsonwebtoken`), `bcryptjs`        |
| AI         | Ollama (`llama3.2` model)               |

---

## Project Structure

```
digital-diary/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── DiaryEntry.js
│   │   ├── Tag.js
│   │   └── UserSettings.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── entries.js
│   │   ├── tags.js
│   │   ├── settings.js
│   │   └── ai.js
│   ├── .env
│   └── server.js
├── src/
│   ├── api/                    # Axios client & interceptors
│   ├── contexts/               # AuthContext, EntriesContext, TagsContext
│   ├── components/             # AppLayout, EntryCard, DiaryEditor, TagSelector, Modal
│   ├── pages/                  # Dashboard, Diary, NewEntry, EditEntry, Search, Tags, Settings, AIGenerate
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local instance or MongoDB Atlas)
- [Ollama](https://ollama.com/) with `llama3.2` pulled (for AI generation)

### Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/digital_diary
JWT_SECRET=your_super_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_URL=http://localhost:5173
PORT=8000
```

### Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install
```

### Running the App

```bash
# Start the backend (from /backend)
node server.js

# Start the frontend (from project root)
npm run dev
```

The Vite dev server proxies all `/api` requests to `http://localhost:8000`.

---

## API Reference

All diary-resource routes require a `Bearer <token>` header. The token is obtained from the login endpoint.

### Authentication

| Method | Endpoint              | Description                        | Auth Required |
|--------|-----------------------|------------------------------------|---------------|
| POST   | `/api/auth/register`  | Register a new user                | No            |
| POST   | `/api/auth/login`     | Login and receive a JWT            | No            |
| GET    | `/api/auth/me`        | Get the current user's profile     | Yes           |

Registration seeds four default tags: *Personal, Work, Ideas, Health*.

### Diary Entries

| Method | Endpoint            | Description                                      |
|--------|---------------------|--------------------------------------------------|
| GET    | `/api/entries`      | List all entries (`?q=` search, `?tag_id=` filter) |
| POST   | `/api/entries`      | Create a new entry                               |
| GET    | `/api/entries/:id`  | Get a single entry with populated tags           |
| PUT    | `/api/entries/:id`  | Update title, content, mood, or tags             |
| DELETE | `/api/entries/:id`  | Delete an entry                                  |

### Tags

| Method | Endpoint        | Description                                          |
|--------|-----------------|------------------------------------------------------|
| GET    | `/api/tags`     | List all tags for the authenticated user             |
| POST   | `/api/tags`     | Create a new tag (unique per user)                   |
| PUT    | `/api/tags/:id` | Rename or recolor a tag                              |
| DELETE | `/api/tags/:id` | Delete a tag and remove it from all related entries  |

### User Settings

| Method | Endpoint          | Description                                     |
|--------|-------------------|-------------------------------------------------|
| GET    | `/api/settings`   | Get merged profile + preferences                |
| PUT    | `/api/settings`   | Update profile and/or upsert preferences        |

### AI Generation

| Method | Endpoint             | Description                                           |
|--------|----------------------|-------------------------------------------------------|
| POST   | `/api/ai/generate`   | Generate a diary entry (`{ prompt }`) via Ollama      |

Returns `{ title, content, tags }`. Returns `503` if Ollama is unreachable.

### Health Check

```
GET /api/health
```

---

## Database Design

| Collection      | Key Fields                                                                 |
|-----------------|----------------------------------------------------------------------------|
| `users`         | `name`, `email` (unique), `passwordHash`, `role`, timestamps              |
| `diaryentries`  | `title`, `content`, `mood`, `tags` (ObjectId[]), `userId`, timestamps     |
| `tags`          | `name`, `color`, `userId` — compound unique index on `{ userId, name }`   |
| `usersettings`  | `appearance`, `diaryPreferences`, `notifications`, `userId`               |

**Search** is implemented using MongoDB `$or` with case-insensitive regular expressions across `title`, `content`, and matching tag names.

**Cascade delete** on tags uses `DiaryEntry.updateMany` with `$pull` to remove the tag reference from all affected entries automatically.

---

## Authentication & Security

- Passwords are hashed with **bcryptjs** (cost factor `10`) before storage.
- JWTs are signed with `JWT_SECRET` and expire after `ACCESS_TOKEN_EXPIRE_MINUTES` (default 24 hours).
- All diary endpoints attach the authenticated user's `_id` to every query, ensuring strict **user-scoped data isolation**.
- The `User` schema's `toJSON` transform strips `passwordHash`, `_id`, `__v`, and raw timestamps from all API responses.
- CORS is restricted to `FRONTEND_URL` to prevent unauthorized cross-origin access.

### HTTP Status Codes

| Code | Meaning                              |
|------|--------------------------------------|
| 200  | Success                              |
| 201  | Resource created                     |
| 400  | Bad request                          |
| 401  | Unauthorized – invalid/missing token |
| 404  | Resource not found or not owned      |
| 422  | Unprocessable – missing required fields |
| 500  | Internal server error                |
| 503  | AI service (Ollama) unreachable      |