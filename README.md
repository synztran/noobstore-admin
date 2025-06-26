# NoobStore CMS

A modern, responsive Content Management System (CMS) for e-commerce stores built with React, TypeScript, Vite, DaisyUI, and TailwindCSS.

## Features

- 🔐 **Authentication System**: Secure login with cookie-based session management
- 🎨 **Modern UI**: Beautiful and responsive design using DaisyUI components
- 🌙 **Dark/Light Theme**: Toggle between light and dark themes
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 🧭 **Navigation**: Collapsible sidebar with smooth animations
- 📊 **Dashboard**: Overview with statistics and quick actions
- 📦 **Product Management**: Create, edit, and manage products
- 🛒 **Order Management**: Track and manage customer orders
- 👥 **Customer Management**: Manage customer information
- 📈 **Analytics**: View store statistics and performance
- ⚙️ **Settings**: Configure store settings and preferences
- 🔒 **Role-based Access**: Different permissions for admin and editor roles

## Tech Stack

- **Vite** - Fast build tool and development server
- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Component library for TailwindCSS
- **React Router** - Client-side routing
- **js-cookie** - Cookie management for authentication

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd noobstore-web-admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Available Scripts

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Sidebar navigation
│   ├── Layout.tsx      # Main layout wrapper
│   └── ProtectedRoute.tsx # Authentication guard
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Dashboard.tsx   # Dashboard page
│   └── Products.tsx    # Products management page
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles with TailwindCSS
```

## Authentication

The application includes a complete authentication system:

### Demo Credentials

- **Admin User**: `admin@noobstore.com` / `admin123`
- **Editor User**: `editor@noobstore.com` / `editor123`

### Features

- Cookie-based session management
- Role-based access control
- Protected routes
- Automatic redirect to login for unauthenticated users

## Components

### Layout Components

- **Header**: Top navigation with search, notifications, theme toggle, and user profile
- **Sidebar**: Collapsible navigation menu with role-based access
- **Layout**: Main layout wrapper that combines header and sidebar

### Authentication

- **Login Page**: Beautiful login form with validation
- **Protected Routes**: Automatic authentication checks
- **Auth Context**: Global authentication state management

## Styling

The project uses a combination of TailwindCSS and DaisyUI:

- **TailwindCSS**: Utility classes for layout and styling
- **DaisyUI**: Pre-built components and themes
- **Custom CSS**: Additional styles in `index.css`

### Themes

The application supports multiple themes:
- Light theme (default)
- Dark theme
- Corporate theme

## Customization

### Adding New Pages

To add a new page to the CMS:

1. Create a new component in `src/pages/`
2. Add a route in `src/App.tsx`
3. Add a menu item in `src/components/Sidebar.tsx`

### Styling Customization

- Modify `tailwind.config.js` to customize TailwindCSS
- Update `src/index.css` for global styles
- Use DaisyUI theme customization in the config

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy to Various Platforms

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your repository for automatic deployment
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload the `dist` folder to an S3 bucket

## Security Considerations

- In production, implement proper JWT token management
- Use secure, httpOnly cookies for authentication
- Implement proper CORS policies
- Add rate limiting for login attempts
- Use HTTPS in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
