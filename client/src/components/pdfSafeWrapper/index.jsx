// client/src/components/pdfSafeWrapper/index.jsx
import React from 'react';

/**
 * Wrapper component that ensures content is safe for PDF generation
 * by using only PDF-compatible colors and styles
 */
const PDFSafeWrapper = ({ children }) => {
  return (
    <div 
      className="pdf-safe-content" 
      style={{
        color: '#000000',
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {children}
    </div>
  );
};

export default PDFSafeWrapper;