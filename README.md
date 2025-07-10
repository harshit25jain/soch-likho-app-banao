# Soch Likho - AI App Generator (Fullstack)

A fullstack AI-powered platform to generate, preview, and deploy production-ready web apps from text prompts. Built for modern SaaS experience.

---

## Features

- 🤖 **AI-Powered Code Generation** - Uses Groq API (Llama 3) to generate complete, functional React/Vue/Next.js/Vanilla apps from text prompts
- ⚡ **Quick Start Apps** - Instant hardcoded apps for Todo, Calculator, Timer, Weather, and Notes
- 🖥️ **Modern SaaS UI** - Responsive, beautiful frontend with sidebar, overlays, and live preview
- 🚀 **One-Click Netlify Deployment** - Deploy generated apps to Netlify with real-time status and live redirect
- 👤 **User Authentication** - JWT-based authentication with user management
- 📊 **Analytics & Statistics** - Track app generation, deployments, and user activity
- 🔧 **Multiple Frameworks** - React, Vue, Next.js, Vanilla JS
- 🎨 **Tailwind CSS** - All generated apps use modern, responsive design
- 📱 **Mobile-Ready** - Fully responsive, sidebar drawer on mobile
- 🔒 **Security** - Rate limiting, input validation, secure authentication

---

## Tech Stack

- **Frontend:** React (Next.js), Tailwind CSS, Sandpack (live code preview)
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **AI Integration:** Groq API (Llama 3)
- **Deployment:** Netlify API
- **Authentication:** JWT, bcrypt
- **Other:** Winston (logging), Express-validator, Helmet, CORS

---

## Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- Groq API key (https://console.groq.com/)
- Netlify account, site, and API token

---

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Soch-Likho-App-Banao
   ```

2. **Install dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. **Set up environment variables**
   - In `/server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/soch-likho
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   GROQ_API_KEY=your-groq-api-key
   NETLIFY_ACCESS_TOKEN=your-netlify-access-token
   NETLIFY_SITE_ID=your-netlify-site-id
   ```

4. **Start the servers**
   ```bash
   # In /server
   npm run dev
   # In /client
   npm run dev
   ```

---

## How It Works (User Flow)

1. **Prompt:** User enters a prompt (e.g., "Create a todo app") and clicks Generate.
2. **Quick Start:** If the prompt matches a hardcoded app (todo, calculator, etc.), it is served instantly.
3. **AI Generation:** For all other prompts, the backend uses Groq (Llama 3) to generate code and summary.
4. **Preview:** The frontend shows a live preview and code viewer (Sandpack) for the generated app.
5. **Deploy:** User clicks Deploy. A full-page overlay appears (with your theme), and the backend deploys the app to Netlify.
6. **Polling:** The frontend polls for deployment status. When live, the user is redirected to the real Netlify URL.

---

## Demo Flow (for Hackathon Judges)

1. **Open the app.**
2. **Try a quick start idea** (e.g., "Create a todo app"). See instant preview and code.
3. **Enter a custom prompt** (e.g., "Create a Pomodoro timer with sound alerts"). See AI-generated app and code.
4. **Click Deploy.** Watch the overlay and spinner. When done, you are redirected to the live Netlify app.
5. **Sidebar:** See your recent apps and their deployment status.
6. **Mobile:** Open on mobile to see the responsive sidebar drawer.

---

## Environment Variables

| Variable              | Description                | Required |
|-----------------------|----------------------------|----------|
| `PORT`                | Server port                | No (default: 5000) |
| `NODE_ENV`            | Environment mode           | No (default: development) |
| `MONGODB_URI`         | MongoDB connection string  | Yes |
| `JWT_SECRET`          | JWT signing secret         | Yes |
| `JWT_EXPIRES_IN`      | JWT expiration time        | No (default: 7d) |
| `GROQ_API_KEY`        | Groq API key               | Yes |
| `NETLIFY_ACCESS_TOKEN`| Netlify API token          | Yes |
| `NETLIFY_SITE_ID`     | Netlify site ID            | Yes |

---

## API Endpoints (Backend)

- `POST /api/apps/generate` - Generate new app (hardcoded or AI)
- `GET /api/apps/:id` - Get app details
- `POST /api/deployment/deploy` - Deploy app to Netlify
- `GET /api/deployment/:appId/status` - Get deployment status

---

## Security Features

- JWT authentication, bcrypt password hashing
- Rate limiting, input validation, CORS, Helmet
- Error handling and logging

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## License

MIT License - see LICENSE file for details

---

## Support

For support and questions, please open an issue in the repository. 