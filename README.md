# Quiz Backend

A Node.js/Express backend for a quiz application with user authentication and quiz management.

## Features

- User registration and authentication with JWT
- Quiz question management
- Quiz attempts tracking
- RESTful API endpoints
- PostgreSQL database with Supabase
- TypeScript support

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Supabase)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd quiz-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Generate a JWT secret
```bash
npm run generate-secret
# Copy the generated secret to your .env file
```

5. Set up the database
```bash
npm run db:setup
```

6. Start development server
```bash
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-generated-secret
CORS_ORIGIN=https://your-frontend-domain.com
NODE_ENV=development
PORT=3000
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/questions` - Get questions
- `POST /api/questions` - Create question
- `POST /api/quiz/start` - Start quiz
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /test` - Health check
- `GET /test-db` - Database connection test

## Database Schema

The application uses PostgreSQL with the following tables:
- `users` - User accounts
- `questions` - Quiz questions
- `quiz_attempts` - Quiz sessions
- `quiz_answers` - Individual answers

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Render with Supabase.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run init-db` - Initialize database schema and seed data
- `npm run generate-secret` - Generate secure JWT secret

## License

ISC
