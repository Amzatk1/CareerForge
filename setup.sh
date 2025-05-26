#!/bin/bash

echo "🔥 Setting up CareerForge AI..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file for backend
echo "📝 Creating environment file..."
if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env file. Please update it with your API keys."
else
    echo "⚠️  backend/.env already exists. Skipping..."
fi

# Create environment file for frontend
echo "📝 Creating frontend environment file..."
if [ ! -f mobile-app/.env ]; then
    echo "EXPO_PUBLIC_API_URL=http://localhost:8000/api" > mobile-app/.env
    echo "✅ Created mobile-app/.env file."
else
    echo "⚠️  mobile-app/.env already exists. Skipping..."
fi

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 10

# Run Django migrations
echo "🗄️  Running database migrations..."
docker-compose exec backend python manage.py migrate

# Create superuser (optional)
echo "👤 Would you like to create a Django superuser? (y/n)"
read -r create_superuser
if [ "$create_superuser" = "y" ] || [ "$create_superuser" = "Y" ]; then
    docker-compose exec backend python manage.py createsuperuser
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 Frontend (React Native): http://localhost:19006"
echo "🔧 Backend API: http://localhost:8000"
echo "🔐 Django Admin: http://localhost:8000/admin"
echo ""
echo "📚 Next steps:"
echo "1. Update backend/.env with your OpenAI API key"
echo "2. Open the Expo app on your phone and scan the QR code"
echo "3. Start building your career roadmap!"
echo ""
echo "🛑 To stop the services: docker-compose down" 