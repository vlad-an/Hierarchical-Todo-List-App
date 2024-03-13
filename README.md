# Hierarchical-Todo-List-App

TaskTree is a full-stack web application designed to help users efficiently manage their tasks and to-do lists. Featuring a clean, user-friendly interface, TaskTree supports nested tasks, user accounts, and various task management features to enhance productivity.

## Features

- **User Management:** Secure user accounts, allowing personalized task management.
- **Nested Tasks:** Support for infinitely nested tasks, enabling detailed organization of tasks and subtasks.
- **Task Operations:** Users can create, update, mark as complete, and delete tasks within their accounts.
- **Dynamic Views:** Tasks can be collapsed or expanded for a streamlined view, and moved across different lists for optimal organization.
- **Data Durability:** Utilizes SQLAlchemy for robust database management, ensuring user data is securely stored and managed.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Flask
- **Database:** SQLAlchemy (SQLite for development)
- **Authentication:** Custom Flask auth with hashed passwords

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js and npm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/TaskTree.git
cd TaskTree

```

1. **Set up the backend**

Navigate to the backend directory, create a virtual environment, and install dependencies.

```bash
bashCopy code
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

```

Run the Flask application.

```bash
bashCopy code
flask run

```

1. **Set up the frontend**

Navigate to the frontend directory and install the necessary packages.

```bash
bashCopy code
cd ../frontend
npm install

```

Start the React application.

```bash
bashCopy code
npm start

```

The TaskTree app should now be running on **`localhost:3000`**.

## **Project Structure**

TaskTree is divided into two main directories: **`backend`** for the Flask application and **`frontend`** for the React application. The project's organization facilitates separation of concerns, where the backend handles API requests and database operations, and the frontend manages user interface and experience.

### **Backend**

- **`auth/`**: Authentication-related code
- **`main/`**: Main application logic for task and board management
- **`models.py`**: SQLAlchemy models for User, Task, and Board

### **Frontend**

- **`src/components/`**: Reusable React components
- **`src/pages/`**: Components representing entire pages
- **`src/apiclient.js`**: Helper class for making API requests

## **Database Schema**

TaskTree uses a simple yet flexible schema to manage users, tasks, and boards. Each task can be part of a board and have nested subtasks, allowing for a detailed organization.
