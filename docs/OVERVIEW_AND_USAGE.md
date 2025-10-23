# n8n-nodes-cavelo: Overview & Usage Guide

<div align="center">

![Cavelo n8n Node](https://img.shields.io/badge/n8n-Community%20Node-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-4.8+-blue)

**Comprehensive n8n integration for Cavelo Attack Surface Management platform**

[Installation](#installation) • [Quick Start](#quick-start) • [API Reference](#api-reference) • [Workflows](#workflows) • [Contributing](#contributing)

</div>

---

## 🚀 **Overview**

The `n8n-nodes-cavelo` package provides a comprehensive integration between n8n and the Cavelo Attack Surface Management platform. This community node enables security teams to automate vulnerability management, PII discovery, access auditing, and compliance monitoring workflows.

### **Key Features**

- 🔍 **Vulnerability Management**: Search, filter, and monitor vulnerabilities with CVSS scoring
- 🔒 **PII Discovery**: Track and alert on sensitive data exposure across your infrastructure
- 📊 **Access Auditing**: Monitor data access events for compliance and security
- ✅ **CIS Benchmarking**: Track compliance with security benchmarks and standards
- ⚡ **Real-time Triggers**: Polling-based notifications for new security events
- 🛡️ **Rate Limiting**: Built-in handling of API rate limits with exponential backoff
- 📄 **Pagination**: Automatic handling of large result sets and data processing

---

## 📦 **Installation**

### **Prerequisites**

- n8n instance (version 1.0.0 or higher)
- Cavelo account with API access
- Node.js 18+ (for development)

### **Install the Package**

```bash
npm install n8n-nodes-cavelo
```

### **Verify Installation**

After installation, the Cavelo nodes should appear in your n8n interface under the "Community Nodes" section.

---

## ⚙️ **Quick Start**

### **Step 1: Configure Cavelo Credentials**

1. **Create API Key**
   - Log in to [Cavelo Dashboard](https://dashboard.prod.cavelodata.com/)
   - Navigate to **Settings** → **API Keys**
   - Click **Create New API Key**
   - Configure permissions:
     - ✅ **Data Discovery**: For PII and inventory data
     - ✅ **Data Protection**: For vulnerability and benchmark data
     - ✅ **Data Access**: For access audit data

2. **Find Organization UUID**
   - In Cavelo dashboard: **Settings** → **Organization**
   - Copy the **Organization UUID**

3. **Add Credentials in n8n**
   - Go to **Credentials** in your n8n instance
   - Click **Add Credential** → **Cavelo API**
   - Enter your API key and organization UUID
   - Test the connection

### **Step 2: Create Your First Workflow**

1. **Add Cavelo Node**
   - Create a new workflow in n8n
   - Search for "Cavelo" in the node library
   - Add the **Cavelo** node

2. **Configure Basic Search**
   - Select **Vulnerability** resource
   - Choose **Search** operation
   - Set severity filter to `["critical", "high"]`
   - Set limit to `10`

3. **Test the Connection**
   - Click **Execute Node** to test
   - Verify data is returned correctly

---

## 🔧 **API Reference**

### **Resources & Operations**

| Resource | Operations | Description |
|----------|------------|-------------|
| **Vulnerability** | Search, Get by Target, Historical | Vulnerability management and tracking |
| **PII** | Search, Get by Target | Personal information discovery |
| **Access Audit** | Search | Data access monitoring |
| **Benchmark** | Search | CIS benchmark compliance |

### **Common Filters**

#### **Vulnerability Filters**
```typescript
{
  cveV2BaseScore: number,        // Minimum CVSS v2 score
  cveV3BaseScore: number,        // Minimum CVSS v3 score
  severities: string[],          // ["critical", "high", "medium", "low"]
  hostnames: string[],           // Array of hostnames to filter
  agentUuids: string[]           // Array of agent UUIDs
}
```

#### **PII Filters**
```typescript
{
  classifications: string[],    // ["SSN", "Credit Card", "Bank Account"]
  inventoryTags: string[],       // Array of inventory tags
  sourceTypes: string[],        // ["agent", "cloud", "network"]
  confidence: number            // Minimum confidence score (0-100)
}
```

#### **Access Audit Filters**
```typescript
{
  userIds: string[],            // Array of user IDs
  actions: string[],            // ["read", "write", "delete", "download"]
  dateRange: string,           // "last7Days", "last30Days", "last90Days"
  ipAddresses: string[]        // Array of IP addresses
}
```

#### **Benchmark Filters**
```typescript
{
  statuses: string[],           // ["pass", "fail", "error", "not_applicable"]
  categories: string[],         // ["access_control", "audit_logging", "encryption"]
  hostnames: string[],          // Array of hostnames
  benchmarkIds: string[]       // Array of specific benchmark IDs
}
```

---

## 🔄 **Workflow Examples**

### **Critical Vulnerability Alert**

**Purpose**: Automatically create tickets when critical vulnerabilities are discovered

```json
{
  "trigger": "Cavelo Trigger",
  "conditions": "CVSS Score >= 9.0",
  "actions": [
    "Create Jira Ticket",
    "Send Slack Alert",
    "Assign to Security Team"
  ]
}
```

**Business Logic**:
- Risk scoring based on CVSS and asset criticality
- SLA tracking with automatic escalation
- Integration with ticketing systems

### **PII Compliance Alert**

**Purpose**: Monitor PII discovery and ensure compliance reporting

```json
{
  "trigger": "Cavelo Trigger",
  "conditions": "High-risk PII types (SSN, Credit Card)",
  "actions": [
    "Send Compliance Alert",
    "Create Compliance Ticket",
    "Notify Legal Team"
  ]
}
```

**Business Logic**:
- Data classification and risk assessment
- Regulatory compliance tracking
- Legal team notification for sensitive data

### **Weekly Security Posture Report**

**Purpose**: Generate comprehensive weekly security reports

```json
{
  "trigger": "Schedule Trigger (Monday 9 AM)",
  "data_sources": [
    "Vulnerabilities",
    "PII Discoveries", 
    "Benchmark Failures"
  ],
  "outputs": [
    "HTML Report",
    "Email to Executives"
  ]
}
```

**Business Logic**:
- Risk score calculation
- Compliance rate analysis
- Executive summary generation

---

## 🎯 **Advanced Usage**

### **Custom Risk Scoring**

```javascript
// Example: Custom risk calculation
const riskScore = (cvssScore * 0.4) + 
                  (assetCriticality * 0.3) + 
                  (piiExposure * 0.3);

if (riskScore >= 8.0) {
  // Trigger immediate response
  return "CRITICAL";
} else if (riskScore >= 6.0) {
  // Schedule for review
  return "HIGH";
} else {
  // Standard processing
  return "MEDIUM";
}
```

### **Data Enrichment**

```javascript
// Example: Enrich vulnerability data
const enrichedData = {
  ...vulnerability,
  assetContext: await getAssetDetails(vulnerability.assetId),
  historicalData: await getHistoricalVulnerabilities(vulnerability.cveId),
  remediationSteps: await getRemediationGuidance(vulnerability.cveId)
};
```

### **Rate Limiting & Pagination**

The node automatically handles:
- **Rate Limiting**: Exponential backoff for 429 responses
- **Pagination**: Automatic fetching of large result sets
- **Error Handling**: Retry logic for transient failures

---

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Authentication Errors**
```
Error: Invalid API key or organization UUID
```
**Solution**: Verify credentials in n8n settings and test connection

#### **Rate Limiting**
```
Error: Too many requests (429)
```
**Solution**: The node automatically handles this with exponential backoff

#### **Empty Results**
```
Warning: No data returned from API
```
**Solution**: Check filter parameters and date ranges

### **Debug Mode**

Enable debug logging in n8n settings:
```json
{
  "N8N_LOG_LEVEL": "debug",
  "N8N_LOG_OUTPUT": "console"
}
```

---

## 📊 **Performance Optimization**

### **Best Practices**

1. **Use Filters**: Always apply relevant filters to reduce data transfer
2. **Limit Results**: Set appropriate limits for large datasets
3. **Cache Results**: Store frequently accessed data in n8n variables
4. **Batch Operations**: Group related operations together

### **Monitoring**

- **API Response Times**: Monitor Cavelo API performance
- **Memory Usage**: Track n8n memory consumption
- **Error Rates**: Monitor failed requests and retries

---

## 🛡️ **Security Considerations**

### **API Key Management**

- Store API keys securely in n8n credentials
- Rotate keys regularly
- Use least-privilege access
- Monitor API usage

### **Data Protection**

- Encrypt sensitive data in transit
- Implement data retention policies
- Regular security audits
- Access logging and monitoring

---

## 🤝 **Contributing**

### **Development Setup**

```bash
# Clone the repository
git clone https://github.com/cavelo/n8n-nodes-cavelo.git
cd n8n-nodes-cavelo

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### **Code Standards**

- **TypeScript**: Use strict typing
- **ESLint**: Follow configured rules
- **Prettier**: Consistent code formatting
- **Testing**: Unit tests for all functions

### **Pull Request Process**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

---

## 📚 **Additional Resources**

### **Documentation**

- [Cavelo API Documentation](https://docs.cavelo.com/api)
- [n8n Community Nodes Guide](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Workflow Examples](https://docs.n8n.io/workflows/)

### **Support**

- **GitHub Issues**: [Report bugs and request features](https://github.com/viyusmanji/n8n-cavelo-nodes/issues)
- **Community Forum**: [n8n Community](https://community.n8n.io/)
- **NPMJS Profile**: [sullyman on NPMJS](https://www.npmjs.com/~sullyman)

### **Changelog**

#### **v1.0.0** (2024-01-15)
- Initial release
- Vulnerability search and monitoring
- PII discovery and alerting
- Access audit monitoring
- CIS benchmark compliance tracking
- Polling triggers for real-time notifications
- Comprehensive workflow examples

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by Suleman Manji**

[GitHub Repository](https://github.com/viyusmanji/n8n-cavelo-nodes) • [NPMJS Profile](https://www.npmjs.com/~sullyman) • [Issues](https://github.com/viyusmanji/n8n-cavelo-nodes/issues)

</div>
