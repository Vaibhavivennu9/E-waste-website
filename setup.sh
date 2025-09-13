#!/bin/bash

# E-Waste Website Setup Script
echo "🚀 Setting up E-Waste Collection & Donation Website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB first."
    echo "   Visit: https://docs.mongodb.com/manual/installation/"
fi

echo "📦 Installing root dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🔧 Setting up environment variables..."
cd ../backend
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created .env file. Please update it with your MongoDB connection string and JWT secret."
else
    echo "✅ .env file already exists."
fi

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your MongoDB connection string and JWT secret"
echo "2. Start MongoDB service: mongod"
echo "3. Run the application: npm run dev"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📚 Features included:"
echo "   ✅ User authentication (register/login)"
echo "   ✅ E-waste collection scheduling"
echo "   ✅ Electronic device donations"
echo "   ✅ Dashboard with statistics"
echo "   ✅ Responsive design with Tailwind CSS"
echo "   ✅ MongoDB database integration"
echo "   ✅ RESTful API with Express.js"
echo ""
echo "Happy coding! 🌱"
