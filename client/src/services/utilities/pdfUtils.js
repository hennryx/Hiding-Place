// client/src/services/utilities/pdfUtils.js
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import 'jspdf-autotable';

/**
 * Generates a PDF from one or more HTML elements
 * @param {Object} options - Configuration options for PDF generation
 * @param {Array} options.elements - Array of element references and their configs
 * @param {string} options.filename - Filename for the PDF
 * @param {string} options.format - PDF format (a4, letter, etc)
 * @param {string} options.orientation - PDF orientation (portrait or landscape)
 * @returns {Promise<Blob>} - Promise that resolves to the PDF blob
 */
export const generatePDFFromElements = async (options) => {
  const {
    elements,
    filename = 'report.pdf',
    format = 'a4',
    orientation = 'portrait',
  } = options;

  // Create a new PDF document
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format,
  });
  
  let currentY = 10; // Starting Y position in mm
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10; // Margins in mm
  
  try {
    for (let i = 0; i < elements.length; i++) {
      const { element, config = {} } = elements[i];
      
      if (!element) continue;
      
      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: config.scale || 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        ...config.html2canvasOptions
      });
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate width and height in mm to maintain aspect ratio
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if the image will fit on the current page
      if (currentY + imgHeight > pageHeight - margin && i > 0) {
        doc.addPage(); // Add a new page
        currentY = margin; // Reset Y position
      }
      
      // Add the image to the PDF
      doc.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
      
      // Update current Y position for next element
      currentY += imgHeight + 10; // Add some space between elements
    }
    
    // Save the PDF
    doc.save(filename);
    
    // Return the PDF blob for further processing if needed
    return doc.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Generates a PDF report with header, content, and optional footer
 * @param {Object} options - Configuration options
 * @param {Object} options.header - Header element and config
 * @param {Object} options.content - Main content element and config
 * @param {Object} options.footer - Optional footer element and config
 * @param {Object} options.visualization - Optional visualization element and config
 * @param {string} options.title - Report title
 * @param {string} options.filename - Filename for the PDF
 * @returns {Promise<Blob>} - Promise that resolves to the PDF blob
 */
export const generateReport = async (options) => {
  const {
    header,
    content,
    footer,
    visualization,
    title = 'Report',
    filename = 'report.pdf',
  } = options;
  
  const elements = [];
  
  if (header?.element) {
    elements.push({
      element: header.element,
      config: header.config || { scale: 2 }
    });
  }
  
  if (visualization?.element) {
    elements.push({
      element: visualization.element,
      config: visualization.config || { scale: 2 }
    });
  }
  
  if (content?.element) {
    elements.push({
      element: content.element,
      config: content.config || { scale: 2 }
    });
  }
  
  if (footer?.element) {
    elements.push({
      element: footer.element,
      config: footer.config || { scale: 2 }
    });
  }
  
  return generatePDFFromElements({
    elements,
    filename: `${title.toLowerCase().replace(/\s+/g, '_')}_${filename}`,
    format: 'a4',
    orientation: 'portrait',
  });
};

/**
 * Exports data as CSV file
 * @param {Array} data - Array of objects to export
 * @param {Array} headers - Array of header configs with {key, label}
 * @param {string} filename - Filename for the CSV
 */
export const exportToCSV = (data, headers, filename = 'export.csv') => {
  if (!data || !data.length || !headers || !headers.length) {
    console.error('Invalid data or headers for CSV export');
    return;
  }
  
  // Create CSV header row
  const headerRow = headers.map(h => h.label || h.key).join(',');
  
  // Create CSV data rows
  const dataRows = data.map(item => {
    return headers.map(header => {
      let value = '';
      
      if (typeof header.getValue === 'function') {
        value = header.getValue(item);
      } else {
        value = item[header.key];
      }
      
      // Handle various data types
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma
        value = value.replace(/"/g, '""');
        return value.includes(',') ? `"${value}"` : value;
      } else if (value instanceof Date) {
        return value.toLocaleDateString();
      } else {
        return value;
      }
    }).join(',');
  }).join('\n');
  
  // Combine header and data
  const csvContent = `${headerRow}\n${dataRows}`;
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default {
  generatePDFFromElements,
  generateReport,
  exportToCSV
};