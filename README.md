<<<<<<< HEAD
# Frontend-Projectss
=======
# Frontend-Projects

This repository contains two main projects:

- [Guess-The-Number](#guess-the-number)
- [ToDoList](#todolist)

---

## Guess-The-Number

A web-based number guessing game where the player tries to guess a secret number between 1 and 1000 within 15 attempts.

### Features
- Modern, responsive UI with game show style.
- Front page introduction and instructions.
- Input validation and guess history.
- Feedback for too high/low guesses, win/lose, and attempts left.
- Option to give up and restart the game.

### How to Run
1. Open `Guess-The-Number/Game.html` in your web browser.
2. Click **Start Game** and begin guessing!

---

## ToDoList

A full-stack to-do list application with a Node.js/Express backend and a simple HTML/JS frontend. Tasks are stored in a MySQL database.

### Structure
```
ToDoList/
  backend/    # Node.js/Express server
    Server.js
    package.json
  frontend/   # HTML/JS frontend
    todolist.html
    package.json
```

### Backend
- Built with Express.js and MySQL.
- Provides endpoints to get, add, and edit to-do items.
- CORS enabled for frontend-backend communication.

#### Setup
1. Install dependencies:
   ```bash
   cd ToDoList/backend
   npm install
   ```
2. Ensure you have a MySQL server running and a database named `todo` with a table `todoItems` (columns: `ID`, `itemDescription`).
3. Update the database credentials in `Server.js` if needed.
4. Start the server:
   ```bash
   npm start
   ```
   The backend runs on [http://localhost:3000](http://localhost:3000).

### Frontend
- Simple HTML/JS app using Bootstrap for styling.
- Fetches and displays tasks from the backend.
- Allows adding, editing, and (UI for) deleting tasks.

#### Setup
1. Open `ToDoList/frontend/todolist.html` in your browser.
2. Ensure the backend is running for full functionality.

---

## Requirements
- Node.js and npm (for ToDoList backend)
- MySQL server (for ToDoList backend)
- Modern web browser (for both projects)

---

## License
This repository is licensed under the ISC License. 
>>>>>>> origin/master
