# College Space Python Backend API

FastAPI-powered Python Backend for the CLG Space Campus Marketplace platform.

## Features
- **FastAPI Framework**: Blazing fast, asynchronous REST API.
- **SQLite / PostgreSQL Support**: Embedded SQLite fallback (`collegespace.db`) or PostgreSQL via `DATABASE_URL` in `.env`.
- **CORS Configured**: Plug-and-play with React Vite frontend on port `5173`.
- **Interactive Swagger Documentation**: Available at `http://localhost:8080/docs`.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Backend Server
```bash
python run.py
```
The server will start listening at `http://localhost:8080`.
