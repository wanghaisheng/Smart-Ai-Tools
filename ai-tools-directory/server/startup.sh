#!/bin/sh

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
timeout=60
counter=0
while ! nc -z $MONGODB_HOST 27017; do
  counter=$((counter+1))
  if [ $counter -eq $timeout ]; then
    echo "Failed to connect to MongoDB. Exiting..."
    exit 1
  fi
  echo "MongoDB is unavailable - sleeping"
  sleep 1
done

echo "MongoDB is up - executing command"

# Start the application
node index.js
