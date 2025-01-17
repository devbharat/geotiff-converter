const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const selectFileButton = document.getElementById('select-file');
  const selectOutputButton = document.getElementById('select-output');
  const convertButton = document.getElementById('convert');
  const inputPathDisplay = document.getElementById('input-path');
  const outputPathDisplay = document.getElementById('output-path');
  const statusDisplay = document.getElementById('status');

  let inputFilePath = null;
  let outputFilePath = null;

  selectFileButton.addEventListener('click', async () => {
    inputFilePath = await ipcRenderer.invoke('pick-file');
    if (inputFilePath) {
      inputPathDisplay.textContent = `Input: ${inputFilePath}`;
    }
  });

  selectOutputButton.addEventListener('click', async () => {
    outputFilePath = await ipcRenderer.invoke('pick-save-location');
    if (outputFilePath) {
      outputPathDisplay.textContent = `Output: ${outputFilePath}`;
    }
  });

  convertButton.addEventListener('click', async () => {
    if (!inputFilePath || !outputFilePath) {
      statusDisplay.textContent = 'Please select input and output files.';
      return;
    }

    statusDisplay.textContent = 'Converting...';
    const result = await ipcRenderer.invoke('convert-file', inputFilePath, outputFilePath);

    if (result.success) {
      statusDisplay.textContent = `Conversion successful! File saved at ${outputFilePath}`;
    } else {
      statusDisplay.textContent = `Error: ${result.error}`;
    }
  });
});

