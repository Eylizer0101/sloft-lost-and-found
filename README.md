# Lost & Found
Lost&amp;Found is a web application developed using the MERN stack. It is a platform that helps users report and track lost and found items in a particular area. The main goal of the application is to reunite lost items with their rightful owners.
<br>
Users can create an account, post a lost or found item report, and search for existing reports in their area. The application provides a centralized location for reporting lost and found items, making it easier for people to track and recover lost items. Additionally, users can also leave comments on reports, providing additional information and increasing the chances of the lost item being recovered.


## Demo
[Loom Video](https://www.loom.com/share/a8fa5a98a3364a7c970ae5b78e8240c1)

## Key Features & Benefits

*   **User Authentication:** Secure user registration and login functionality.
*   **Item Reporting:** Users can easily report lost or found items with detailed descriptions and images.
*   **Item Search:** Powerful search capabilities allow users to find relevant items based on keywords, categories, and location.
*   **User Profiles:** Users can manage their listings and track the status of reported items.
*   **Image Upload:** Functionality to upload images of lost or found items to aid in identification.
*   **Responsive Design:** The application is designed to be responsive and accessible on various devices.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

*   **Node.js:** (Version 14 or higher) - [https://nodejs.org/](https://nodejs.org/)
*   **npm:** (Typically bundled with Node.js)
*   **MongoDB:** (Community Edition or MongoDB Atlas) - [https://www.mongodb.com/](https://www.mongodb.com/)

## Installation & Setup Instructions

Follow these steps to get the project up and running on your local machine:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/KcMelek/Lost-Found-MERN.git
    cd Lost-Found-MERN
    ```

2.  **Install Server Dependencies:**

    ```bash
    cd server
    npm install
    ```

3.  **Configure Server Environment Variables:**

    *   Create a `.env` file in the `server` directory.
    *   Add the following environment variables (replace with your actual values):

        ```
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/lostfounddb
        JWT_SECRET=your_jwt_secret_key
        ```
        *   `PORT`:  The port the server will run on.
        *   `MONGO_URI`:  The connection string for your MongoDB database.
        *   `JWT_SECRET`: A secret key used to sign JSON Web Tokens for authentication. Choose a strong and secure value.

4.  **Install Client Dependencies:**

    ```bash
    cd ../client
    npm install
    ```

5.  **Configure Client Environment Variables:**

    *   Create a `.env` file in the `client` directory.
    *   Add the following environment variable:

        ```
        REACT_APP_API_URL=http://localhost:5000
        ```
        *   `REACT_APP_API_URL`: The URL of your backend server.  Adjust the port if your server is running on a different port.

6.  **Start the Server:**

    ```bash
    cd ../server
    npm run dev
    ```

    This will start the server using `nodemon`, which automatically restarts the server when you make changes to the code.

7.  **Start the Client:**

    ```bash
    cd ../client
    npm start
    ```

    This will start the React development server. The application should now be accessible in your browser at `http://localhost:3000`.

## Usage Examples & API Documentation

### API Endpoints:

The server provides the following API endpoints:

*   **User Authentication:**
    *   `POST /api/users/register`: Registers a new user.
    *   `POST /api/users/login`: Logs in an existing user.
    *   `GET /api/users/profile`: Retrieves user profile information (requires authentication).
*   **Item Management:**
    *   `POST /api/items`: Creates a new lost or found item report (requires authentication).
    *   `GET /api/items`: Retrieves a list of all items.
    *   `GET /api/items/:id`: Retrieves a specific item by its ID.
    *   `PUT /api/items/:id`: Updates an existing item (requires authentication).
    *   `DELETE /api/items/:id`: Deletes an item (requires authentication).

## License Information

This project has no specified license. All rights are reserved.
