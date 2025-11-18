# 💬 Office Chat - Real-time Team Communication

A modern, feature-rich office chat application with real-time messaging, emoji reactions, image sharing, and more. Built with Node.js, Socket.IO, and vanilla JavaScript.

## ✨ Features

### 🚀 Core Features
- **Real-time messaging** with Socket.IO
- **Emoji picker** with 500+ emojis in 9 categories
- **Image sharing** with drag & drop support
- **Message reactions** (Instagram-style)
- **Read receipts** and message status
- **Sound notifications** for new messages
- **Desktop notifications** support
- **Online users list** with avatars

### 🎨 UI/UX
- **Modern gradient design** with glass morphism
- **Fully responsive** (mobile + desktop)
- **Smooth animations** and transitions
- **Dark theme support**
- **Accessibility compliant**

### 🔧 Technical
- **In-memory storage** (no database required)
- **Configurable message limit**
- **Graceful shutdown handling**
- **Docker support** included
- **Production-ready** deployment

## Prerequisites

- Node.js LTS (v18 or higher)
- npm (comes with Node.js)
- Docker (optional, for containerized deployment)

## Quick Start

### Install Dependencies

```bash
cd no-db-office-chat
npm install
```

### Run the Application

```bash
npm start
```

The app will be available at `http://localhost:3000`

### Development Mode (with auto-restart)

First, install nodemon as a dev dependency:

```bash
npm install --save-dev nodemon
```

Then run:

```bash
npm run dev
```

## Configuration

Configure the application using environment variables:

- `PORT` - Server port (default: 3000)
- `MAX_MESSAGES` - Maximum messages to keep in memory (default: 200)

Example:

```bash
PORT=8080 MAX_MESSAGES=500 npm start
```

## Docker Deployment

### Build and Run with Docker

```bash
docker build -t no-db-office-chat .
docker run -p 3000:3000 no-db-office-chat
```

### Using Docker Compose

```bash
docker-compose up -d
```

To stop:

```bash
docker-compose down
```

## Systemd Service (Linux)

An example systemd service file is provided in `deploy/systemd/no-db-office-chat.service`. 

To use it:

1. Edit the file to set correct paths and user
2. Copy to `/etc/systemd/system/`
3. Run: `sudo systemctl enable no-db-office-chat`
4. Run: `sudo systemctl start no-db-office-chat`

## Quick Demo / Manual Test

1. Open your browser to `http://localhost:3000`
2. Enter a username (e.g., "Alice") and click "Join Chat"
3. Open a second browser tab or incognito window
4. Join as a different user (e.g., "Bob")
5. Send messages from both tabs and watch them appear in real-time
6. Close one tab and see the "left" notification in the other

## API Endpoints

- `GET /messages` - Retrieve recent messages as JSON
- `GET /` - Serve the web application
- WebSocket endpoint for real-time communication

## Security Notes

**Important**: This application is designed for internal office use and demonstration purposes.

For production deployment, consider:

- Adding user authentication (JWT, OAuth, etc.)
- Using a persistent database (PostgreSQL, MongoDB) or Redis
- Implementing rate limiting
- Enabling HTTPS/TLS
- Adding message validation and sanitization
- Implementing user permissions and moderation
- Adding logging and monitoring

## Project Structure

```
no-db-office-chat/
├── server.js              # Backend server with Socket.IO
├── package.json           # Dependencies and scripts
├── .gitignore            # Git ignore rules
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration
├── LICENSE               # MIT License
├── CHANGELOG.md          # Version history
├── make-release.sh       # Release packaging script
├── public/               # Frontend files
│   ├── index.html        # Main HTML page
│   ├── styles.css        # Styling
│   ├── app.js            # Client-side JavaScript
│   ├── favicon.ico       # Favicon placeholder
│   └── assets/           # Logo and images
├── docker/               # Docker configuration
│   ├── Dockerfile        # Production Docker image
│   └── docker-compose.yml
├── deploy/               # Deployment configurations
│   └── systemd/
│       └── no-db-office-chat.service
└── test/                 # Testing documentation
    └── manual-test-plan.md
```

## License

MIT License - see LICENSE file for details

## Changelog

See CHANGELOG.md for version history and updates.
