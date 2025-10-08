# Progress Photos App

A web application for organizing progress photos with metadata and custom directory structure.

## Features

- 📸 **Photo Upload**: Drag and drop or select multiple photos
- 📅 **Date Organization**: Automatically organizes photos by year/month/day
- 🏷️ **Custom Naming**: Give photos meaningful names
- 📝 **Descriptions**: Add detailed descriptions with automatic TXT file generation
- 🗂️ **Clean Filenames**: No UUIDs, just clean custom names
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎨 **Modern UI**: Clean, intuitive interface

## Directory Structure

Photos are automatically organized in this structure:
```
J80-Progress/
├── 2025/
│   ├── 01/          # January
│   │   ├── 15/      # 15th day
│   │   │   ├── Clarifier_No_1.jpg
│   │   │   └── Clarifier_No_1_description.txt
│   └── 02/          # February
└── thumbnails/      # Auto-generated thumbnails
```

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**: Go to `http://localhost:3000`

## Deployment

This app is designed to work both locally and on Vercel:

- **Local**: Saves photos to custom directory structure
- **Vercel**: Uses cloud storage (configure your preferred storage solution)

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Sharp** - Image processing
- **Lucide React** - Icons

## Usage

1. **Upload Photos**: Drag and drop or click to select
2. **Add Metadata**: 
   - Custom Name: "Foundation Work - Day 1"
   - Date Taken: Set the actual photo date
   - Description: "Concrete pour progress"
3. **Organize**: Photos automatically save to date-based folders
4. **Manage**: View, download, or delete photos

## File Features

- **Clean Filenames**: `Clarifier_No_1.jpg` (no UUIDs)
- **Description Files**: Auto-generated TXT files with photo details
- **Thumbnails**: Automatic thumbnail creation for fast loading
- **Metadata**: Complete photo information tracking

## License

MIT License
