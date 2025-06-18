// utils/complianceMap.ts
export const complianceMap: Record<string, {
  label: string;
  cyberEssentials: string[];
  cis: string[];
  nist: string[];
}> = {
  firewall: {
    label: 'Firewall Configuration',
    cyberEssentials: ['Boundary Firewalls'],
    cis: ['CIS 4.3 – Implement a host-based firewall'],
    nist: ['PR.IP-1 – Baseline configuration established'],
  },
  secureConfig: {
    label: 'Secure Configuration',
    cyberEssentials: ['Secure Configuration'],
    cis: ['CIS 4.1 – Establish secure configurations'],
    nist: ['PR.IP-1'],
  },
  accessControl: {
    label: 'Access Control',
    cyberEssentials: ['User Access Control'],
    cis: ['CIS 6.1 – Establish account management processes'],
    nist: ['PR.AC-1', 'PR.AC-4'],
  },
  antivirus: {
    label: 'Malware Protection',
    cyberEssentials: ['Malware Protection'],
    cis: ['CIS 10.1 – Deploy anti-malware software'],
    nist: ['PR.IP-1', 'PR.DS-1'],
  },
  patchManagement: {
    label: 'Patch Management',
    cyberEssentials: ['Security Update Management'],
    cis: ['CIS 7.1 – Establish patch management'],
    nist: ['PR.IP-12'],
  },
  assetInventory: {
    label: 'Asset Inventory',
    cyberEssentials: ['(Not explicitly defined)'],
    cis: ['CIS 1.1 – Establish & maintain asset inventory'],
    nist: ['ID.AM-1'],
  },
  logging: {
    label: 'Logging and Monitoring',
    cyberEssentials: ['(Not explicitly defined)'],
    cis: ['CIS 8.1 – Enable logging'],
    nist: ['DE.CM-7'],
  },
  emailSecurity: {
    label: 'Email Security',
    cyberEssentials: ['Malware Protection'],
    cis: ['CIS 9.1 – Ensure email protection'],
    nist: ['PR.DS-2'],
  },
  remoteAccess: {
    label: 'Remote Access Security',
    cyberEssentials: ['Secure Configuration', 'User Access Control'],
    cis: ['CIS 11.4 – Protect remote access'],
    nist: ['PR.AC-3'],
  },
  thirdPartyRisk: {
    label: 'Third-Party Risk',
    cyberEssentials: ['(Not explicitly defined)'],
    cis: ['CIS 15.1 – Establish third-party risk program'],
    nist: ['ID.SC-4'],
  },
  incidentPlan: {
    label: 'Incident Response Plan',
    cyberEssentials: ['(Not explicitly defined)'],
    cis: ['CIS 17.1 – Design incident response plan'],
    nist: ['RS.RP-1'],
  },
  accountLockout: {
    label: 'Account Lockout Policies',
    cyberEssentials: ['User Access Control'],
    cis: ['CIS 5.5 – Implement lockout thresholds'],
    nist: ['PR.AC-7'],
  },
  training: {
    label: 'Security Awareness Training',
    cyberEssentials: ['(Not explicitly defined)'],
    cis: ['CIS 14.1 – Conduct training'],
    nist: ['PR.AT-1'],
  },
  endpointDetection: {
    label: 'Endpoint Detection and Response (EDR)',
    cyberEssentials: ['Malware Protection'],
    cis: ['CIS 10.3 – Deploy endpoint detection tools'],
    nist: ['DE.CM-4'],
  },
  dataBackup: {
    label: 'Data Backup',
    cyberEssentials: ['(Not explicitly defined)'],
    cis: ['CIS 11.5 – Ensure backups are taken'],
    nist: ['PR.IP-4', 'PR.DS-4'],
  }
};
