# Peblo TV Mini

Peblo TV Mini is a full-stack OTT-style content management and browsing application built for the Peblo Full Stack Development Challenge.

The project contains a FastAPI backend, an internal React CMS, and a separate React viewer interface. The CMS allows content to be managed through REST APIs, while the viewer provides an OTT-style browsing experience.

## Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic

### Frontend
- React
- JavaScript
- Vite
- CSS

### Tools
- Git
- GitHub
- VS Code
- npm

## Project Structure

```text
peblo-tv-mini/
├── backend/       # FastAPI backend
├── cms/           # Internal content management UI
├── viewer/        # Viewer-facing React application
└── README.md
```

## Implemented Features

### Backend
- FastAPI REST API
- Database integration using SQLAlchemy
- Show CRUD operations
- Create, read, update and delete shows
- Featured-content management
- Database health endpoint
- CORS configuration
- Models for shows, seasons, episodes and publish runs

### Internal CMS
- Separate CMS interface for content management
- Add new shows
- Edit existing shows
- Delete shows
- Feature/unfeature content
- Poster and video URL management
- Loading and empty states
- Content library view

### Viewer
- OTT-style responsive interface
- Dynamic featured-content hero
- Browse available shows
- Movies and TV Shows navigation
- Show-details modal
- My List functionality
- Poster rendering and fallback states
- Featured-content indicators
- Video URL support

## Running the Project

### 1. Backend

Navigate to the backend directory:

```bash
cd backend
```

Activate the Python virtual environment and install the required dependencies if necessary.

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

Database health check:

```text
http://127.0.0.1:8000/health/database
```

### 2. Viewer

```bash
cd viewer
npm install
npm run dev
```

Open the URL displayed by Vite in the terminal.

### 3. CMS

```bash
cd cms
npm install
npm run dev
```

Open the CMS URL displayed by Vite.

## Architecture

The application is divided into three primary layers:

```text
Internal CMS
     |
     v
FastAPI REST API
     |
     v
PostgreSQL / SQLAlchemy
     |
     v
Viewer Application
```

Keeping the CMS and viewer separate makes their responsibilities clear. The CMS is designed for content-management operations, while the viewer focuses on consuming and presenting content.

## Decisions and Trade-offs

### Atomic Publishing

The challenge specification proposes generating a pre-published catalogue file atomically so that viewers never receive a partially written catalogue.

In the current implementation, the viewer consumes backend data directly and the complete atomic catalogue publishing pipeline was not finished within the available assessment time.

For a production implementation, I would generate the catalogue into a temporary/versioned object first, validate it completely, and only then atomically switch the live catalogue reference to the completed version. If the publishing process failed midway, the existing published catalogue would remain unchanged.

### Storage Abstraction

The current implementation uses URLs for artwork rather than completing the requested upload/storage abstraction.

For production, I would introduce a storage interface with operations such as upload, read, delete and publish. A local filesystem implementation could be used during development and replaced with a Cloudflare R2 implementation without changing the CMS or catalogue business logic.

The R2 implementation would primarily replace filesystem operations with S3-compatible object-storage operations and use environment-based credentials.

### Search and Scale

The current viewer performs lightweight client-side filtering suitable for the small demonstration dataset.

For a larger production catalogue, search should be moved to the backend using indexed database queries or a dedicated search engine. As catalogue size and query complexity increase, downloading and searching the entire catalogue in the browser would become inefficient.

### Why a Published Catalogue?

A pre-published catalogue can keep viewer reads fast, predictable and independent from expensive database queries. It also provides a stable snapshot of content that has passed publishing validation.

The trade-off is additional publishing complexity. Updates are not immediately visible until a successful publish occurs, and versioning, atomic replacement and failure recovery need to be handled carefully.

## Validation and Production Considerations

The complete artwork validation pipeline described in the challenge — including poster, banner and thumbnail dimension/aspect-ratio checks and the 200 KB limit — was not completed.

A production implementation would enforce these rules on the backend rather than relying only on client-side validation and return editor-friendly messages explaining exactly why an upload was rejected.

Similarly, editor/admin authorization should be enforced server-side before CRUD and publishing operations.

## What I Left Out and Why

I prioritized delivering a working end-to-end full-stack prototype within the available assessment time.

The following challenge requirements were not fully completed:

- Atomic `catalogue.json` publishing
- Full artwork upload and dimension/file-size validation
- Complete editor/admin authentication and authorization
- `content_group` language-variant collapsing
- Full validation-report workflow
- Production-ready catalogue search endpoint
- Docker Compose environment
- Complete CI/CD workflow
- Automated test coverage
- Full seed-data processing pipeline

Given additional time, I would prioritize the publishing pipeline, backend validation, role enforcement and automated tests first because they carry the highest correctness and operational risk.

## AI Usage

AI assistance was used during development for implementation guidance, debugging, code review, and structuring parts of the project.

I reviewed the generated suggestions before applying them and adjusted or rejected suggestions when they did not match the existing application structure or caused integration issues. The final implementation was tested through the running CMS, viewer and backend rather than assuming generated code was correct.

## Time Spent

Approximate development effort:

- Backend/API and database setup: 3–4 hours
- CMS implementation and integration: 2–3 hours
- Viewer implementation and integration: 2–3 hours
- Debugging, testing and documentation: 2–3 hours

## Future Improvements

With additional development time, the next priorities would be:

1. Complete atomic catalogue publishing
2. Import and validate the supplied seed dataset
3. Implement artwork upload/storage abstraction
4. Add server-side search and composed filters
5. Implement editor/admin authentication and authorization
6. Add validation report and publish history
7. Add Docker Compose and GitHub Actions
8. Add automated API and publishing tests

## Author

**Akshay Deshmukh**

GitHub: `akshaydeshmukh12345`

Project Repository: `akshaydeshmukh12345/peblo-tv-mini`