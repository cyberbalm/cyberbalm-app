'use client';

import { useRef } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

interface RiskGaugeProps {
  score: number;
  industry: string;
  companySize: string;
  responses: Record<string, boolean>;
}

export default function RiskGauge({
  score,
  industry,
  companySize,
  responses,
}: RiskGaugeProps) {
  const gaugeRef = useRef<HTMLDivElement>(null);

  const riskLevel =
    score >= 90 ? 'Low' : score >= 70 ? 'Moderate' : 'High';

  const riskColor =
    riskLevel === 'Low'
      ? 'bg-green-500'
      : riskLevel === 'Moderate'
      ? 'bg-yellow-400'
      : 'bg-red-500';

  const exportToImage = async () => {
    if (!gaugeRef.current) return;

    const dataUrl = await toPng(gaugeRef.current);
    const link = document.createElement('a');
    link.download = `cyber-risk-score-${score}.png`;
    link.href = dataUrl;
    link.click();
  };

  const exportToPDF = async () => {
    if (!gaugeRef.current) return;

    const dataUrl = await toPng(gaugeRef.current);

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text('CyberBalm Risk Diagnostic Report', 20, 20);

    // Logo (optional: replace with your hosted logo)
    const logoUrl = '/cyberbalm-logo.png'; // Place your logo in public/ folder
    const logo = await fetch(logoUrl).then((res) => res.blob());
    const logoDataUrl = await toPng(await createImageElement(logo));

    pdf.addImage(logoDataUrl, 'PNG', 150, 10, 40, 15);

    pdf.setFontSize(12);
    pdf.text(`Score: ${score}`, 20, 40);
    pdf.text(`Risk Level: ${riskLevel}`, 20, 50);
    pdf.text(`Industry: ${industry}`, 20, 60);
    pdf.text(`Company Size: ${companySize}`, 20, 70);

    pdf.addImage(dataUrl, 'PNG', 20, 80, 170, 90);

    pdf.text('Summary:', 20, 180);
    pdf.text(
      `Your organization scored ${score}, indicating a ${riskLevel} cyber risk level.`,
      20,
      190
    );
    pdf.text(
      riskLevel === 'Low'
        ? 'Maintain strong cyber hygiene and continue training.'
        : riskLevel === 'Moderate'
        ? 'Improve patching, backups, and MFA implementation.'
        : 'High risk detected. Urgent action needed across basic controls.',
      20,
      200
    );

    pdf.save(`cyber-risk-report-${score}.pdf`);
  };

  return (
    <div className="mt-6">
      <div ref={gaugeRef} className="border p-4 rounded shadow-lg inline-block bg-white">
        <h3 className="text-lg font-semibold mb-2 text-center">Risk Gauge</h3>
        <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div
            className={`${riskColor} h-4 transition-all duration-1000`}
            style={{ width: `${(score / 150) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-center font-medium">{score} / 150 – {riskLevel} Risk</p>

        <div className="mt-4 text-sm text-left">
          <p><strong>Industry:</strong> {industry}</p>
          <p><strong>Company Size:</strong> {companySize}</p>
          <p><strong>Responses:</strong></p>
          <ul className="ml-4 list-disc">
            {Object.entries(responses).map(([key, val]) =>
              val ? <li key={key}>{key}</li> : null
            )}
          </ul>
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={exportToImage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download PNG
        </button>
        <button
          onClick={exportToPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download PDF Report
        </button>
      </div>
    </div>
  );
}

// Helper: Create <img> from blob
const createImageElement = (blob: Blob): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = URL.createObjectURL(blob);
  });
