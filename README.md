# ![Good Fit](./extension/public/icon128.png)

# [![Youtube](https://aaronzakowski.com/wp-content/uploads/2023/09/podcast-badge-youtube.png.webp)](https://youtu.be/7U0I6LI_nhA)

# Good Fit - AI-Powered Job Compatibility Extension

**Good Fit** is an AI-powered Chrome extension that helps you determine if your candidate profile is a perfect match for a job listing in real-time. Built on top of open-source standards, Good Fit enhances your job search experience by leveraging AI-driven insights.

---

## 📌 Features

- **Real-time compatibility analysis**: Instantly assess job match based on your profile.
- **AI-driven insights**: Uses Ollama to determine suitability.
- **Seamless integration**: Works effortlessly in the background while browsing job listings.

---

## 🚀 Getting Started

### 🔹 Prerequisites

Before installing Good Fit, ensure you have the following installed:

- **Node.js** (>=18.0.0) & **npm** (>=9.0.0) – [Download](https://nodejs.org/)
- **Google Chrome** (latest version) – [Download](https://www.google.com/chrome/)
- **Ollama** – [Installation Guide](https://ollama.com)
- **Docker & Docker Compose** (optional, if running the backend via Docker) – [Download](https://www.docker.com/)

---

## 🛠 Installation

### 1️⃣ Clone the Repository

```sh
$ git clone https://github.com/ferhatkorkmaz11/goodfit.git && cd goodfit
```

### 2️⃣ Install and Build the Chrome Extension

```sh
$ cd extension && npm install && npm run build
```

### 3️⃣ Load the Extension into Google Chrome

1. Open Google Chrome.
2. Visit `chrome://extensions/`.
3. Toggle **Developer mode** (top right corner).
4. Click **Load Unpacked** (top left corner).
5. Select the `goodfit/extension/dist` folder.

### 4️⃣ Set Up the Backend

#### **Option 1: With Docker**

```sh
$ docker compose up --build
```

#### **Option 2: Without Docker**

```sh
$ cd backend && npm install && npm run dev
```

---

## ⚡ Usage

1. Open the Good Fit extension and upload your CV.
2. Open any job listing on LinkedIn.
3. Get your job suitability scores in real-time.

---
