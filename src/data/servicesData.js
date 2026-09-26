export const servicesData = [
  {
    id: "linux-server-support",
    slug: "linux-server-support",
    title: "Linux Server Support & Administration",
    iconName: "Server",
    category: "Linux & Server Support",
    shortDesc: "Ubuntu, Debian, CentOS, and AlmaLinux server initialization, security hardening, user permission control, kernel maintenance, and troubleshooting.",
    fullDesc: "Comprehensive Linux administration for growing businesses. We handle production server provisioning, SSH access security, sudo policies, firewall rules, software package repository management, kernel updates, and resource performance tuning.",
    problemSolved: "Prevent unauthorized server access, system crashes during load spikes, unpatched vulnerabilities, and misconfigured Linux user permissions.",
    deliverables: [
      "Linux Server OS Installation & Initial Hardening",
      "SSH Key Management & Strict User Access Controls",
      "Automated System Security Patching & Maintenance",
      "Memory, Swap, and CPU Usage Diagnostics & Optimization"
    ],
    idealCustomer: "Businesses running Linux infrastructure requiring round-the-clock stability and security without hiring full-time sysadmins.",
    startingPrice: "Starting from $150 / server",
    techStack: ["Ubuntu", "Debian", "AlmaLinux", "SSH", "Bash", "UFW"],
    features: [
      "Ubuntu & Debian OS Hardening",
      "SSH Key Access & Sudo Policy Setup",
      "Kernel Patching & Scheduled Updates",
      "System Panic & Downtime Recovery"
    ]
  },
  {
    id: "nginx-web-hosting-support",
    slug: "nginx-web-hosting-support",
    title: "Nginx & Web Hosting Support",
    iconName: "Globe",
    category: "Web Infrastructure",
    shortDesc: "Nginx virtual host configuration, reverse proxy setup, SSL certificate installation, HTTP/2 enforcement, and high-traffic web performance tuning.",
    fullDesc: "Expert Nginx web server configuration and diagnostic support. We resolve 502 Bad Gateway errors, configure reverse proxies for Node.js/Python/Go applications, enable Certbot SSL renewal, and optimize caching headers.",
    problemSolved: "Fix 502/504 gateway errors, slow load times, domain SSL warnings, and improper request routing.",
    deliverables: [
      "Nginx Virtual Host & Server Block Optimization",
      "Automated Let's Encrypt / Certbot SSL Certificate Setup",
      "Reverse Proxy & Load Balancing Configuration",
      "Gzip/Brotli Compression & FastCGI Cache Tuning"
    ],
    idealCustomer: "Digital agencies, web application owners, and e-commerce stores seeking ultra-fast, SSL-secured website hosting.",
    startingPrice: "Starting from $120 / configuration",
    techStack: ["Nginx", "Certbot", "Let's Encrypt", "PHP-FPM", "FastCGI"],
    features: [
      "Nginx Server Block Setup",
      "Let's Encrypt Auto-renewing SSL",
      "Reverse Proxy for Node & Python",
      "PHP-FPM Process Pool Optimization"
    ]
  },
  {
    id: "website-development",
    slug: "website-development",
    title: "Custom Website Design & Development",
    iconName: "Code2",
    category: "Web Development",
    shortDesc: "Modern, responsive frontend and full-stack web development using React, Vite, Node.js, and clean CSS tailored for conversion and client acquisition.",
    fullDesc: "We build custom web applications and business websites designed to build trust and acquire clients. Featuring fast page load speeds, clean typography, mobile responsiveness, accessible navigation, and custom CMS backends.",
    problemSolved: "Replace slow, outdated, vulnerable templates with high-converting, custom-tailored websites.",
    deliverables: [
      "Custom Frontend & React SPA Development",
      "Mobile-First Responsive Layout & Accessibility (WCAG)",
      "Lightweight Custom CMS & Admin Portal",
      "SEO Metadata, OpenGraph & Structured Data Integration"
    ],
    idealCustomer: "Small businesses, Sri Lankan enterprises, international agencies, and startups needing a trustworthy web presence.",
    startingPrice: "Custom project quote",
    techStack: ["React 19", "Node.js", "Vite", "Express", "MySQL", "Vanilla CSS"],
    features: [
      "Responsive UI/UX Design",
      "Custom CMS Lead Management",
      "Fast Core Web Vitals",
      "SEO Ready HTML5 Architecture"
    ]
  },
  {
    id: "website-deployment-maintenance",
    slug: "website-deployment-maintenance",
    title: "Website Deployment & Ongoing Maintenance",
    iconName: "Rocket",
    category: "Deployment & Maintenance",
    shortDesc: "Zero-downtime website deployment, automated backups, SSL updates, dependency upgrades, health monitoring, and emergency bug fixing.",
    fullDesc: "End-to-end site deployment and continuous care plans. We deploy Node.js, Next.js, and static websites using PM2 process managers or Docker containers, configure daily database backups, and monitor uptime.",
    problemSolved: "Eliminate site outages, broken updates, missing backups, and manual deployment stress.",
    deliverables: [
      "PM2 & Docker Container Deployment Pipelines",
      "Automated Off-site Database & File Backups",
      "Uptime Monitoring & Instant Alerting",
      "Regular Security Audits & Package Upgrades"
    ],
    idealCustomer: "Companies with existing websites needing reliable technical maintenance and fast emergency troubleshooting.",
    startingPrice: "Starting from $99 / month",
    techStack: ["PM2", "Docker", "Git", "GitHub Actions", "Crontab"],
    features: [
      "PM2 Process Auto-Restart",
      "Daily Automated Off-site Backups",
      "Proactive Uptime Alerts",
      "Emergency Code & Server Fixes"
    ]
  },
  {
    id: "cloud-server-management",
    slug: "cloud-server-management",
    title: "Cloud & Virtual Server Management",
    iconName: "Cloud",
    category: "Cloud Infrastructure",
    shortDesc: "Setup, security, and ongoing management for AWS EC2, DigitalOcean Droplets, Hetzner, Linode, and Vultr virtual private servers.",
    fullDesc: "Strategic cloud server architecture and management. We set up VPS instances, configure cloud firewall security groups, attach persistent block storage volumes, manage DNS zones, and optimize monthly bandwidth costs.",
    problemSolved: "Avoid overpaying for unmanaged cloud instances, poor server sizing, security misconfigurations, and storage limits.",
    deliverables: [
      "Cloud VPS Provisioning & OS Installation",
      "Cloud Security Group & Firewall Isolation",
      "DNS Record Routing & Floating IP Configuration",
      "Cost Optimization & Resource Rightsizing Audit"
    ],
    idealCustomer: "Businesses migrating to or hosting applications on AWS, DigitalOcean, Hetzner, or Vultr.",
    startingPrice: "Starting from $180 / month",
    techStack: ["AWS EC2", "DigitalOcean", "Hetzner", "Linode", "Cloudflare"],
    features: [
      "VPS Instance Setup & Hardening",
      "Cloud Firewall Security Groups",
      "Cloudflare DNS & DDoS Proxying",
      "Storage Volume Configuration"
    ]
  },
  {
    id: "windows-server-infrastructure",
    slug: "windows-server-infrastructure",
    title: "Windows Server & Microsoft Infrastructure",
    iconName: "Monitor",
    category: "Windows Infrastructure",
    shortDesc: "Windows Server administration, Active Directory management, IIS web hosting, RDP access security, and Windows update maintenance.",
    fullDesc: "Professional administrative support for Microsoft infrastructure environments. We configure Active Directory Domain Services (AD DS), IIS web server deployment, Remote Desktop Services (RDS), and group policies.",
    problemSolved: "Resolve Windows user authentication failures, IIS web application errors, and insecure RDP connections.",
    deliverables: [
      "Windows Server Installation & IIS Web Server Configuration",
      "Active Directory & Group Policy Management (GPO)",
      "Secure RDP Gateway & Network Level Authentication",
      "Windows Server Patching & Event Log Auditing"
    ],
    idealCustomer: "Organizations relying on Windows Server environments, internal domain controllers, and IIS hosting.",
    startingPrice: "Starting from $200 / server",
    techStack: ["Windows Server", "IIS", "Active Directory", "PowerShell", "RDP"],
    features: [
      "IIS Site & App Pool Configuration",
      "Active Directory User Management",
      "Group Policy Object (GPO) Audits",
      "PowerShell Maintenance Automation"
    ]
  },
  {
    id: "network-setup-troubleshooting",
    slug: "network-setup-troubleshooting",
    title: "Network Setup & Troubleshooting",
    iconName: "Network",
    category: "Network Support",
    shortDesc: "Router and firewall configuration, VPN setup, TCP/IP troubleshooting, local area network (LAN) setup, and bandwidth diagnostics.",
    fullDesc: "Practical networking services for offices and remote teams. We configure router firewall rules, set up secure OpenVPN/WireGuard tunnels, diagnose packet loss, and connect shared office resources.",
    problemSolved: "Fix unstable internet connectivity, blocked ports, unsafe remote working setups, and slow LAN performance.",
    deliverables: [
      "Router, Firewall, & Switch Setup",
      "Secure Remote Access VPN (WireGuard / OpenVPN)",
      "Subnetting, Static IP, & DHCP Management",
      "Network Latency & Bandwidth Bottleneck Diagnostics"
    ],
    idealCustomer: "Small businesses and agencies needing reliable local networks and safe remote office connectivity.",
    startingPrice: "Starting from $150 / setup",
    techStack: ["WireGuard", "OpenVPN", "TCP/IP", "DNS", "DHCP", "Routers"],
    features: [
      "Site-to-Site & Remote Client VPN",
      "Office LAN & Wi-Fi Configuration",
      "Port Forwarding & Nat Rules",
      "Packet Loss & DNS Debugging"
    ]
  },
  {
    id: "it-infrastructure-consulting",
    slug: "it-infrastructure-consulting",
    title: "IT Infrastructure & Security Consulting",
    iconName: "ShieldCheck",
    category: "IT Consulting",
    shortDesc: "Independent technical assessment, system security audits, architecture design, backup strategy planning, and IT vendor advisory.",
    fullDesc: "Honest, outcome-driven technical advisory services. We evaluate your current server architecture, uncover security vulnerabilities, audit backup reliability, and provide clear step-by-step roadmaps without sales hype.",
    problemSolved: "Eliminate uncertainty about infrastructure security, vendor lock-in, and inefficient IT operational costs.",
    deliverables: [
      "Comprehensive Infrastructure Security Audit Report",
      "Disaster Recovery & Data Backup Architecture Plan",
      "Technology Stack & Hosting Recommendation Roadmap",
      "Independent IT Vendor & Quote Review"
    ],
    idealCustomer: "Startups, small business owners, and founders making strategic technical infrastructure decisions.",
    startingPrice: "Starting from $250 / consultation",
    techStack: ["Security Audits", "Backup Systems", "Linux", "Cloud", "Nginx"],
    features: [
      "Independent Technical Audits",
      "Disaster Recovery Planning",
      "Architecture Blueprints",
      "Cost Reduction Roadmaps"
    ]
  }
];
