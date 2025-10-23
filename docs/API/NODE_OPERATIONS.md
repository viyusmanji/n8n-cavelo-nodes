# Node Operations API Reference

<div align="center">

![API Reference](https://img.shields.io/badge/API-Reference-blue)
![Operations](https://img.shields.io/badge/Operations-20+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-4.8+-blue)

**Comprehensive API reference for Cavelo n8n nodes**

</div>

---

## 📋 **Overview**

This document provides detailed information about all available operations in the Cavelo n8n nodes, including parameters, response formats, and usage examples.

### **Node Types**
- **Cavelo Node**: Main operations node for data retrieval and manipulation
- **Cavelo Trigger**: Polling-based trigger node for real-time notifications

---

## 🔍 **Vulnerability Operations**

### **Search Vulnerabilities**

**Resource**: `vulnerability`  
**Operation**: `search`

Searches for vulnerabilities based on specified filters and returns paginated results.

#### **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cveV2BaseScore` | number | No | Minimum CVSS v2 base score |
| `cveV3BaseScore` | number | No | Minimum CVSS v3 base score |
| `severities` | string[] | No | Array of severity levels |
| `hostnames` | string[] | No | Array of hostnames to filter |
| `agentUuids` | string[] | No | Array of agent UUIDs |
| `dateRange` | string | No | Date range filter |
| `limit` | number | No | Maximum number of results (default: 50) |

#### **Example Request**
```json
{
  "resource": "vulnerability",
  "operation": "search",
  "filters": {
    "cveV3BaseScore": 7.0,
    "severities": ["critical", "high"],
    "hostnames": ["prod-web-01", "prod-db-01"],
    "dateRange": "last7Days",
    "limit": 100
  }
}
```

#### **Example Response**
```json
{
  "data": [
    {
      "vulnerabilityId": "CVE-2024-1234",
      "title": "Critical Remote Code Execution",
      "cveId": "CVE-2024-1234",
      "cvssV2BaseScore": 9.3,
      "cvssV3BaseScore": 9.8,
      "severity": "critical",
      "description": "A critical vulnerability allowing remote code execution...",
      "assetId": "asset-123",
      "hostname": "prod-web-01",
      "ipAddress": "192.168.1.100",
      "affectedProducts": ["Apache HTTP Server 2.4.41"],
      "vulnerabilityScanTime": "2024-01-15T10:30:00Z",
      "firstSeen": "2024-01-15T10:30:00Z",
      "lastSeen": "2024-01-15T10:30:00Z",
      "status": "open",
      "tags": ["web", "production", "critical"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 250,
    "itemsPerPage": 50,
    "nextPage": 2,
    "previousPage": null
  }
}
```

### **Get Vulnerability by Target**

**Resource**: `vulnerability`  
**Operation**: `getByTarget`

Retrieves vulnerabilities for a specific target (hostname or IP address).

#### **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `target` | string | Yes | Hostname or IP address |
| `severities` | string[] | No | Array of severity levels |
| `limit` | number | No | Maximum number of results |

#### **Example Request**
```json
{
  "resource": "vulnerability",
  "operation": "getByTarget",
  "target": "prod-web-01",
  "filters": {
    "severities": ["critical", "high"],
    "limit": 50
  }
}
```

### **Get Historical Vulnerabilities**

**Resource**: `vulnerability`  
**Operation**: `getHistorical`

Retrieves historical vulnerability data for trend analysis.

#### **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cveId` | string | Yes | CVE identifier |
| `dateRange` | string | No | Date range for historical data |
| `limit` | number | No | Maximum number of results |

---

## 🔒 **PII Operations**

### **Search PII**

**Resource**: `pii`  
**Operation**: `search`

Searches for personally identifiable information based on classification and filters.

#### **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `classifications` | string[] | No | Array of PII types |
| `inventoryTags` | string[] | No | Array of inventory tags |
| `sourceTypes` | string[] | No | Array of source types |
| `confidence` | number | No | Minimum confidence score (0-100) |
| `hostnames` | string[] | No | Array of hostnames |
| `dateRange` | string | No | Date range filter |
| `limit` | number | No | Maximum number of results |

#### **Example Request**
```json
{
  "resource": "pii",
  "operation": "search",
  "filters": {
    "classifications": ["SSN", "Credit Card"],
    "confidence": 80,
    "sourceTypes": ["agent", "cloud"],
    "dateRange": "last30Days",
    "limit": 100
  }
}
```

#### **Example Response**
```json
{
  "data": [
    {
      "piiId": "PII-2024-001",
      "classification": "SSN",
      "confidence": 95,
      "filePath": "/var/data/employee_records.csv",
      "assetId": "asset-456",
      "hostname": "hr-server-01",
      "ipAddress": "192.168.1.200",
      "sourceType": "agent",
      "scanTime": "2024-01-15T14:20:00Z",
      "firstSeen": "2024-01-15T14:20:00Z",
      "lastSeen": "2024-01-15T14:20:00Z",
      "context": "Employee database containing social security numbers",
      "tags": ["hr", "sensitive", "employee-data"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 150,
    "itemsPerPage": 50
  }
}
```

### **Get PII by Target**

**Resource**: `pii`  
**Operation**: `getByTarget`

Retrieves PII discoveries for a specific target.

#### **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `target` | string | Yes | Hostname or IP address |
| `classifications` | string[] | No | Array of PII types |
| `limit` | number | No | Maximum number of results |

---

## 📊 **Access Audit Operations**

### **Search Access Audits**

**Resource**: `accessAudit`  
**Operation**: `search`

Searches for data access events and audit logs.

#### **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userIds` | string[] | No | Array of user IDs |
| `actions` | string[] | No | Array of actions performed |
| `dateRange` | string | No | Date range filter |
| `ipAddresses` | string[] | No | Array of IP addresses |
| `hostnames` | string[] | No | Array of hostnames |
| `limit` | number | No | Maximum number of results |

#### **Example Request**
```json
{
  "resource": "accessAudit",
  "operation": "search",
  "filters": {
    "userIds": ["user123", "user456"],
    "actions": ["read", "write", "download"],
    "dateRange": "last7Days",
    "limit": 200
  }
}
```

#### **Example Response**
```json
{
  "data": [
    {
      "auditId": "AUDIT-2024-001",
      "userId": "user123",
      "userName": "john.doe",
      "action": "download",
      "resource": "/sensitive/data/file.pdf",
      "assetId": "asset-789",
      "hostname": "file-server-01",
      "ipAddress": "192.168.1.50",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2024-01-15T16:45:00Z",
      "sessionId": "session-abc123",
      "geoLocation": {
        "country": "US",
        "region": "CA",
        "city": "San Francisco"
      },
      "result": "success",
      "tags": ["sensitive", "download", "audit"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 500,
    "itemsPerPage": 50
  }
}
```

---

## ✅ **Benchmark Operations**

### **Search Benchmarks**

**Resource**: `benchmark`  
**Operation**: `search`

Searches for CIS benchmark compliance results.

#### **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `statuses` | string[] | No | Array of status values |
| `categories` | string[] | No | Array of benchmark categories |
| `hostnames` | string[] | No | Array of hostnames |
| `benchmarkIds` | string[] | No | Array of specific benchmark IDs |
| `dateRange` | string | No | Date range filter |
| `limit` | number | No | Maximum number of results |

#### **Example Request**
```json
{
  "resource": "benchmark",
  "operation": "search",
  "filters": {
    "statuses": ["fail", "error"],
    "categories": ["access_control", "audit_logging"],
    "dateRange": "last30Days",
    "limit": 100
  }
}
```

#### **Example Response**
```json
{
  "data": [
    {
      "benchmarkId": "CIS-1.1.1",
      "title": "Ensure mounting of cramfs filesystems is disabled",
      "status": "fail",
      "category": "access_control",
      "description": "The cramfs filesystem type is a compressed read-only Linux filesystem...",
      "assetId": "asset-321",
      "hostname": "linux-server-01",
      "ipAddress": "192.168.1.75",
      "scanTime": "2024-01-15T08:00:00Z",
      "firstSeen": "2024-01-15T08:00:00Z",
      "lastSeen": "2024-01-15T08:00:00Z",
      "remediation": "Edit or create the file /etc/modprobe.d/CIS.conf...",
      "tags": ["linux", "filesystem", "security"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 8,
    "totalItems": 400,
    "itemsPerPage": 50
  }
}
```

---

## ⚡ **Trigger Operations**

### **New Vulnerabilities Trigger**

**Node**: `CaveloTrigger`  
**Trigger Type**: `newVulnerabilities`

Monitors for new vulnerabilities based on severity threshold.

#### **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `severityThreshold` | string | Yes | Minimum severity level |
| `pollingInterval` | number | Yes | Polling interval in minutes |
| `filters` | object | No | Additional filter criteria |

#### **Example Configuration**
```json
{
  "triggerType": "newVulnerabilities",
  "severityThreshold": "high",
  "pollingInterval": 15,
  "filters": {
    "hostnames": ["prod-*"],
    "cvssV3BaseScore": 7.0
  }
}
```

### **New PII Trigger**

**Node**: `CaveloTrigger`  
**Trigger Type**: `newPii`

Monitors for new PII discoveries based on classification.

#### **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `classifications` | string[] | Yes | Array of PII types to monitor |
| `pollingInterval` | number | Yes | Polling interval in minutes |
| `confidence` | number | No | Minimum confidence score |

### **New Access Audits Trigger**

**Node**: `CaveloTrigger`  
**Trigger Type**: `newAccessAudits`

Monitors for new access audit entries.

#### **Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pollingInterval` | number | Yes | Polling interval in minutes |
| `actions` | string[] | No | Array of actions to monitor |
| `userIds` | string[] | No | Array of user IDs to monitor |

---

## 🔧 **Common Parameters**

### **Date Range Options**

| Value | Description |
|-------|-------------|
| `last24Hours` | Last 24 hours |
| `last7Days` | Last 7 days |
| `last30Days` | Last 30 days |
| `last90Days` | Last 90 days |
| `lastYear` | Last 365 days |

### **Severity Levels**

| Level | Description | CVSS Range |
|-------|-------------|------------|
| `critical` | Critical severity | 9.0 - 10.0 |
| `high` | High severity | 7.0 - 8.9 |
| `medium` | Medium severity | 4.0 - 6.9 |
| `low` | Low severity | 0.1 - 3.9 |

### **PII Classifications**

| Classification | Description |
|----------------|-------------|
| `SSN` | Social Security Number |
| `Credit Card` | Credit Card Number |
| `Bank Account` | Bank Account Number |
| `Driver License` | Driver's License Number |
| `Passport` | Passport Number |
| `Email` | Email Address |
| `Phone` | Phone Number |

### **Access Audit Actions**

| Action | Description |
|--------|-------------|
| `read` | Read access |
| `write` | Write access |
| `delete` | Delete access |
| `download` | Download access |
| `upload` | Upload access |
| `modify` | Modify access |

---

## 📊 **Response Formats**

### **Standard Response Structure**

```typescript
interface CaveloApiResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    nextPage?: number;
    previousPage?: number;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}
```

### **Error Response Structure**

```typescript
interface CaveloApiError {
  error: {
    code: string;
    message: string;
    details?: string;
  };
  requestId: string;
  timestamp: string;
}
```

---

## 🚨 **Error Handling**

### **Common Error Codes**

| Code | Description | Resolution |
|------|-------------|------------|
| `AUTHENTICATION_FAILED` | Invalid API key | Check credentials |
| `INVALID_ORGANIZATION` | Invalid organization UUID | Verify organization ID |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait and retry |
| `INVALID_FILTERS` | Invalid filter parameters | Check filter syntax |
| `RESOURCE_NOT_FOUND` | Resource not found | Verify resource exists |

### **Rate Limiting**

The API implements rate limiting with the following limits:
- **Standard**: 100 requests per minute
- **Burst**: 200 requests per minute
- **Retry-After**: Header indicates when to retry

---

## 📝 **Usage Examples**

### **Basic Vulnerability Search**

```javascript
// Search for critical vulnerabilities in production
const response = await caveloApiRequest.call(this, 'GET', '/vulnerabilities', {
  cveV3BaseScore: 9.0,
  severities: ['critical'],
  hostnames: ['prod-*'],
  limit: 50
});
```

### **PII Discovery with Confidence Filter**

```javascript
// Search for high-confidence PII discoveries
const response = await caveloApiRequest.call(this, 'GET', '/pii', {
  classifications: ['SSN', 'Credit Card'],
  confidence: 90,
  dateRange: 'last7Days',
  limit: 100
});
```

### **Access Audit Analysis**

```javascript
// Analyze access patterns for specific users
const response = await caveloApiRequest.call(this, 'GET', '/access-audits', {
  userIds: ['user123', 'user456'],
  actions: ['download', 'write'],
  dateRange: 'last30Days',
  limit: 200
});
```

---

<div align="center">

**Need more help?**

[Workflow Examples](WORKFLOWS/SECURITY_AUTOMATION.md) • [Troubleshooting](TROUBLESHOOTING.md) • [Support](mailto:support@cavelo.com)

</div>
