import React from 'react';
import ExcelGrid from './components/ExcelGrid';
import './App.css';

function App() {
  // You can either provide initial data or let the component create an empty grid.
  
  // Example with initial data:
  const sampleData = [
    ['Name', 'Title', 'Company', 'Salary'],
    ['Alice', 'Developer', 'Tech Corp', '120000'],
    ['Bob', 'Designer', 'Creative Inc', '95000'],
    ['Charlie', 'Manager', 'Biz Solutions', '150000'],
    ['Diana', 'Engineer', 'Future Systems', '135000'],
  ];

  // Example for an empty grid:
  // Just pass the number of rows and columns.
  // <ExcelGrid initialRows={20} initialCols={15} />

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Excel Grid Component</h1>
        <p>A fully functional grid with keyboard navigation, sorting, and dynamic rows/columns.</p>
      </header>
      <main className="App-main">
        <ExcelGrid initialData={sampleData} />
      </main>
    </div>
  );
}

export default App;
