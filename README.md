# Cases App - Frontend

React-based frontend application for the Legal Marketplace platform. This is a two-sided marketplace where clients post legal cases and lawyers submit quotes.

## 🚀 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Stripe Elements** - Payment UI components
- **Pusher JS** - Real-time payment status updates

## 📋 Prerequisites

- Node.js 18+ and npm installed
- Backend API running (see `../server/README.md`)

## 🛠️ Setup Instructions

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your values:**
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   VITE_PUSHER_KEY=your_pusher_key
   VITE_PUSHER_CLUSTER=ap1
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   └── PrivateRoute.jsx # Protected route wrapper
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── client/          # Client-specific pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateCase.jsx
│   │   │   ├── CaseDetail.jsx
│   │   │   └── PaymentProcessing.jsx
│   │   ├── lawyer/          # Lawyer-specific pages
│   │   │   ├── Marketplace.jsx
│   │   │   ├── MarketplaceCaseDetail.jsx
│   │   │   └── MyQuotes.jsx
│   │   ├── Landing.jsx      # Landing page
│   │   ├── Login.jsx         # Login page
│   │   ├── SignupClient.jsx # Client registration
│   │   └── SignupLawyer.jsx # Lawyer registration
│   ├── services/            # API service layer
│   │   └── api.js           # API client with axios
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite configuration
```

## 🔄 User Flows

### Client Flow
1. Sign up as Client
2. Create Case (title, category, description, upload files)
3. View My Cases (dashboard with status and quote counts)
4. Review Quotes (see all quotes for a case)
5. Accept & Pay (select quote, complete Stripe checkout)
6. After payment: case status changes to `engaged`

### Lawyer Flow
1. Sign up as Lawyer (name, email, password; optional: jurisdiction, bar number)
2. Browse Marketplace (anonymized open cases with filters)
3. Submit Quote (amount, expected days, note)
4. View My Quotes (filter by status: proposed/accepted/rejected)
5. If accepted and case engaged: access case details and download files

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api/v1` |
| `VITE_PUSHER_KEY` | Pusher app key (for real-time updates) | `a3edf75041c3993d3ab6` |
| `VITE_PUSHER_CLUSTER` | Pusher cluster | `ap1` |

## 🚢 Deployment

### Vercel Deployment (Recommended)

See detailed guide: [`VERCEL_DEPLOYMENT.md`](VERCEL_DEPLOYMENT.md)

**Quick Steps:**
1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Set **Root Directory** to `client` in project settings
4. Add environment variables in Vercel:
   - `VITE_API_URL` - Your backend API URL
   - `VITE_PUSHER_KEY` - Pusher app key
   - `VITE_PUSHER_CLUSTER` - Pusher cluster (e.g., `ap1`)
5. Deploy!

### Manual Deployment

1. Build for production:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables in your hosting platform

## 🔐 Authentication

The app uses JWT-based authentication. Tokens are stored in localStorage and automatically included in API requests via the `api.js` service layer.

## 📡 API Integration

All API calls are centralized in `src/services/api.js`. The service handles:
- Base URL configuration
- JWT token injection
- Error handling
- Request/response interceptors

## 🎨 Styling

- Global styles in `src/index.css`
- Component-specific styles in `src/App.css`
- Inline styles used for component-specific styling

## 🐛 Troubleshooting

### CORS Issues
- Ensure backend CORS is configured to allow your frontend URL
- Check that `VITE_API_URL` matches your backend URL

### Authentication Issues
- Verify JWT token is being stored in localStorage
- Check that backend JWT secret matches
- Ensure token hasn't expired

### API Connection Issues
- Verify `VITE_API_URL` is correct
- Check that backend server is running
- Review browser console for error messages

## 📄 License

This project is created for the Sibyl Full-Stack Technical Test.
