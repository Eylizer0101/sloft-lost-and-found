<div align="center">

# S-LOFT
### Lost and Found Tracking System

**A web-based platform for reporting, tracking, and managing lost and found items.**

[![React](https://img.shields.io/badge/Frontend-React-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Backend-Express-333333?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

[Overview](#overview) · [Features](#key-features) · [Getting Started](#getting-started) · [Usage](#how-to-use) · [Project Structure](#project-structure)

</div>

---

## Overview

**S-LOFT (Lost and Found Tracking System)** is a MERN-stack web application that provides a centralized place to report lost items, post found items, browse existing listings, and support the process of returning belongings to their owners.

The platform includes separate user-facing and administrative interfaces. Users can create and manage reports, while administrators can review reports, manage users, monitor claims, and view system analytics.

### Project Objectives

- Make lost and found reporting more organized and accessible.
- Help users discover reports that may match their lost belongings.
- Provide a clearer way to manage item listings and related claims.
- Give administrators tools for monitoring reports and platform activity.
- Deliver an interface that works across desktop and mobile screen sizes.

## Key Features

### User Features

- **Account access:** Sign up, log in, and manage profile information.
- **Lost item reporting:** Submit reports describing missing belongings.
- **Found item reporting:** Post information about discovered belongings.
- **Item browsing:** Explore separate lost and found item listings.
- **Item details:** Open individual reports to review available information.
- **Image attachments:** Include item photos when creating supported reports.
- **My Listings:** View and manage reports associated with an account.
- **Account recovery:** Use the forgot-password and reset-password pages.
- **Responsive interface:** Access the application from different screen sizes.

### Administrator Features

- **Dashboard:** Access an overview of administrative activity.
- **Report management:** Review submitted reports and inspect their details.
- **Add reports:** Create reports through the administrative interface.
- **User management:** Review and manage user records.
- **Analytics:** View visual summaries of system data.
- **Archives:** Access archived records and related details.
- **Claim management:** Review claim notifications and individual claims.

> Feature availability and permissions depend on the current application implementation and the account being used.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, JavaScript, HTML, CSS |
| UI components | Material UI, React Bootstrap, React Icons |
| Client-side routing | React Router |
| HTTP communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication-related libraries | JSON Web Tokens, bcryptjs |
| File uploads | Multer |
| Email-related libraries | Nodemailer, Brevo SDK |
| Data visualization | Recharts |
| Additional UI libraries | React Toastify, SweetAlert2, Framer Motion |

*The table describes technologies included in the repository's package dependencies; not every library is necessarily used on every page.*

## Project Structure

```text
sloft-lost-and-found/
├── client/                  # React frontend
│   ├── public/              # Public assets
│   ├── src/
│   │   ├── Components/      # Application components and pages
│   │   ├── Pages/           # Additional application pages
│   │   └── App.js           # Client-side route configuration
│   └── package.json
├── server/                  # Express backend
│   ├── routes/              # API route definitions
│   ├── middlewares/         # Backend middleware
│   ├── uploads/             # Uploaded files, when present
│   ├── app.js               # Server entry point
│   └── package.json
├── .gitignore
└── README.md
```

*This is a simplified representation of the main project directories, not a complete inventory of every file.*

## Getting Started

### Prerequisites

Install the following before running the project locally:

- [Node.js](https://nodejs.org/) and npm (use a currently supported LTS release compatible with the project dependencies).
- [MongoDB](https://www.mongodb.com/) locally, or a MongoDB Atlas database.
- [Git](https://git-scm.com/) for cloning the repository.

### 1. Clone the Repository

```bash
git clone https://github.com/Eylizer0101/sloft-lost-and-found.git
cd sloft-lost-and-found
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure the Backend

Create a `.env` file inside the `server` directory.

```dotenv
PORT=4000
DB=mongodb://127.0.0.1:27017/sloft_lost_and_found
```

- `PORT` sets the backend port; the server defaults to `4000` if not provided.
- `DB` is the MongoDB connection string read by `server/app.js`.
- If using MongoDB Atlas, replace `DB` with your own Atlas connection string.

**Important:** Other features, such as authentication, email delivery, or integrations, may require additional configuration specific to the corresponding backend modules. Review those modules and supply their required variables before using those features. Do not commit `.env` files, secrets, or database credentials to GitHub.

### 4. Start the Backend

From the `server` folder, run:

```bash
npm run dev
```

Alternatively:

```bash
npm start
```

With the default port, the backend is available at `http://localhost:4000` after the database connection succeeds.

### 5. Install Frontend Dependencies

Open another terminal at the repository root:

```bash
cd client
npm install
```

Ensure the frontend's API configuration points to the local backend, rather than a deployed API URL. The exact configuration should be checked in the client source before running locally.

### 6. Start the Frontend

From the `client` folder, run:

```bash
npm start
```

The React development server typically opens at:

```text
http://localhost:3000
```

Leave both the frontend and backend terminals running during local development.

## How to Use

### For Users

1. Open the application and create an account or log in.
2. Browse the **Lost Items** or **Found Items** section.
3. Open a report to see its available details.
4. Submit a lost or found item report with a description and supporting information.
5. Visit **My Listings** to manage your submitted reports.
6. Use the available claim-related workflow when applicable.

### For Administrators

1. Access the administrative interface using an authorized account.
2. Review the dashboard and submitted reports.
3. Inspect report details and manage records as permitted.
4. Open user management, archives, or analytics as needed.
5. Review claim notifications and claim details.

## Backend Route Groups

The Express server mounts these route groups:

| Route prefix | Purpose |
| --- | --- |
| `/users` | User-related operations |
| `/items` | Lost and found item operations |
| `/admin` | Administrative operations |
| `/notifications` | Notification operations |
| `/claims` | Claim-related operations |
| `/contact` | Contact-related operations |
| `/uploads` | Static access to uploaded files |

> These are **route prefixes**, not an exhaustive API endpoint reference. Consult the corresponding files under `server/routes/` for supported HTTP methods, full paths, request bodies, and authorization requirements.

## Available Commands

### Frontend (`client/`)

| Command | Description |
| --- | --- |
| `npm start` | Start the React development server |
| `npm run build` | Create a production frontend build |
| `npm test` | Run the configured React test runner |

### Backend (`server/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Run the Express server using Nodemon |
| `npm start` | Run the Express server using Node.js |

## Security and Data Handling

The repository includes libraries commonly used for password hashing and token-based authentication. Deployment security still depends on the actual route and middleware configuration.

When deploying or contributing:

- Keep database URLs, email credentials, and application secrets out of version control.
- Use HTTPS in production.
- Validate incoming data and uploaded files on the server.
- Restrict administrative endpoints to authorized users.
- Review CORS settings for the intended frontend origins.
- Apply appropriate retention and access controls to item images and user information.

## Troubleshooting

| Issue | Suggested check |
| --- | --- |
| Backend does not start | Check Node.js dependencies, `server/.env`, and the MongoDB connection. |
| Frontend cannot load backend data | Confirm that the backend is running and the frontend API URL is correct. |
| Browser reports a CORS error | Review the backend's `configureCors` middleware and allowed origins. |
| Images fail to upload or display | Check upload validation, the `/uploads` static path, and filesystem persistence in the hosting environment. |
| Login fails | Review authentication configuration, backend logs, and database connectivity. |
| A port is already in use | Stop the conflicting process or configure a free port and update the frontend accordingly. |

## Future Improvements

Potential enhancements include:

- Improved matching between lost and found reports.
- More detailed claim status tracking and notifications.
- Expanded automated tests for user and administrative workflows.
- Improved image storage for cloud deployments.
- Additional accessibility and usability improvements.

*These are possible enhancements and should not be interpreted as already implemented features.*

## Contributing

Suggestions and issues can be submitted through the repository's [Issues](https://github.com/Eylizer0101/sloft-lost-and-found/issues) page. If you wish to propose changes, open an issue first to discuss the change before submitting a pull request.

## Developer

**Eylizer De Afria**

- [GitHub](https://github.com/Eylizer0101)
- [LinkedIn](https://www.linkedin.com/in/eylizer-de-afria-040724430/)
- [Portfolio](https://eylizer-portfolio.onrender.com/)

## License

No root `LICENSE` file is currently indicated in the repository. Unless the repository owner adds a license, do not assume permission to copy, modify, or redistribute the source code. Third-party dependencies retain their own respective licenses.

---

<div align="center">

**S-LOFT — Making lost and found reporting easier to organize and manage.**

</div>
