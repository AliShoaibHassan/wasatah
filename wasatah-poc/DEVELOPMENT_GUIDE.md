# Wasatah.app Development Guide

## 🚀 Quick Start (Fixed Issues)

### Problem 1: Terminal Loop Issue
**Issue**: Running `npm run dev` starts both servers and gets stuck in terminal
**Solution**: Use the new `dev:web-only` script

```bash
# Start only the web server (recommended for development)
npm run dev:web-only

# Or start both servers (if you need API)
npm run dev
```

### Problem 2: White Blank Page
**Issue**: Website shows blank page after implementing seed data
**Solution**: Reverted stores to use mock data instead of seed data imports

## 📁 Current Project Status

### ✅ COMPLETED PHASES:
1. **Phase 0.1**: Bootstrap Monorepo & Web App
2. **Phase 0.2**: Tailwind & Base Layout  
3. **Phase 0.3**: TypeScript Models & Stores

### 🔄 WORKING FEATURES:
- ✅ **Web Server**: Running on http://localhost:5173
- ✅ **Login Page**: Basic login form with demo credentials
- ✅ **Role Selection**: Choose between Buyer/Seller/Broker
- ✅ **Navigation**: TopBar with Explorer and About ZK links
- ✅ **Mock Data**: All stores use working mock data
- ✅ **Responsive Design**: TailwindCSS components

### 📱 Available Pages:
- `/` - Login page
- `/login` - Login page  
- `/role` - Role selection
- `/seller` - Seller dashboard (basic)
- `/broker` - Broker dashboard (basic)
- `/buyer` - Buyer dashboard (basic)
- `/explorer` - Blockchain explorer (basic)
- `/about-zk` - About Zero-Knowledge Proofs (basic)

## 🛠️ Development Commands

```bash
# Start web server only (recommended)
npm run dev:web-only

# Start both web and API servers
npm run dev

# Start individual servers
npm run dev:web    # Web server only
npm run dev:api    # API server only

# Build for production
npm run build

# Lint code
npm run lint
```

## 🎯 Demo Credentials

Use any email/password combination - the login is mocked for demo purposes.

## 🔧 Troubleshooting

### If you get a blank page:
1. Check browser console for errors
2. Make sure you're using `npm run dev:web-only`
3. Verify the server is running on http://localhost:5173

### If terminal gets stuck:
1. Press `Ctrl+C` to stop
2. Use `npm run dev:web-only` instead of `npm run dev`

### If you need to restart:
1. Stop the server (`Ctrl+C`)
2. Run `npm run dev:web-only` again

## 📋 Next Steps

The foundation is solid and working. You can now:

1. **Test the current functionality** - Login, role selection, navigation
2. **Choose the next phase** - We can implement any of the remaining phases
3. **Customize the UI** - Modify components, add features, etc.

## 🎨 Current UI Features

- **Modern Design**: Clean, professional interface
- **Responsive**: Works on desktop (mobile deferred)
- **Navigation**: Easy navigation between pages
- **Mock Data**: Realistic demo data for testing
- **Type Safety**: Full TypeScript integration

## 📞 Support

If you encounter any issues:
1. Check this guide first
2. Verify you're using the correct commands
3. Check browser console for errors
4. Make sure all dependencies are installed (`npm install`)

---

**Status**: ✅ **WORKING** - Ready for next phase implementation
