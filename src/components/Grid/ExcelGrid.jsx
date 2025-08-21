import React, { useState, useEffect, useRef } from 'react';
import './ExcelGrid.css';
import { getColumnHeader, createEmptyGrid } from './utils';

/**
 * ExcelGrid Component
 * * This is a feature-rich, Excel-like grid component built with React.
 * It's designed to be generic, allowing data, rows, and columns to be passed in from a parent component.
 *
 * Core Features:
 * - Displays data in a grid with Excel-style headers (A, B, C... for columns, 1, 2, 3... for rows).
 * - Cells are editable.
 * - Full keyboard navigation (Arrow keys, Tab).
 * - Highlights the active cell's row and column headers.
 *
 * Bonus Features:
 * - Add new rows or columns.
 * - Sort columns in ascending or descending order.
 */
const ExcelGrid = ({ initialData, initialRows, initialCols }) => {
  // If initialData is provided, use it. Otherwise, create an empty grid.
  const [data, setData] = useState(() => {
    if (initialData) return initialData;
    return createEmptyGrid(initialRows || 10, initialCols || 10);
  });

  // State to track the currently active/focused cell.
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
  
  // State to track the cell being edited. This is different from the active cell for better UX.
  const [editingCell, setEditingCell] = useState(null);

  // State for sorting functionality.
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Refs for each cell input to manage focus programmatically.
  const cellRefs = useRef({});

  const numRows = data.length;
  const numCols = data[0]?.length || 0;

  // Effect to focus the active cell's input when it changes.
  useEffect(() => {
    const cellKey = `${activeCell.row}-${activeCell.col}`;
    const cell = cellRefs.current[cellKey];
    if (cell) {
      cell.focus();
    }
  }, [activeCell]);

  // --- Data Manipulation Handlers ---

  const handleDataChange = (row, col, value) => {
    const newData = data.map((r, rowIndex) =>
      rowIndex === row
        ? r.map((c, colIndex) => (colIndex === col ? value : c))
        : r
    );
    setData(newData);
  };
  
  const addRow = () => {
    const newRow = Array(numCols).fill('');
    setData([...data, newRow]);
  };

  const addColumn = () => {
    const newData = data.map(row => [...row, '']);
    setData(newData);
  };

  // --- Keyboard Navigation ---

  const handleKeyDown = (e, row, col) => {
    let newRow = row;
    let newCol = col;

    switch (e.key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1);
        e.preventDefault();
        break;
      case 'ArrowDown':
        newRow = Math.min(numRows - 1, row + 1);
        e.preventDefault();
        break;
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1);
        e.preventDefault();
        break;
      case 'ArrowRight':
        newCol = Math.min(numCols - 1, col + 1);
        e.preventDefault();
        break;
      case 'Tab':
        if (e.shiftKey) {
          if (col > 0) {
            newCol = col - 1;
          } else if (row > 0) {
            newRow = row - 1;
            newCol = numCols - 1;
          }
        } else {
          if (col < numCols - 1) {
            newCol = col + 1;
          } else if (row < numRows - 1) {
            newRow = row + 1;
            newCol = 0;
          }
        }
        e.preventDefault();
        break;
      case 'Enter':
        if (editingCell) {
          setEditingCell(null); // Exit edit mode
          // Move to the cell below, like Excel
          newRow = Math.min(numRows - 1, row + 1);
        } else {
          setEditingCell({ row, col }); // Enter edit mode
        }
        e.preventDefault();
        break;
      case 'Escape':
        setEditingCell(null); // Exit edit mode without saving changes (if any were pending)
        e.preventDefault();
        break;
      default:
        // For any other key, if not already editing, enter edit mode.
        if (!editingCell && e.key.length === 1) {
           setEditingCell({ row, col });
        }
        return; // Do not update active cell for other keys
    }
    
    setActiveCell({ row: newRow, col: newCol });
  };

  // --- Sorting Logic ---

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (colIndex) => {
    if (sortConfig.key === colIndex) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return null;
  };

  // --- Rendering ---

  return (
    <div>
      <div className="grid-toolbar">
        <button className="toolbar-button" onClick={addRow}>Add Row</button>
        <button className="toolbar-button" onClick={addColumn}>Add Column</button>
      </div>
      <div className="grid-container" onKeyDown={(e) => handleKeyDown(e, activeCell.row, activeCell.col)}>
        <table className="grid-table">
          <thead>
            <tr>
              <th className="corner-header"></th>
              {Array.from({ length: numCols }).map((_, colIndex) => (
                <th
                  key={colIndex}
                  className={`col-header ${activeCell.col === colIndex ? 'active-header' : ''}`}
                  onClick={() => requestSort(colIndex)}
                >
                  {getColumnHeader(colIndex)}
                  <span className="sort-indicator">{getSortIndicator(colIndex)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th className={`row-header ${activeCell.row === rowIndex ? 'active-header' : ''}`}>
                  {rowIndex + 1}
                </th>
                {row.map((cellValue, colIndex) => {
                  const cellKey = `${rowIndex}-${colIndex}`;
                  const isActive = activeCell.row === rowIndex && activeCell.col === colIndex;
                  const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex;

                  return (
                    <td
                      key={colIndex}
                      className={`data-cell ${isActive ? 'active-cell' : ''}`}
                      onClick={() => setActiveCell({ row: rowIndex, col: colIndex })}
                      onDoubleClick={() => setEditingCell({ row: rowIndex, col: colIndex })}
                    >
                      <input
                        ref={(el) => (cellRefs.current[cellKey] = el)}
                        value={cellValue}
                        onChange={(e) => handleDataChange(rowIndex, colIndex, e.target.value)}
                        onBlur={() => {
                          if (isEditing) setEditingCell(null);
                        }}
                        className="cell-content"
                        readOnly={!isEditing}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExcelGrid;
