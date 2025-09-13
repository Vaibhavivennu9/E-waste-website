# 🌱 E-Waste Collection & Donation Website

A comprehensive platform for collecting and donating electronic waste to promote environmental sustainability and bridge the digital divide.

## ✨ Features

- **🔄 E-waste Collection**: Schedule convenient pickups for electronic waste
- **❤️ Donation System**: Donate working electronics to those in need
- **🔐 User Authentication**: Secure login and registration with JWT
- **📊 Dashboard**: Track your environmental impact and activities
- **📍 Location Services**: Manage pickup addresses and locations
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **👥 User Roles**: Support for users, collectors, and administrators

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT tokens with bcrypt password hashing
- **UI Components**: Lucide React icons, React Hook Form
- **Styling**: Tailwind CSS with custom components

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd e-waste-website
```

2. **Install dependencies**
```bash
# Install all dependencies (root, backend, frontend)
npm run install-all
```

3. **Set up environment variables**
```bash
# Copy the example environment file
cp backend/env.example backend/.env

# Edit backend/.env with your configuration:
# MONGODB_URI=mongodb://localhost:27017/ewaste
# JWT_SECRET=your_super_secret_jwt_key_here
# PORT=5000
```

4. **Start the development servers**
```bash
npm run dev
```

This will start:
- Backend API server on http://localhost:5000
- Frontend React app on http://localhost:3000

## 📁 Project Structure

```
e-waste-website/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts (Auth)
│   │   └── App.js           # Main app component
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js backend API
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Authentication middleware
│   └── server.js           # Main server file
├── package.json            # Root package configuration
└── README.md               # This file
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/ewaste
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
PORT=5000
NODE_ENV=development
```

## 📋 Available Scripts

- `npm run dev` - Start both frontend and backend servers
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend server
- `npm run install-all` - Install dependencies for all projects

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Collections
- `POST /api/collections` - Create collection request
- `GET /api/collections` - Get user's collections
- `PUT /api/collections/:id/status` - Update collection status

### Donations
- `POST /api/donations` - Create donation
- `GET /api/donations` - Get available donations
- `PUT /api/donations/:id/reserve` - Reserve donation

## 🎨 Features Overview

### For Users
- Register and manage account
- Schedule e-waste collection pickups
- Donate working electronic devices
- Track collection and donation history
- View environmental impact dashboard

### For Collectors/Admins
- Manage collection requests
- Update pickup status
- Assign collectors to requests
- View all user activities

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Protected routes and API endpoints
- Role-based access control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for environmental sustainability
- Inspired by the need to bridge the digital divide
- Thanks to the open-source community for amazing tools

---

**Made with 🌱 for a greener future**
