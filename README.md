# Arogya-Fitness Guide 💪

> Your personal digital companion on the journey to a healthier lifestyle. Arogya (आरोग्य) means overall well-being, and this "Fit-Yogi" (Fitness-Yogi) helps you track your diet, workouts, and progress seamlessly.

This is a full-stack web application built with a modern tech stack, featuring a dynamic user-facing frontend, a robust backend API, and a dedicated admin panel for content management.

---

## 📸 Application Screenshots


<img width="1920" height="1080" alt="Screenshot 2025-07-24 220358" src="https://github.com/user-attachments/assets/9bf18710-df87-400d-bf26-f868d1329f33" />
<img width="1920" height="1080" alt="Screenshot 2025-07-24 220412" src="https://github.com/user-attachments/assets/9003e7b3-583e-4322-b16d-31ce489867fd" />
<img width="1920" height="1080" alt="Screenshot 2025-07-24 220425" src="https://github.com/user-attachments/assets/1b866739-2f57-4502-9712-2d664191989c" />
<img width="1920" height="1080" alt="Screenshot 2025-07-24 220451" src="https://github.com/user-attachments/assets/c2f9bd4b-61bf-4af3-a0a0-07f28d4f0e41" />
<img width="1920" height="1080" alt="Screenshot 2025-07-24 220524" src="https://github.com/user-attachments/assets/5f020f67-5819-4076-a9b9-4be094cbb03e" />
<img width="1920" height="1080" alt="Screenshot 2025-07-24 220205" src="https://github.com/user-attachments/assets/b0aaedeb-d67b-456d-85dc-cf84b945e9b5" />
<img width="1920" height="1080" alt="Screenshot 2025-07-24 220218" src="https://github.com/user-attachments/assets/2b1c72f5-1d25-423f-9dbf-61db13359d96" />

---

## ✨ Features

### User Features
* **Secure Authentication:** Robust registration and login system using JWT (JSON Web Tokens) with secure cookie-based session management.
* **Personalized Dashboard:** A central hub to view your daily progress with interactive circular meters. It tracks key metrics like:
    * Calorie Intake
    * Sleep Duration
    * Steps Count
    * Water Intake
    * Current Weight
    * Workout Frequency
* **Workout Library:** An engaging, swipeable library of different workout plans (e.g., Chest, Abs, Legs) managed by admins.
* **Detailed Workout Viewer:** Click on any workout to see a detailed list of exercises, including sets, reps, and instructional images.
* **Daily Metric Loggers:** User-friendly popups to log food items, water intake, sleep hours, steps, and weight for any selected date.
* **Automatic Calorie Calculation:** Calorie intake is calculated automatically on the backend by fetching nutritional data from an external API.
* **BMI Calculator:** An integrated tool to quickly calculate and monitor your Body Mass Index.

### Admin Features
* **Secure Admin Login:** A separate, secure login portal for administrators.
* **Workout Management:** Admins have full CRUD (Create, Read, Update, Delete) capabilities for managing workout plans and their associated exercises.
* **Cloud Image Uploads:** Seamlessly upload and manage images for workouts and exercises, which are stored on Cloudinary.
* **Centralized Content Control:** Admins control the fitness content available to all users, ensuring quality and consistency across the platform.

---

## 🛠️ Tech Stack & Architecture

The project utilizes a modern MERN-like stack, decoupled into three distinct applications for better scalability and maintainability.

###  Frontend (User Application)
* **Framework:** **Next.js** (v13+ with App Router)
* **Language:** **TypeScript**
* **UI:** **Material-UI (MUI)**, **MUI Joy**, **MUI X** (Charts, Date Pickers)
* **Styling:** Custom CSS (`.css` files)
* **API Communication:** Fetch API
* **UX:** **Swiper.js** for carousels, **React Toastify** for notifications
* **Utilities:** **Day.js**, **React Icons**

### 🔙 Backend (API Server)
* **Runtime:** **Node.js**
* **Framework:** **Express.js**
* **Database:** **MongoDB** with **Mongoose** as the ODM
* **Authentication:** **JWT (jsonwebtoken)** for tokens, **bcrypt** for password hashing
* **Middleware:** **CORS**, **cookie-parser**, **body-parser**
* **File Handling:** **Multer** for file uploads, **Cloudinary** for cloud media storage
* **Development:** **Nodemon** for live server reloading

### 👨‍💻 Admin Panel
* **Framework:** **Next.js** (v13+ with App Router)
* **Language:** **TypeScript**
* **Core Libraries:** **React**, **React-DOM**
* **Notifications:** **React Toastify**

---

## 🚀 Getting Started & Local Setup

To get a local copy of the entire project up and running, follow these steps.

### Prerequisites
* **Node.js** (v18.x or newer recommended)
* **npm** (comes with Node.js)
* **MongoDB:** You need a running instance of MongoDB. You can use a local installation or a cloud service like MongoDB Atlas.

### 1. Clone the Repository
```sh
git clone [https://github.com/this-is-rachit/Arogya-FitnessGuide.git](https://github.com/this-is-rachit/Arogya-FitnessGuide.git)
cd Arogya-FitnessGuide
```

### 2. Backend Setup
The backend server is the core of the application.

1.  **Navigate to the backend directory:**
2.  **Install dependencies:**
    The `--legacy-peer-deps` flag helps resolve potential version conflicts in the dependency tree.
    ```sh
    npm install --legacy-peer-deps
    ```
3.  **Create the environment file:**
    Create a `.env` file in the `backend` directory and populate it with your credentials.
    ```env
    MONGO_URL=your_mongodb_connection_string
    JWT_SECRET_KEY=your_super_secret_key_for_users
    JWT_ADMIN_SECRET_KEY=your_super_secret_key_for_admins
    DB_NAME=arogya
    COMPANY_EMAIL=your_email_for_nodemailer_if_used
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    NUTRITION_API_KEY=your_nutrition_api_key
    ```
4.  **Start the backend server:**
    ```sh
    nodemon
    ```
    ✅ The backend server should now be running on **`http://localhost:8000`**.

### 3. Frontend Setup (User App)
1.  **Navigate to the frontend directory**
2.  **Install dependencies:**
    ```sh
    npm install --legacy-peer-deps
    ```
3.  **Create the environment file:**
    Create a `.env.local` file and add the backend API URL.
    ```
    NEXT_PUBLIC_BACKEND_API=http://localhost:8000
    ```
4.  **Start the frontend server:**
    ```sh
    npm run dev
    ```
    ✅ The user application should now be running on **`http://localhost:3000`**.

### 4. Admin Panel Setup
1.  **Navigate to the admin directory**
2.  **Install dependencies:**
    ```sh
    npm install --legacy-peer-deps
    ```
3.  **Create the environment file:**
    Create a `.env.local` file and add the backend API URL.
    ```
    NEXT_PUBLIC_BACKEND_API=http://localhost:8000
    ```
4.  **Start the admin server on a different port:**
    To avoid port conflicts with the user app, run the admin panel on port `3001`.
    ```sh
    npm run dev -- -p 3001
    ```
    ✅ The admin panel should now be running on **`http://localhost:3001`**.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

