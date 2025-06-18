import jsPDF from 'jspdf';
import { complianceMap } from '../utils/complianceMap';

export function generateReport(responses: Record<string, boolean>) {
  const doc = new jsPDF();
  let y = 10;

  Object.entries(responses).forEach(([key, value]) => {
    if (value && complianceMap[key]) {
      const control = complianceMap[key];

      doc.text(`${control.label}`, 10, y);
      y += 8;
      doc.text(`- Cyber Essentials: ${control.cyberEssentials.join(', ')}`, 10, y);
      y += 8;
      doc.text(`- CIS Controls: ${control.cis.join(', ')}`, 10, y);
      y += 8;
      doc.text(`- NIST CSF: ${control.nist.join(', ')}`, 10, y);
      y += 12; // extra spacing after each block
    }
  });

  return doc;
}
