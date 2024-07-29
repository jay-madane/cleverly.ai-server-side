# Cleverly Server Side Application

Welcome to the server-side repository of **Cleverly.ai**, a SaaS AI platform designed to provide advanced AI tools for various applications. This project is built using modern technologies including Node.js, Express.js, TypeScript, and MongoDB.

## Features

**AI Tools Backend**: Support for 5 advanced AI tools powered by Gemini and Replicate AI models.
  - Conversation Generation
  - Code Generation
  - Image Generation
  - Video Generation
  - Music Generation

**Secure Authentication**: Enhanced user experience with secure authentication and efficient user management using Clerk Authentication.

**Stripe Integration**: Seamless subscription system for monetizing the platform.

## Technologies Used

- **Node.js & Express.js**: For building the server and handling API requests.
- **TypeScript**: For type safety and better development experience.
- **MongoDB**: For the database.
- **Clerk**: For secure user authentication and management.
- **Stripe**: For managing subscriptions and payments.

## Getting Started

### Prerequisites

Make sure you have the following installed and configured:

- Node.js (v14 or later)
- npm (v6 or later) or yarn (v1.22 or later)
- MongoDB database in cloud. (MongoDB Atlas)
- Stripe Webhook setup

## Folder Structure

**src**: Contains the source code.
  - **controllers**: Controller functions for handling requests.
  - **models**: Mongoose models for MongoDB.
  - **routes**: Express routes for different API endpoints.
  - **services**: Services for business logic and third-party integrations.
  - **middleware**: Functions for enabling communication and data management.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cleverly-server.git
cd cleverly-server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:

```
MONGODB_URL=mongodb://localhost:27017/cleverly
CLERK_PUBLISHABLE_KEY=<Your Clerk Publishable API Key>
CLERK_SECRET_KEY=<Your Clerk Secret API Key>
GOOGLE_API_KEY=<API Key>
REPLICATE_API_TOKEN=<API Key>
STRIPE_WEBHOOK_SECRET=<Your Stripe Secret Key>
STRIPE_API_KEY=<Your Stripe Webhook Secret>
REACT_PUBLIC_APP_URL=http://localhost:5173
```

### Running the Application

To start the server:

```bash
npm run start
# or
node index.js
```

The server will start on [http://localhost:8000](http://localhost:8000).
