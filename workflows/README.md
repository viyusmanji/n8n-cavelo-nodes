# Cavelo n8n Workflows

This directory contains sample n8n workflows that demonstrate how to use the Cavelo nodes for various security automation scenarios.

## Available Workflows

### 01-critical-vulnerability-alert.json
**Purpose**: Automatically create tickets in ConnectWise when critical vulnerabilities are discovered
**Triggers**: New critical vulnerabilities from Cavelo
**Actions**: 
- Creates ConnectWise ticket with vulnerability details
- Assigns to security team
- Sets priority based on CVSS score

### 02-pii-compliance-alert.json
**Purpose**: Monitor PII discovery and ensure compliance reporting
**Triggers**: New PII discoveries from Cavelo
**Actions**:
- Sends Slack notification to compliance team
- Creates compliance report in Google Sheets
- Escalates to legal team if sensitive data found

### 03-suspicious-access-investigation.json
**Purpose**: Investigate suspicious access patterns and potential security incidents
**Triggers**: New access audit entries from Cavelo
**Actions**:
- Analyzes access patterns for anomalies
- Creates investigation tickets in Jira
- Sends alerts to security team
- Generates incident reports

### 04-weekly-security-posture-report.json
**Purpose**: Generate comprehensive weekly security posture reports
**Triggers**: Scheduled every Monday at 9 AM
**Actions**:
- Analyzes vulnerabilities, PII discoveries, and benchmark failures
- Calculates risk scores and compliance metrics
- Generates HTML reports with executive summaries
- Sends reports to security team and executives

### 05-asset-discovery-sync.json
**Purpose**: Automate asset onboarding and security classification
**Triggers**: New assets discovered by Cavelo
**Actions**:
- Enriches asset data with security context
- Calculates risk scores and criticality
- Creates Jira tickets for asset onboarding
- Syncs asset information to IT Glue
- Sends Slack alerts for critical assets

### 06-vulnerability-remediation-tracking.json
**Purpose**: Track vulnerability remediation lifecycle and SLA compliance
**Triggers**: New high and critical vulnerabilities from Cavelo
**Actions**:
- Calculates risk scores and remediation priorities
- Creates Jira tickets with SLA deadlines
- Generates remediation timelines and milestones
- Tracks progress and sends status updates
- Monitors SLA compliance and escalates overdue items

### 07-compliance-gap-analysis.json
**Purpose**: Monthly compliance gap analysis and remediation planning
**Triggers**: Scheduled on the 1st of every month
**Actions**:
- Analyzes benchmark failures, vulnerabilities, and PII discoveries
- Calculates compliance rates and risk scores
- Generates executive summaries and action plans
- Creates comprehensive HTML reports
- Sends reports to executives and compliance teams

## How to Use

1. Import the workflow JSON files into your n8n instance
2. Configure the Cavelo credentials in each workflow
3. Set up the required external service credentials (ConnectWise, Slack, etc.)
4. Customize the workflow logic based on your organization's needs
5. Test the workflows with sample data

## Customization

Each workflow can be customized to:
- Change notification channels
- Modify ticket creation logic
- Add additional data processing steps
- Integrate with other security tools
- Adjust alert thresholds and filters

## Prerequisites

- n8n instance with Cavelo nodes installed
- Valid Cavelo API credentials
- Access to external services (ConnectWise, Slack, Jira, etc.)
- Appropriate permissions for ticket creation and notifications