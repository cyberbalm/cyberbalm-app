export const recommendationsMap: Record<
  string,
  {
    label: string;
    recommendation: string;
  }
> = {
  firewall: {
    label: 'Firewall Configuration',
    recommendation:
      'Deploy a firewall that restricts unauthorized inbound/outbound traffic. Use default-deny policies. Consider tools like pfSense, UFW, or enterprise firewall appliances.',
  },
  secureConfig: {
    label: 'Secure Configuration',
    recommendation:
      'Harden system configurations by disabling unused ports/services, removing default credentials, and enforcing secure settings. Use CIS Benchmarks for guidance.',
  },
  accessControl: {
    label: 'Access Control',
    recommendation:
      'Implement least privilege. Review permissions regularly. Disable dormant accounts and require role-based access control (RBAC).',
  },
  antivirus: {
    label: 'Antivirus & Malware Protection',
    recommendation:
      'Install and maintain antivirus/EDR software. Ensure auto-updates and real-time protection are active. Recommended: Microsoft Defender, Bitdefender, CrowdStrike.',
  },
  patchManagement: {
    label: 'Patch Management',
    recommendation:
      'Maintain an up-to-date inventory and patch critical OS/app vulnerabilities regularly (e.g., monthly). Automate where possible.',
  },
  assetInventory: {
    label: 'Asset Inventory',
    recommendation:
      'Maintain a current list of all hardware/software assets. Use tools like GLPI, Lansweeper, or built-in OS inventory features.',
  },
  logging: {
    label: 'Logging & Monitoring',
    recommendation:
      'Enable system, application, and access logging. Store logs centrally and review them periodically. Consider tools like ELK, Graylog, or Splunk.',
  },
  emailSecurity: {
    label: 'Email Security',
    recommendation:
      'Enable spam filters, link protection, and malware scanning. Train staff to recognize phishing. Consider Microsoft Defender for Office 365 or Proofpoint.',
  },
  remoteAccess: {
    label: 'Remote Access Security',
    recommendation:
      'Use VPNs or secure tunnels for remote access. Disable direct RDP/SSH from the internet. Enforce MFA and session timeouts.',
  },
  thirdPartyRisk: {
    label: 'Third-Party Risk Management',
    recommendation:
      'Vet vendors using due diligence questionnaires. Require contracts to include data protection clauses. Monitor supplier performance and risks.',
  },
  incidentPlan: {
    label: 'Incident Response Plan',
    recommendation:
      'Develop and test an incident response plan. Define roles, escalation paths, and recovery procedures. Run tabletop exercises annually.',
  },
  accountLockout: {
    label: 'Account Lockout Policy',
    recommendation:
      'Configure lockout after 3-5 failed login attempts. Use exponential backoff or cooldown timers to slow brute-force attacks.',
  },
  training: {
    label: 'Security Awareness Training',
    recommendation:
      'Deliver cybersecurity training annually. Include topics like phishing, password hygiene, and reporting procedures. Use platforms like KnowBe4 or MetaCompliance.',
  },
  endpointDetection: {
    label: 'Endpoint Detection & Response (EDR)',
    recommendation:
      'Use advanced EDR/XDR to monitor and respond to endpoint threats. Options include SentinelOne, CrowdStrike, Microsoft Defender for Endpoint.',
  },
  dataBackup: {
    label: 'Data Backup & Recovery',
    recommendation:
      'Back up critical data daily. Store copies offline or in secure cloud vaults. Test recovery procedures regularly.',
  },
};
