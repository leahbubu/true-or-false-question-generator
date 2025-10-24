# True/False Question Generator

An AI-powered web application that generates high-quality true/false quiz questions from multiple content sources including text, URLs, PDFs, and YouTube videos.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)

## Quick Links

- [Installation & Local Development](#installation)
- [Deploy to GitHub Pages](DEPLOYMENT.md) - Host your own instance
- [Usage Guide](#usage)
- [API Documentation](#api-endpoints)

## Features

- **Multi-Source Input**: Generate questions from:
  - Direct text input
  - Web URLs (articles, blog posts, documentation)
  - PDF documents
  - YouTube video transcripts

- **AI-Powered**: Uses Claude AI (Anthropic) to generate contextually relevant questions with detailed explanations

- **Customizable**:
  - Choose number of questions (1-20)
  - Select difficulty level (Easy, Medium, Hard)

- **Interactive Quiz Interface**:
  - Take quizzes immediately after generation
  - Get instant feedback with explanations
  - Track your progress and score
  - Export questions as JSON

- **Modern Tech Stack**:
  - React + TypeScript frontend
  - Express + TypeScript backend
  - Tailwind CSS for styling
  - Vite for fast development

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Anthropic API Key** - Get one from [Anthropic Console](https://console.anthropic.com/)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/true-or-false-question-generator.git
   cd true-or-false-question-generator
   ```

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```
   This will install dependencies for both the root, client, and server workspaces.

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file and add your Anthropic API key:
   ```env
   PORT=3001
   NODE_ENV=development
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   CLIENT_URL=http://localhost:5173
   ```

## Development

To run the application in development mode:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:5173`

The frontend will automatically proxy API requests to the backend.

### Running Separately

If you need to run the frontend and backend separately:

**Backend only**:
```bash
npm run dev:server
```

**Frontend only**:
```bash
npm run dev:client
```

## Production Build

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

The server will serve both the API and the built frontend files.

## Deployment

To deploy this application to GitHub Pages and host it online:

1. See the comprehensive [**DEPLOYMENT.md**](DEPLOYMENT.md) guide for step-by-step instructions
2. Frontend: Deploy to GitHub Pages (free, included in guide)
3. Backend: Deploy to Railway, Render, or Heroku (free tiers available)

The deployment guide covers:
- Automatic deployment with GitHub Actions
- Backend hosting options (Railway, Render, Heroku, Vercel)
- Environment configuration
- Connecting frontend to backend
- Troubleshooting tips

## Usage

### 1. Text Input

1. Select the "Text" option
2. Paste your content into the text area
3. Configure number of questions and difficulty
4. Click "Generate Questions"

### 2. URL Input

1. Select the "URL" option
2. Enter a valid website URL
3. Configure settings
4. Click "Generate Questions"

The app will extract the main content from the webpage and generate questions.

### 3. PDF Upload

1. Select the "PDF" option
2. Click to upload or drag and drop a PDF file
3. Configure settings
4. Click "Generate Questions"

### 4. YouTube Video

1. Select the "YouTube" option
2. Enter a YouTube video URL
3. Configure settings
4. Click "Generate Questions"

**Note**: Only videos with available transcripts can be processed.

## API Endpoints

### POST `/api/generate/text`
Generate questions from plain text.

**Request Body**:
```json
{
  "content": "Your text content here",
  "numberOfQuestions": 5,
  "difficulty": "medium"
}
```

### POST `/api/generate/url`
Generate questions from a URL.

**Request Body**:
```json
{
  "url": "https://example.com/article",
  "numberOfQuestions": 5,
  "difficulty": "medium"
}
```

### POST `/api/generate/pdf`
Generate questions from a PDF file.

**Request**: `multipart/form-data`
- `file`: PDF file
- `numberOfQuestions`: Number (1-20)
- `difficulty`: String ("easy" | "medium" | "hard")

### POST `/api/generate/youtube`
Generate questions from a YouTube video.

**Request Body**:
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "numberOfQuestions": 5,
  "difficulty": "medium"
}
```

## Project Structure

```
true-or-false-question-generator/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service functions
│   │   ├── types.ts       # TypeScript types
│   │   ├── App.tsx        # Main App component
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                # Backend Express application
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   │   ├── contentExtractor.ts
│   │   │   └── questionGenerator.ts
│   │   ├── types/         # TypeScript types
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── .env.example           # Environment variables template
├── .gitignore
├── package.json           # Root package.json
└── README.md
```

## Technologies Used

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### Backend
- **Express** - Web framework
- **TypeScript** - Type safety
- **Anthropic SDK** - Claude AI integration
- **pdf-parse** - PDF text extraction
- **cheerio** - HTML parsing for URL content
- **youtube-transcript** - YouTube transcript extraction
- **multer** - File upload handling

## Troubleshooting

### API Key Issues
- Ensure your Anthropic API key is correctly set in the `.env` file
- Check that the `.env` file is in the root directory
- Verify your API key has sufficient credits

### YouTube Transcript Errors
- Not all YouTube videos have transcripts available
- Try using videos with auto-generated captions
- Ensure the video is public and not age-restricted

### PDF Processing Issues
- Ensure the PDF contains extractable text (not just images)
- Large PDFs may take longer to process
- Scanned PDFs without OCR won't work

### URL Extraction Issues
- Some websites block scraping
- Pages with heavy JavaScript may not extract properly
- Try different URLs or use the text input option

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Powered by [Claude AI](https://www.anthropic.com/) from Anthropic
- Built with [React](https://react.dev/) and [Express](https://expressjs.com/)
- UI styled with [Tailwind CSS](https://tailwindcss.com/)

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Quiz Creating!** 🎓✨
