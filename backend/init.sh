#!/bin/bash
echo "⌛ Waiting for Postgres to be ready..."

until pg_isready -h postgres_db -p 5432 > /dev/null 2>&1; do
  sleep 1
done

echo "✅ Postgres is up. Checking if database exists..."

# Kiểm tra database 'ai_mapping' đã tồn tại chưa
DB_EXISTS=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h postgres_db -U $POSTGRES_USER -tAc "SELECT 1 FROM pg_database WHERE datname='ai_mapping'" postgres)

if [ "$DB_EXISTS" != "1" ]; then
  echo "⚠️ Database ai_mapping not found. Creating..."
  PGPASSWORD=$POSTGRES_PASSWORD createdb -h postgres_db -U $POSTGRES_USER ai_mapping
else
  echo "✅ Database ai_mapping already exists."
fi

echo "📂 Running Alembic migrations..."
alembic upgrade head

echo "👤 Init data for database..."
PYTHONPATH=/app python src/db/init_data.py

echo "🤖 Creating default chatbot if not exists..."
PYTHONPATH=/app python src/db/init_chatbot.py

echo "🚀 Starting FastAPI app..."
exec uvicorn src.__init__:app --host 0.0.0.0 --port 8000
