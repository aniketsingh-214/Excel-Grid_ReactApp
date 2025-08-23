export const getColumnHeader = (index) => {
  let header = '';
  let temp = index;
  while (temp >= 0) {
    header = String.fromCharCode((temp % 26) + 65) + header;
    temp = Math.floor(temp / 26) - 1;
  }
  return header;
};

export const createEmptyGrid = (rows, cols) => {
  return Array.from({ length: rows }, () => Array(cols).fill(''));
};
