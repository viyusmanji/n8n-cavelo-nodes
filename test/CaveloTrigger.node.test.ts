import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock n8n-workflow
const mockExecuteFunctions = {
	getCredentials: jest.fn(),
	getNodeParameter: jest.fn(),
	getInputData: jest.fn(),
	continueOnFail: jest.fn(),
	getWorkflowStaticData: jest.fn(),
	helpers: {
		httpRequest: jest.fn(),
	},
	logger: {
		info: jest.fn(),
		error: jest.fn(),
	},
};

jest.mock('n8n-workflow', () => ({
	NodeApiError: jest.fn().mockImplementation((node, error) => {
		const err = new Error(error.message);
		err.name = 'NodeApiError';
		return err;
	}),
	NodeOperationError: jest.fn().mockImplementation((node, message) => {
		const err = new Error(message);
		err.name = 'NodeOperationError';
		return err;
	}),
}));

// Mock the GenericFunctions module
jest.mock('../nodes/Cavelo/GenericFunctions', () => ({
	caveloApiRequest: jest.fn(),
	caveloApiRequestAllItems: jest.fn(),
	buildDateRangeFilters: jest.fn(),
	calculateDaysSinceDiscovery: jest.fn(),
	formatSeverity: jest.fn(),
}));

import { CaveloTrigger } from '../nodes/Cavelo/CaveloTrigger';

describe('CaveloTrigger Node', () => {
	let caveloTriggerNode: CaveloTrigger;

	beforeEach(() => {
		caveloTriggerNode = new CaveloTrigger();
		jest.clearAllMocks();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(caveloTriggerNode.description.displayName).toBe('Cavelo Trigger');
		});

		it('should have correct name', () => {
			expect(caveloTriggerNode.description.name).toBe('caveloTrigger');
		});

		it('should have correct group', () => {
			expect(caveloTriggerNode.description.group).toEqual(['trigger']);
		});

		it('should have correct version', () => {
			expect(caveloTriggerNode.description.version).toBe(1);
		});

		it('should have no inputs', () => {
			expect(caveloTriggerNode.description.inputs).toHaveLength(0);
		});

		it('should have one output', () => {
			expect(caveloTriggerNode.description.outputs).toHaveLength(1);
		});

		it('should have required credentials', () => {
			expect(caveloTriggerNode.description.credentials).toHaveLength(1);
			expect(caveloTriggerNode.description.credentials[0].name).toBe('caveloApi');
			expect(caveloTriggerNode.description.credentials[0].required).toBe(true);
		});
	});

	describe('Trigger Types', () => {
		it('should have all required trigger types', () => {
			const triggerTypeProperty = caveloTriggerNode.description.properties.find(
				prop => prop.name === 'triggerType'
			);
			expect(triggerTypeProperty).toBeDefined();
			expect(triggerTypeProperty?.options).toHaveLength(3);
			
			const triggerTypeNames = triggerTypeProperty?.options?.map(option => option.value);
			expect(triggerTypeNames).toContain('newVulnerabilities');
			expect(triggerTypeNames).toContain('newPii');
			expect(triggerTypeNames).toContain('newAccessAudits');
		});
	});

	describe('Polling Configuration', () => {
		it('should have polling interval parameter', () => {
			const pollingIntervalProperty = caveloTriggerNode.description.properties.find(
				prop => prop.name === 'pollingInterval'
			);
			expect(pollingIntervalProperty).toBeDefined();
			expect(pollingIntervalProperty?.type).toBe('number');
			expect(pollingIntervalProperty?.default).toBe(15);
		});
	});

	describe('Vulnerability Trigger Options', () => {
		it('should have severity threshold options', () => {
			const severityProperty = caveloTriggerNode.description.properties.find(
				prop => prop.name === 'severityThreshold'
			);
			expect(severityProperty).toBeDefined();
			expect(severityProperty?.displayOptions?.show?.triggerType).toContain('newVulnerabilities');
		});

		it('should have hostname filter option', () => {
			const hostnameProperty = caveloTriggerNode.description.properties.find(
				prop => prop.name === 'hostnameFilter'
			);
			expect(hostnameProperty).toBeDefined();
			expect(hostnameProperty?.displayOptions?.show?.triggerType).toContain('newVulnerabilities');
		});
	});

	describe('PII Trigger Options', () => {
		it('should have PII classifications options', () => {
			const classificationsProperty = caveloTriggerNode.description.properties.find(
				prop => prop.name === 'piiClassifications'
			);
			expect(classificationsProperty).toBeDefined();
			expect(classificationsProperty?.displayOptions?.show?.triggerType).toContain('newPii');
		});

		it('should have high-risk PII option', () => {
			const highRiskProperty = caveloTriggerNode.description.properties.find(
				prop => prop.name === 'highRiskOnly'
			);
			expect(highRiskProperty).toBeDefined();
			expect(highRiskProperty?.displayOptions?.show?.triggerType).toContain('newPii');
		});
	});

	describe('Access Audit Trigger Options', () => {
		it('should have monitored actions options', () => {
			const actionsProperty = caveloTriggerNode.description.properties.find(
				prop => prop.name === 'monitoredActions'
			);
			expect(actionsProperty).toBeDefined();
			expect(actionsProperty?.displayOptions?.show?.triggerType).toContain('newAccessAudits');
		});

		it('should have suspicious activity option', () => {
			const suspiciousProperty = caveloTriggerNode.description.properties.find(
				prop => prop.name === 'suspiciousOnly'
			);
			expect(suspiciousProperty).toBeDefined();
			expect(suspiciousProperty?.displayOptions?.show?.triggerType).toContain('newAccessAudits');
		});

		it('should have off-hours option', () => {
			const offHoursProperty = caveloTriggerNode.description.properties.find(
				prop => prop.name === 'offHoursOnly'
			);
			expect(offHoursProperty).toBeDefined();
			expect(offHoursProperty?.displayOptions?.show?.triggerType).toContain('newAccessAudits');
		});
	});
});
