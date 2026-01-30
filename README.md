**IdeaSpark – AI-Assisted Idea Management Platform**

IdeaSpark is a full-stack web application designed to help users generate, organize, validate, and manage ideas efficiently.
It addresses real-world problems like creative block, scattered idea storage, and lack of structured idea evaluation by combining secure authentication, clean UI, and AI-assisted features.

* https://ideasparkmani.vercel.app
* https://ideasparkapi.onrender.com

<img style="margin: 0 auto;" width="742" height="464" alt="homepage" src="https://github.com/user-attachments/assets/ccab69ba-1146-4b9a-a613-4deb4474823e" />

---

**Tech Stack**

Frontend

* Next.js with Typescript
* Tanstack React-query
* NextAuth 5
* Tailwind CSS

Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* Bcrpyt for Hash password

AI Integration (HuggingFace API - Free Tier - Short Prompt Usage)

* Generate Ideas by raw thoughts using AI
* Compare two ideas and get suggestion which one is best using AI


---

**Key Features**

* User Authentication (Signup & Login via Google/Github, Google One Tap Login, Forgot Password)
* Secure NextAuth & JWT-based authentication
* Protected Routes for authenticated users
* Create, Read, Update, Delete (CRUD) Ideas
* Download Ideas that you loved as Image too
* AI-powered Idea Generation with raw thoughts
* AI-powered Idea Comparision with 2 ideas
* Explore Public Ideas shared by other users
* User Profile Page with Login History
* Clean and responsive UI

---

**Protected Routes**

The following routes are accessible only to authenticated users:

* `/user/ideas`
* `/user/profile`

---

**Project Structure**

Both frontend and backend are maintained inside a single root folder:

```
IdeaSpark/
├── frontend/
└── backend/
```

This separation keeps the codebase clean, lightweight, and easy to maintain.

---

**Getting Started – Frontend**

Navigate to the frontend directory:

```
cd frontend
```

Install dependencies:

```
npm install
```

Create a `.env.local` file and add necessary environment variables.

Start the development server:

```
npm run dev
```

---

**Getting Started – Backend**

Navigate to the backend directory:

```
cd backend
```

Install dependencies:

```
npm install
```

Create a `.env` file and add necessary environment variables.

Start the backend server:

```
npm run dev
```

---

**Authentication & Security**

* Passwords & Secrets are securely hashed
* Route-level authorization for protected endpoints
* Input validation and centralized error handling
* Designed to work consistently across browsers (including Safari)

---


**Deployment**

* Frontend deployed using Vercel
* Backend deployed using Render (It slow down after unactivity so it may take utpo 1 min when first time API hit)

---

**Author**

**Manikant Kumar**
* GitHub: [https://github.com/Manikantkr-1004](https://github.com/Manikantkr-1004)
* LinkedIn: [https://www.linkedin.com/in/manikantofficial2023/](https://www.linkedin.com/in/manikantofficial2023/)
