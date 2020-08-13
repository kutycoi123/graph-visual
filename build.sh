#!/bin/bash
cd frontend
node server.js &
cd ../backend/python-service
python3 app.py &
cd ../go-service
go run app.go &
