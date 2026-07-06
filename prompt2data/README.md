# 🚀 Prompt2Data

> AI-powered data generation platform for developers
> Generate structured datasets, stream them, and integrate directly into your ML pipelines.

---

## 🧠 Overview

Prompt2Data is a SaaS platform that allows users to:

* Generate datasets using natural language prompts
* Define custom schemas or let AI auto-generate structure
* Preview data before spending credits
* Convert datasets into embeddings for AI/RAG use cases
* Access datasets via API or Python SDK

---

## ✨ Features

### 🔐 Authentication

* Google Login (Firebase)
* GitHub Login (Firebase)
* Secure JWT verification using Firebase Admin

---

### 💰 Credit System

* 100 free credits on signup
* Pay-per-usage model
* Credit-based dataset generation

---

### 📊 Dataset Engine

* Prompt-based dataset generation
* Custom schema support (JSON)
* Auto schema generation
* Preview before generation

---

### ⚙️ Job System

* Async dataset generation
* Status tracking:

  * `pending`
  * `processing`
  * `completed`
  * `failed`

---

### 🧠 AI + Vector DB

* Convert datasets into embeddings
* Ready for RAG pipelines
* Future support for:

  * Pinecone
  * Weaviate
  * FAISS

---

### 🔑 API & SDK

* Secure API access via Firebase auth
* Python SDK (planned)
* Streaming dataset support

---

## 🏗️ Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Firebase Admin (Auth verification)
* MongoDB (Mongoose)

### AI Layer (Planned)

* Python (FastAPI)
* LLM integration
* Data generation pipelines

---

## 📁 Project Structure

```
src/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── user/
│   │   └── dataset/
│   │
│   ├── dashboard/
│   ├── login/
│   └── settings/
│
├── lib/
│   ├── firebase.ts
│   ├── firebaseAdmin.ts
│   ├── db.ts
│
├── models/
│   ├── User.ts
│   └── Dataset.ts
```

---

## 🔐 Authentication Flow

```
User → Firebase Login → Get Token
        ↓
Frontend → Backend (/api/auth)
        ↓
Firebase Admin verifies token
        ↓
User created / logged in
```

---

## 📊 Dataset Flow

```
User Prompt
   ↓
Preview API (no credits)
   ↓
Generate API (credits deducted)
   ↓
Dataset stored
   ↓
Optional embeddings
```

---

## ⚙️ Environment Variables

Create `.env.local`:

```
# Firebase (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Backend)
FIREBASE_ADMIN_KEY=

# MongoDB
MONGO_URI=
```

---

## 🚀 Getting Started

### 1. Clone Repo

```
git clone https://github.com/yourusername/prompt2data.git
cd prompt2data
```

### 2. Install Dependencies

```
npm install
```

### 3. Add Environment Variables

Create `.env.local` and add required keys.

---

### 4. Run Development Server

```
npm run dev
```

---

## 🔥 Future Roadmap

* [ ] Dataset Preview API
* [ ] Dataset Generation Engine
* [ ] Credit deduction system
* [ ] Python SDK
* [ ] Vector DB integration
* [ ] Payment system (Stripe)
* [ ] Streaming datasets
* [ ] Team collaboration

---

## 💬 Philosophy

Prompt2Data is built on the idea that:

> "Data should be as easy to generate as prompts."

---

## 👨‍💻 Author

Built by **Priyanshu Joshi** 🚀
AI + Startup + Engineering Enthusiast

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 💬 Share feedback

---

## 📜 License

MIT License
