# File Manager App

A secure and user-friendly File Manager web application built with **Next.js 14 (App Router)**, **Tailwind CSS**, **NextAuth.js**, and **Supabase**.

Users can register, log in, and manage their own folders and files — including uploading, previewing, renaming, and deleting.

---

## Features

### Core Functionality

-  **User Authentication** (Sign Up, Sign In, Logout)
-  **Protected Routes** (Only logged-in users can access dashboard/API)
-  **Folder Management**
    - Create new folders
    - Rename and delete folders
-  **File Management**
    - Upload files to specific folders
    - List files per folder
    - Rename and delete files
    - Preview PDFs & images
-  **User-specific Storage**
    - Each user only sees and manages their own files and folders
-  **Responsive UI**
    - Clean layout for mobile and desktop

---

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** for styling
- **NextAuth.js** for authentication
- **Supabase**
    - Database for folders/files metadata
    - Storage for actual files
  
---

##  Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/arsumelahi21/file-manager.git
cd file-manager
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

This project uses **Supabase for both database and file storage**.

> A working `.env` file is **included** in the project to simplify setup.  
> You only need to ensure your Supabase project matches the structure (tables, policies).


### 4. Run the App

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

---

##  Notes

* Files are **not** stored in the database — only metadata like path/name/user\_id.
* All routes are protected with `getUserSession` to avoid unauthorized access.
* RLS ensures users only access their own files/folders.
* Fully responsive UI built with Tailwind CSS.

---
