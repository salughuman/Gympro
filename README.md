# GymPro

A modern Gym Management System built with React and Electron. This repository contains the completely refactored, modularized source code along with the compiled, ready-to-use software executable.

## How to Download and Run the App

Instead of building the software manually, a portable, pre-compiled application is provided directly in this repository for easy access!

1. Download the `GymPro-Portable.7z` file from this repository or clone the repo.
2. Extract the `.7z` archive using [7-Zip](https://www.7-zip.org/) or [WinRAR](https://www.win-rar.com).
3. Open the extracted folder and double-click `GymPro.exe` to run the GymPro application natively on Windows. No installation required!

*(Note: Due to GitHub's strict 100MB file limit, the single setup installer was compressed into a portable `.7z` 7-Zip archive which bypasses standard installation, giving you instant access).*

## Development

If you wish to modify the code and build it yourself:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Dev Mode (Hot-Reloading):**
   ```bash
   npm run dev
   ```

3. **Build the Application:**
   ```bash
   npm run build
   node build-win.js
   ```

## Architecture

This monolithic codebase was refactored into modular, functional files for easier maintainability:
- `src/components/ui/` - Contains raw building blocks (Buttons, Inputs, Pills)
- `src/components/modals/` - All edit and add user dialog boxes
- `src/pages/` - The main routing tabs mapped matching to the UI sidebar (Clients, Attendance, Trainers, Dashboard)
- `src/utils/` - Global styling tokens and generalized helper logic
