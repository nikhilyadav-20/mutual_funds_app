# Mutual Fund Search & Management App

A full-stack web application built with Next.js that allows users to search, view, and save mutual funds using the MF API.

## Features

- **User Authentication**: JWT-based registration and login
- **Mutual Fund Search**: Search funds using the MF API (https://www.mfapi.in)
- **Fund Details**: View detailed information including NAV history
- **Save Funds**: Authenticated users can save their favorite funds
- **Personal Portfolio**: View and manage saved funds
- **Responsive Design**: Works on both desktop and mobile devices
- **Loading States**: Smooth loading indicators
- **Error Handling**: Comprehensive error messages

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **External API**: MF API (https://www.mfapi.in)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas connection string)

### Installation

1. Clone or download the project files
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   - Copy `.env.local` and update the values:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/mutualfund-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   \`\`\`

4. Start MongoDB (if running locally):
   \`\`\`bash
   mongod
   \`\`\`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Register/Login**: Create an account or sign in
2. **Search Funds**: Use the search bar to find mutual funds
3. **View Details**: Click on any fund to see detailed information
4. **Save Funds**: Click the "Save Fund" button on fund detail pages
5. **Manage Portfolio**: Visit "My Funds" to see all saved funds

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/funds/save` - Save a mutual fund
- `GET /api/funds/saved` - Get user's saved funds
- `DELETE /api/funds/remove/[schemeCode]` - Remove a saved fund

## Database Schema

### User Model
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- timestamps

### SavedFund Model
- userId: ObjectId (reference to User)
- schemeCode: String (required)
- schemeName: String (required)
- fundHouse: String
- savedAt: Date
- timestamps

## External API

This app uses the MF API (https://www.mfapi.in) for mutual fund data:
- Search: `https://api.mfapi.in/mf/search?q={query}`
- Fund Details: `https://api.mfapi.in/mf/{schemeCode}`

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- CORS handling

## Deployment

1. Build the application:
   \`\`\`bash
   npm run build
   \`\`\`

2. Start the production server:
   \`\`\`bash
   npm start
   \`\`\`

For deployment to platforms like Vercel, make sure to:
- Set up environment variables in your deployment platform
- Use MongoDB Atlas for production database
- Update NEXTAUTH_URL to your production domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please check the MF API terms of service for commercial usage.
