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
  static async createFileFromBlob(blob, filename) {
    return new File([blob], filename, { type: blob.type });
  }

  /**
   * Updates a file input with a File object
   * @param {HTMLInputElement} fileInput - The file input element
   * @param {File} file - The file to set
   * @returns {boolean} - Success state
   */
  static updateFileInput(fileInput, file) {
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
  }

  /**
   * Validates an image file
   * @param {File} file - The file to validate
   * @returns {Object} - Validation result
   */
  static validateImageFile(file) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Please select a valid image file (JPEG, PNG, or GIF)",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File size must be less than 5MB",
      };
    }

    return { isValid: true };
  }
}
