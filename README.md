# n8n-nodes-cavelo

[![npm version](https://badge.fury.io/js/n8n-nodes-cavelo.svg)](https://badge.fury.io/js/n8n-nodes-cavelo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive n8n community node for integrating with the Cavelo Attack Surface Management platform. This node provides automation capabilities for vulnerability management, PII discovery, access auditing, and compliance monitoring.

## Features

- **Vulnerability Management**: Search, filter, and monitor vulnerabilities with CVSS scoring
- **PII Discovery**: Track and alert on sensitive data exposure
- **Access Auditing**: Monitor data access events for compliance
- **CIS Benchmarking**: Track compliance with security benchmarks
- **Polling Triggers**: Real-time notifications for new security events
- **Rate Limiting**: Built-in handling of API rate limits with exponential backoff
- **Pagination**: Automatic handling of large result sets

## Installation

```bash
npm install n8n-nodes-cavelo
```

> **Note**: This package is designed for n8n community nodes. Make sure you have n8n installed and running before installing this package.

## Setup

### 1. Create API Key

1. Log in to your Cavelo dashboard at [https://dashboard.prod.cavelodata.com/](https://dashboard.prod.cavelodata.com/)
2. Navigate to **Settings** → **API Keys**
3. Click **Create New API Key**
4. Configure permissions based on your needs:
   - **Data Discovery**: For PII and inventory data
   - **Data Protection**: For vulnerability and benchmark data
   - **Data Access**: For access audit data
5. Copy the generated API key

### 2. Find Organization UUID

1. In the Cavelo dashboard, navigate to **Settings** → **Organization**
2. Copy the **Organization UUID** from the organization details
3. This UUID is required for all API operations

### 3. Add Credentials in n8n

1. In your n8n instance, go to **Credentials**
2. Click **Add Credential** → **Cavelo API**
3. Enter your API key and organization UUID
4. Test the connection to verify setup

## Usage

### Basic Vulnerability Search

```javascript
// Search for high-severity vulnerabilities
{
  "resource": "Vulnerability",
  "operation": "Search",
  "filters": {
    "cveV3BaseScore": 7.0,
    "severities": ["high", "critical"]
  }
}
```

### PII Discovery Alert

```javascript
// Monitor for high-risk PII
{
  "resource": "PII",
  "operation": "Search",
  "filters": {
    "classifications": ["SSN", "Credit Card", "Bank Account"]
  }
}
```

## Example Workflows

This package includes comprehensive example workflows demonstrating real-world security automation scenarios:

### Immediate Response Workflows
- **Critical Vulnerability Alert**: Automatically create tickets when critical vulnerabilities are discovered
- **PII Compliance Alert**: Monitor PII discovery and ensure compliance reporting
- **Suspicious Access Investigation**: Investigate suspicious access patterns and potential security incidents

### Scheduled Reporting Workflows
- **Weekly Security Posture Report**: Generate comprehensive weekly security posture reports with executive summaries
- **Monthly Compliance Gap Analysis**: Monthly compliance gap analysis and remediation planning

### Operational Workflows
- **Asset Discovery Sync**: Automate asset onboarding and security classification
- **Vulnerability Remediation Tracking**: Track vulnerability remediation lifecycle and SLA compliance

Each workflow demonstrates advanced business logic patterns including:
- Sophisticated risk scoring algorithms
- Data enrichment and transformation
- Priority and SLA management
- Integration with external systems
- Error handling and edge cases
- Scalability considerations

> **Note**: The workflow examples are included in the repository but not in the published npm package to keep the package lightweight. You can find them in the `workflows/` directory of the GitHub repository.

## API Reference

### Resources

| Resource | Operations | Description |
|----------|------------|-------------|
| Vulnerability | Search, Get by Target, Historical | Vulnerability management and tracking |
| PII | Search, Get by Target | Personal information discovery |
| Access Audit | Search | Data access monitoring |
| Benchmark | Search | CIS benchmark compliance |

### Common Filters

#### Vulnerability Filters
- `cveV2BaseScore`: Minimum CVSS v2 score
- `cveV3BaseScore`: Minimum CVSS v3 score
- `severities`: Array of severity levels
- `hostnames`: Array of hostnames to filter
- `agentUuids`: Array of agent UUIDs

#### PII Filters
- `classifications`: Array of PII types (SSN, Credit Card, etc.)
- `inventoryTags`: Array of inventory tags
- `sourceTypes`: Array of source types (agent, cloud, etc.)

#### Access Audit Filters
- `actions`: Array of actions (read, write, delete, etc.)
- `resourceTypes`: Array of resource types
- `userPrincipals`: Array of user principals
- `eventTimeAfter`: Start time for events
- `eventTimeBefore`: End time for events

## Rate Limiting

The Cavelo API uses a sliding window rate limiter. This node automatically handles rate limiting with exponential backoff:

- **429 Too Many Requests**: Automatically retries with increasing delays
- **Max Retries**: 3 attempts with exponential backoff
- **Retry-After Header**: Respects server-specified retry times

## Troubleshooting

### Common Issues

**401 Unauthorized**
- Verify your API key is correct
- Check that the API key has not expired
- Ensure the API key has the required permissions

**403 Forbidden**
- Verify your organization UUID is correct
- Check that your API key has the required RBAC permissions
- Ensure you're not trying to access restricted data

**429 Too Many Requests**
- The node automatically handles rate limiting
- Consider reducing polling frequency for triggers
- Check your organization's rate limit settings

**Invalid Organization UUID**
- Verify the UUID format (should be a valid UUID v4)
- Check that the organization exists in your Cavelo account
- Ensure you have access to the organization

## 📚 Documentation

### **Comprehensive Documentation**
- [**📚 Complete Documentation**](docs/INDEX.md) - Full documentation following 2025 web design standards
- [**🚀 Overview & Usage Guide**](docs/OVERVIEW_AND_USAGE.md) - Complete installation and usage guide
- [**🔧 API Reference**](docs/API/NODE_OPERATIONS.md) - Detailed API documentation
- [**⚡ Workflow Examples**](docs/WORKFLOWS/SECURITY_AUTOMATION.md) - Real-world automation scenarios

### **External Resources**
- [Cavelo API Documentation](https://docs.cavelo.com/api)
- [n8n Community Nodes Guide](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Workflow Examples](https://docs.n8n.io/workflows/)

## Contributing

We welcome contributions! This is a community-driven project for organizational use that benefits the broader n8n and Cavelo communities.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/viyusmanji/n8n-cavelo-nodes.git
cd n8n-cavelo-nodes

# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Run tests
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### 1.0.0
- Initial release
- Vulnerability search and monitoring
- PII discovery and alerting
- Access audit monitoring
- CIS benchmark compliance tracking
- Polling triggers for real-time notifications
- Comprehensive workflow examples
