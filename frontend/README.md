# LingoChat

A chat application enhanced with **automatic translation** and **autocorrect**, powered by statistical language modeling and Google Translate API.  
Built using **Node.js / Express**, this app supports three languages and uses a custom Game of Thrones corpus for language modeling.

---

##  Highlights
- Chat application with built-in **autocorrect** (using bigram & unigram with MLE smoothing + Levenshtein distance)
- **Auto-translation** feature via Google Translate API
- Language models trained using **Game of Thrones books** in three languages (Indonesia,English,Spanish)
- Real-time suggestion & translation for more intuitive user experience

---

##  Tech Stack
- **Backend**: Node.js, Express.js
- **Language Modeling**: Bigram and Unigram (MLE smoothing)
- **Autocorrect**: Levenshtein distance-based correction
- **Translation API**: Google Translate API
- **Dataset**: Game of Thrones books in three supported languages (source corpus)

---

##  Dataset & Preprocessing
1. **Game of Thrones texts** (in three languages) serve as the corpus.
2. Texts go through **preprocessing**: tokenization, normalization, cleaning.
3. **Frequency counts** are computed to build **unigram** and **bigram** models.
4. Probabilities calculated with **Maximum Likelihood Estimation (MLE)** and smoothing.
5. **Autocorrect** module uses distance-based suggestions via **Levenshtein distance**.

---

##  Installation & Setup

```bash
git clone https://github.com/NawwafNaufal/LingoChat.git
cd LingoChat
npm install

Import dataset and build language model (script or instructions here).

Start the server
npm start

Real-time chat interface

Autocorrect suggestions as you type

Translation support for three languages

Language model powered by own corpus: Game of Thrones

Smooth probability models with bigram and unigram + smoothing

Activity logging


Usage Example

Type a message, misspelled — autocorrect suggests the correct term.

Request translation — see translated version with autocorrect applied first.

Switch between supported languages seamlessly.

Project Structure
LingoChat/
├── backend/                  # Backend service (Node.js + Express)
│   └── src/
│       ├── config/           # Configuration files (env, db, etc.)
│       ├── controllers/      # Request handlers
│       ├── lib/              # Utility functions / helpers
│       ├── middleware/       # Middleware (auth, validation, etc.)
│       ├── models/           # Database models
│       ├── routes/           # API routes
│       ├── seeds/            # Initial seeding data
│       ├── service/          # Business logic
│       └── index.js          # Entry point
│
├── frontend/                 # Frontend service (React.js)
│   ├── public/               # Static assets
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── constants/        # Constants & config
│       ├── lib/              # Helpers and utilities
│       ├── locales/          # i18n translation files
│       ├── pages/            # Application pages
│       ├── public/           # Static files
│       ├── store/            # State management (Redux/Context)
│       └── App.jsx           # App entry
│
└── README.md

Clone repository
git clone https://github.com/NawwafNaufal/LingoChat.git
cd LingoChat

Backend setup
cd backend
npm install
npm run dev

Frontend setup
cd frontend
npm install
npm start

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
