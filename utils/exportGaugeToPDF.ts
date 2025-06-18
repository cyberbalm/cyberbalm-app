import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

interface ExportOptions {
  gaugeElement: HTMLElement;
  score: number;
  industry: string;
  companySize: string;
  responses: Record<string, boolean>;
}

export async function exportGaugeToPDF({
  gaugeElement,
  score,
  industry,
  companySize,
  responses,
}: ExportOptions) {
  try {
    const dataUrl = await toPng(gaugeElement);

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text('Cyber Risk Diagnostic Report', 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Score: ${score} / 105`, 20, 35);
    pdf.text(`Risk Level: ${score >= 90 ? 'Low' : score >= 70 ? 'Moderate' : 'High'}`, 20, 45);
    pdf.text(`Industry: ${industry}`, 20, 55);
    pdf.text(`Company Size: ${companySize}`, 20, 65);

    // Add image
    pdf.addImage(dataUrl, 'PNG', 20, 75, 170, 30);

    // Responses
    let y = 115;
    pdf.setFontSize(14);
    pdf.text('Security Responses:', 20, y);
    y += 8;
    pdf.setFontSize(11);

    Object.entries(responses).forEach(([key, value]) => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(`${formatLabel(key)}: ${value ? '✔ Yes' : '✖ No'}`, 25, y);
      y += 7;
    });

    pdf.save(`cyber-risk-report-${score}.pdf`);
  } catch (err) {
    console.error('❌ Failed to export PDF:', err);
  }
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter
}
