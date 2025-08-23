import React, { useState, useEffect, useRef } from 'react';
import './ExcelGrid.css';
import { getColumnHeader, createEmptyGrid } from './utils';

const ExcelGrid = ({ initialData, initialRows, initialCols }) => {
  const [data, setData] = useState(() => {
    if (initialData) return initialData;
    return createEmptyGrid(initialRows || 10, initialCols || 10);
  });

  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
  const [editingCell, setEditingCell] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const cellRefs = useRef({});

  const numRows = data.length;
  const numCols = data[0]?.length || 0;

  useEffect(() => {
    const cellKey = `${activeCell.row}-${activeCell.col}`;
    const cell = cellRefs.current[cellKey];
    if (cell) {
      cell.focus();
    }
  }, [activeCell]);

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
          setEditingCell(null); 
          newRow = Math.min(numRows - 1, row + 1);
        } else {
          setEditingCell({ row, col }); 
        }
        e.preventDefault();
        break;
      case 'Escape':
        setEditingCell(null); 
        e.preventDefault();
        break;
      default:
        if (!editingCell && e.key.length === 1) {
           setEditingCell({ row, col });
        }
        return;
    }
    
    setActiveCell({ row: newRow, col: newCol });
  };

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
