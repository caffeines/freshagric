#!/bin/bash
echo "Starting setup server..."
echo ""

docker-compose up -d

echo "Finding freshagric docker container..."

containers=$(docker ps | grep freshagric)
containerInfo=' ' read -r -a array <<<"$containers"
containerID="${array[0]}"

echo "Running production migration..."
docker exec "$containerID" npm run migrate

echo "Health check"
echo ""
curl -s localhost:4400 | json_pp
echo ""
echo ""
echo "Server is ready..."