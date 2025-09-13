@echo off
echo 🚀 Setting up E-Waste Collection ^& Donation Website...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo 📦 Installing root dependencies...
npm install

echo 📦 Installing backend dependencies...
cd backend
npm install

echo 📦 Installing frontend dependencies...
cd ..\frontend
npm install

echo 🔧 Setting up environment variables...
cd ..\backend
if not exist .env (
    copy env.example .env
    echo ✅ Created .env file. Please update it with your MongoDB connection string and JWT secret.
) else (
    echo ✅ .env file already exists.
)

echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Update backend\.env with your MongoDB connection string and JWT secret
echo 2. Start MongoDB service
echo 3. Run the application: npm run dev
echo.
echo 🌐 The application will be available at:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo 📚 Features included:
echo    ✅ User authentication (register/login)
echo    ✅ E-waste collection scheduling
echo    ✅ Electronic device donations
echo    ✅ Dashboard with statistics
echo    ✅ Responsive design with Tailwind CSS
echo    ✅ MongoDB database integration
echo    ✅ RESTful API with Express.js
echo.
echo Happy coding! 🌱
pause
