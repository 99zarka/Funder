# Funder - Crowdfunding Application

Funder is a full-stack crowdfunding application that allows users to register, log in, create fundraising projects, view all projects, contribute to projects, and manage their own projects. The application consists of a Django REST Framework backend and a React.js frontend.

## Features

### Authentication System
*   **User Registration:** Users can create an account with their first name, last name, email, password, confirm password, and a validated Egyptian mobile phone number.
*   **User Login:** Registered and activated users can log in using their email and password. JWT (JSON Web Tokens) are used for authentication, with access tokens (1 day lifetime) and refresh tokens (7 days lifetime) stored in `localStorage`.
*   **Account Activation:** New user accounts are inactive by default and require activation via a dedicated frontend page.
*   **User Profile:** Authenticated users can view and update their profile information (first name, last name, mobile phone).

### Project Management
*   **Create Project:** Authenticated users can create new fundraising campaigns with a title, details, total target amount, and start/end dates.
*   **View All Projects:** All users can browse a dashboard listing all active crowdfunding projects.
*   **View Project Details:** Users can view detailed information about a specific project.
*   **Contribute to Project:** Authenticated users can contribute funds to any project.
*   **My Projects Management:** Authenticated users can view a dashboard of only their own created projects.
*   **Edit Project:** Project owners can edit the details of their own projects.
*   **Delete Project:** Project owners can delete their own projects.
*   **Search Projects by Date (Bonus):** Users can search for projects active on a specific date.

## Technologies Used

### Backend
*   **Django:** Web framework for rapid development.
*   **Django REST Framework (DRF):** Toolkit for building Web APIs.
*   **Simple JWT:** For JSON Web Token authentication.
*   **`corsheaders`:** For handling Cross-Origin Resource Sharing.
*   **SQLite3:** Default database for development.

### Frontend
*   **React.js:** JavaScript library for building user interfaces.
*   **React Router DOM:** For declarative routing in React applications.
*   **Fetch API:** For making HTTP requests to the backend.
*   **`useState` and `useEffect` hooks:** For state management and side effects.
*   **Vite:** Fast frontend build tool.

## Setup Instructions

Follow these steps to set up and run the Funder application locally.

### 1. Clone the Repository

```bash
git clone https://github.com/99zarka/Funder.git
cd Funder
```

### 2. Backend Setup

Navigate into the `funderback` directory:

```bash
cd funderback
```

#### Create and Activate a Virtual Environment

```bash
# On Windows
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Backend Dependencies

```bash
pip install -r requirements.txt
```

#### Run Database Migrations

```bash
python manage.py migrate
```

#### Create a Superuser (Optional, for Admin Panel Access)

```bash
python manage.py createsuperuser
```
Follow the prompts to create an admin user.

#### Run the Backend Server

```bash
python manage.py runserver
```
The backend API will be running at `http://localhost:8000/api/`.

### 3. Frontend Setup

Open a **new terminal** and navigate into the `funderfront` directory:

```bash
cd funderfront
```

#### Install Frontend Dependencies

```bash
npm install
```

#### Run the Frontend Development Server

```bash
npm run dev
```
The frontend application will be running at `http://localhost:5173/`.

## Usage

1.  **Register:** Navigate to `/register` and create a new user account.
2.  **Activate Account:** After registration, go to `/activate`, enter your registered email, and click "Activate".
3.  **Login:** Navigate to `/login` and log in with your activated account.
4.  **Create Project:** Go to `/create-project` to create a new fundraising campaign.
5.  **View Projects:** Explore `/projects` for all projects or `/my-projects` for your own projects.
6.  **View Profile:** Check your user profile at `/profile`.
7.  **Edit/Delete Projects:** From `/my-projects`, you can edit or delete your own projects.

## API Endpoints

All API endpoints are prefixed with `http://localhost:8000/api/`.

### Users
*   `POST /users/register/`: Register a new user.
*   `POST /users/login/`: Log in and obtain JWT tokens.
*   `POST /users/activate/`: Activate a user account.
*   `GET /users/profile/`: Retrieve authenticated user's profile.
*   `PUT /users/profile/`: Update authenticated user's profile.
*   `POST /users/token/`: Obtain new access token using refresh token.
*   `POST /users/token/refresh/`: Refresh access token.

### Projects
*   `GET /projects/`: List all projects.
*   `POST /projects/`: Create a new project (authenticated).
*   `GET /projects/<id>/`: Retrieve details of a specific project.
*   `PUT /projects/<id>/`: Update a specific project (owner only).
*   `DELETE /projects/<id>/`: Delete a specific project (owner only).
*   `POST /projects/<id>/contribute/`: Contribute to a project (authenticated).
*   `GET /projects/my-projects/`: List projects owned by the authenticated user.
*   `GET /projects/search_by_date/?date=<YYYY-MM-DD>`: Search projects active on a specific date.

## JWT Authentication

*   Upon successful login, `access_token` and `refresh_token` are stored in the browser's `localStorage`.
*   The `access_token` is included in the `Authorization` header as a `Bearer` token for all authenticated requests to the backend.
*   Access Token Lifetime: 1 day
*   Refresh Token Lifetime: 7 days
