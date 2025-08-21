# React Excel Grid Component

A lightweight and customizable **Excel-like grid component** built entirely in **React**.  
This project provides core spreadsheet functionalities without relying on external grid libraries, offering a clean and focused solution for displaying and manipulating tabular data.

---

## ✨ Features

- **Generic and Reusable**  
  Easily pass in your own data, or simply specify the number of rows and columns to generate an empty grid.

- **Excel-like Interface**  
  Familiar column headers (**A, B, C...**) and row indexes (**1, 2, 3...**) for intuitive navigation.

- **In-Cell Editing**  
  Double-click or type on a selected cell to edit its content.

- **Full Keyboard Navigation**  
  - **Arrow Keys** → Move up, down, left, or right  
  - **Tab** → Move to the next cell (Shift + Tab for previous cell)  
  - **Enter** → Confirm edit and move to the cell below  

- **Active Cell Highlighting**  
  Highlights the current row and column headers for clear visual feedback.

- **Dynamic Grid Structure**  
  - Add new rows to the end of the grid  
  - Add new columns dynamically  

- **Column Sorting**  
  Click any column header to toggle ascending/descending sorting.

---

## 🛠️ Technology Stack

- **React** → Built using React Hooks (`useState`, `useEffect`, `useRef`)  
- **CSS** → Plain CSS for styling (no frameworks, lightweight & customizable)  
- **JavaScript (ES6+)** → Handles logic, data manipulation, and event handling  

---

## 🚀 Getting Started

Follow these steps to run the project locally:

### Prerequisites
- [Node.js](https://nodejs.org/) and npm (or yarn) installed.

### Installation

```bash
# Clone the repository
git clone <your-repository-url>

# Navigate to project directory
cd excel-grid-app

# Install dependencies
npm install

# Start development server
npm start
