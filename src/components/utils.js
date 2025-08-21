/**
 * utils.js
 * * This file contains helper functions for the ExcelGrid component.
 * Keeping these functions separate helps to keep the main component file cleaner and more focused on the component's logic.
 */

/**
 * Generates the column header label based on the column index.
 * 0 -> A, 1 -> B, 26 -> AA, 27 -> AB, etc.
 * This function handles creating the familiar Excel-like column names.
 * @param {number} index - The zero-based index of the column.
 * @returns {string} The column label (e.g., 'A', 'B', 'AA').
 */
export const getColumnHeader = (index) => {
  let header = '';
  let temp = index;
  while (temp >= 0) {
    header = String.fromCharCode((temp % 26) + 65) + header;
    temp = Math.floor(temp / 26) - 1;
  }
  return header;
};

/**
 * Generates an initial empty grid data structure.
 * Creates a 2D array filled with empty strings based on the specified number of rows and columns.
 * This is useful for initializing the grid when no initial data is provided.
 * @param {number} rows - The number of rows for the grid.
 * @param {number} cols - The number of columns for the grid.
 * @returns {Array<Array<string>>} A 2D array representing the empty grid.
 */
export const createEmptyGrid = (rows, cols) => {
  return Array.from({ length: rows }, () => Array(cols).fill(''));
};
