# CAR-RENTAL-RESERVATION-SYSTEM

This application is designed to streamline the process of renting cars online. 

## Live URL
You can access the live application here: [eRental-car](https://eRental-car.vercel.app)

## GitHub Repository
The source code is available on GitHub: [car-rental-reservation-system](https://github.com/Taher-39/car-rental-reservation-system)

## Description
eRental-car is a car rental reservation system built with TypeScript, Express.js, and MongoDB using Mongoose. It provides users with the ability to sign up, sign in, and book cars for rental, ensuring that bookings cannot be made for past dates and times.

## Features
- User and admin authentication (Sign up and Sign in)
- Authorization using JWT (json-web-token)
- Car rental booking system
- Prevents bookings for past dates and times
- Booking car from user end only

## Technology Used
- **Backend:** Node.js, Express.js, TypeScript, JWT, bcrypt etc.
- **Database:** MongoDB (Mongoose)
- **Validation:** Zod
- **Hosting:** Vercel

## Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/Taher-39/car-rental-reservation-system.git
cd car-rental-reservation-system
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Variables
Create a `.env` file in the root directory and add your environment variables. For example:
```plaintext
NODE_ENV=development
PORT=5000
DB_URL='your mongodb url'
BCRYPT_SALT_ROUNDS='your-salt-rounds'
DEFAULT_PASS='your default pass'
JWT_ACCESS_SECRET='your-jwt-key'
JWT_ACCESS_EXPIRES_IN='your-access-expires'
```

### Step 4: Build TypeScript
If you plan to run the project in production mode, you need to build TypeScript files to JavaScript.
```bash
npm run build
```

### Step 5: Start the Server
Start the server in production mode.
```bash
npm run start:prod
```

### Step 6: Development Mode
If you're working on the project and want to run it in development mode with automatic restart on file changes, use the following command:
```bash
npm run start:dev
```

## Scripts

### Build TypeScript
To manually compile TypeScript files to JavaScript, you can run:
```bash
npm run build
```

### Linting
To lint your TypeScript files using ESLint, run:
```bash
npm run lint
```

To automatically fix linting issues, run:
```bash
npm run lint:fix
```

### Code Formatting
To format your code using Prettier, run:
```bash
npm run format
```

To fix formatting issues automatically, run:
```bash
npm run format:fix
```

## Testing
This project doesn't have any testing scripts configured yet. You can add testing frameworks and scripts as needed.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.


Feel free to customize and add more information specific to your project as needed.