# Expense Recorder

A modern web application to record, categorize, and manage your expenses. Built with Node.js, Express, MongoDB, React, Vite, TypeScript, Tailwind CSS, and shadcn/ui.

---

## Features

- User authentication (JWT-based)
- Add, view, filter, and delete expenses
- Smart category management (auto-create or reuse categories)
- Filter expenses by date range and category
- Responsive, modern UI with shadcn/ui and Tailwind CSS

---

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd mmc-july-expense-recorder
```

### 2. Install dependencies
#### Backend
```bash
cd backend
npm install
```
#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Start MongoDB
Make sure your MongoDB server is running locally (default: `mongodb://localhost:27017/expenseRecorder`).

### 4. Start the backend server
```bash
cd backend
node src/server.js
```
The backend will run on [http://localhost:8888](http://localhost:8888)

### 5. Start the frontend
```bash
cd frontend
npm run dev
```
The frontend will run on [http://localhost:5173](http://localhost:5173) (default Vite port)

---

## Usage

1. **Sign up** for a new account or sign in.
2. **Add expenses** with description, amount, category, and date.
3. **Filter expenses** by date range and category on the dashboard.
4. **Delete expenses** you no longer need.
5. **Categories** are auto-managed: type a new category to create it, or select an existing one.

---

## Folder Structure

```
mmc-july-expense-recorder/
  backend/      # Express + MongoDB API
  frontend/     # React + Vite + shadcn/ui client
```

---

## Customization
- Update MongoDB connection string in `backend/src/server.js` if needed.
- Tweak Tailwind/theme in `frontend` for your brand.

---

## License

MIT 