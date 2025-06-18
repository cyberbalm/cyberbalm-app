import { complianceMap } from '../utils/complianceMap';

Object.entries(responses).forEach(([key, value]) => {
  if (value && complianceMap[key]) {
    const control = complianceMap[key];
    doc.text(`${control.label}`);
    doc.text(`- Cyber Essentials: ${control.cyberEssentials.join(', ')}`);
    doc.text(`- CIS Controls: ${control.cis.join(', ')}`);
    doc.text(`- NIST CSF: ${control.nist.join(', ')}`);
    doc.moveDown();
  }
});
