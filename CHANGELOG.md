# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-18

### Added
- Initial release of no-db-office-chat
- Real-time messaging using Socket.IO
- In-memory message storage with configurable limit (MAX_MESSAGES)
- Clean, responsive web interface
- System notifications for user join/leave events
- REST API endpoint for retrieving messages
- Docker support with Dockerfile and docker-compose.yml
- Systemd service example for Linux deployment
- Graceful shutdown handling (SIGINT, SIGTERM)
- XSS protection with HTML escaping
- Mobile-friendly responsive design
- Connection status indicator
- Message timestamps
- ESLint and Prettier configuration
- Comprehensive documentation and manual test plan

### Security
- HTML escaping to prevent XSS attacks
- Input validation and length limits
- No external CDN dependencies for core functionality

[1.0.0]: https://github.com/yourusername/no-db-office-chat/releases/tag/v1.0.0
