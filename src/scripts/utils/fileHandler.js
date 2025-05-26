/**
 * Utility for handling file operations
 */
export default class FileHandler {
  /**
   * Creates a File from Blob data
   * @param {Blob} blob - The blob to convert
   * @param {string} filename - The filename to use
   * @returns {File} - A File object
   */
  static createFileFromBlob(blob, filename) {
    const mimeType = blob.type || 'image/jpeg';
    return new File([blob], filename, {
      type: mimeType,
      lastModified: new Date().getTime()
    });
  }

  /**
   * Updates a file input with a File object
   * @param {HTMLInputElement} fileInput - The file input element
   * @param {File} file - The file to set
   * @returns {boolean} - Success state
   */
  static updateFileInput(fileInput, file) {
    try {
      // Create a DataTransfer
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      // Set the files
      fileInput.files = dataTransfer.files;
      return true;
    } catch (error) {
      console.error("Error updating file input:", error);
      return false;
    }
  }
}
