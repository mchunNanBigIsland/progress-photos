# Progress Photos

A modern web application for organizing and managing progress photos with metadata. Upload photos with custom names, descriptions, and automatic date-based folder organization.

## Features

- 📸 **Photo Upload**: Drag-and-drop interface with preview
- 🏷️ **Custom Metadata**: Add custom names and descriptions to photos
- 📅 **Date Organization**: Automatic folder structure based on photo dates
- 🖼️ **Photo Gallery**: View and manage uploaded photos
- 🔍 **Search & Filter**: Find photos by name, description, or date
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⬇️ **Download**: Download individual photos with original names
- 🗑️ **Delete**: Remove photos from the system

## Technology Stack

- **Frontend**: React with TypeScript
- **Backend**: Next.js API routes
- **Database**: SQLite
- **File Processing**: Sharp for image optimization
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd progress-photos
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy automatically with Vercel's GitHub integration

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

## Project Structure

```
progress-photos/
├── app/
│   ├── api/                 # API routes
│   │   ├── upload/          # Photo upload endpoint
│   │   ├── photos/          # Get all photos
│   │   ├── image/[id]/      # Serve images
│   │   ├── download/[id]/   # Download photos
│   │   └── delete/[id]/     # Delete photos
│   ├── components/          # React components
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── lib/                     # Utility functions
│   ├── database.ts          # Database operations
│   └── fileUtils.ts         # File handling utilities
├── types/                   # TypeScript types
└── uploads/                 # Photo storage (auto-created)
    ├── YYYY/MM/DD/         # Date-based folders
    └── thumbnails/          # Thumbnail images
```

## API Endpoints

- `POST /api/upload` - Upload photos with metadata
- `GET /api/photos` - Get all photos
- `GET /api/image/[id]` - Serve image files
- `GET /api/download/[id]` - Download photo
- `DELETE /api/delete/[id]` - Delete photo

## File Organization

Photos are automatically organized into date-based folders:
```
uploads/
├── 2024/
│   ├── 01/
│   │   ├── 15/
│   │   │   ├── project_photo_1.jpg
│   │   │   └── progress_photo_2.jpg
│   │   └── 16/
│   └── 02/
└── thumbnails/
    ├── photo_id_1.jpg
    └── photo_id_2.jpg
```

## Environment Variables

No environment variables are required for basic functionality. The app uses SQLite for local development and can be configured for production databases.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
