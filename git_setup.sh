#!/bin/bash

# Initial setup for old Delilah directory
cd /d/delilah
git add .
git commit -m "chore: final commit before V3 restructure"
git push origin main

# Setup for V3.0
cd /d/delilah_V3.0

# Initialize new git repo
git init

# Add all files
git add .

# Initial commit
git commit -m "feat: initial V3.0 structure with Demographics section"

# Add remote (you'll need to update this URL)
git remote add origin https://github.com/yourusername/delilah.git

# Create and switch to V3 branch
git checkout -b v3-restructure

# Push to remote with upstream tracking
git push -u origin v3-restructure

# Create .gitignore
echo "node_modules/
.next/
build/
dist/
.env
.env.local
.DS_Store
coverage/
*.log" > .gitignore