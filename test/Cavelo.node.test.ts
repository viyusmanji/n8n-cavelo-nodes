import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock n8n-workflow
const mockExecuteFunctions = {
	getCredentials: jest.fn(),
	getNodeParameter: jest.fn(),
	getInputData: jest.fn(),
	continueOnFail: jest.fn(),
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

import { Cavelo } from '../nodes/Cavelo/Cavelo';

describe('Cavelo Node', () => {
	let caveloNode: Cavelo;

	beforeEach(() => {
		caveloNode = new Cavelo();
		jest.clearAllMocks();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(caveloNode.description.displayName).toBe('Cavelo');
		});

		it('should have correct name', () => {
			expect(caveloNode.description.name).toBe('cavelo');
		});

		it('should have correct group', () => {
			expect(caveloNode.description.group).toEqual(['transform']);
		});

		it('should have correct version', () => {
			expect(caveloNode.description.version).toBe(1);
		});

		it('should have required credentials', () => {
			expect(caveloNode.description.credentials).toHaveLength(1);
			expect(caveloNode.description.credentials[0].name).toBe('caveloApi');
			expect(caveloNode.description.credentials[0].required).toBe(true);
		});
	});

	describe('Resource Options', () => {
		it('should have all required resources', () => {
			const resourceProperty = caveloNode.description.properties.find(
				prop => prop.name === 'resource'
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty?.options).toHaveLength(4);
			
			const resourceNames = resourceProperty?.options?.map(option => option.value);
			expect(resourceNames).toContain('vulnerability');
			expect(resourceNames).toContain('pii');
			expect(resourceNames).toContain('accessAudit');
			expect(resourceNames).toContain('benchmark');
		});
	});

	describe('Vulnerability Operations', () => {
		it('should have vulnerability operations', () => {
			const vulnerabilityOps = caveloNode.description.properties.filter(
				prop => prop.displayOptions?.show?.resource?.includes('vulnerability')
			);
			expect(vulnerabilityOps.length).toBeGreaterThan(0);
		});
	});

	describe('PII Operations', () => {
		it('should have PII operations', () => {
			const piiOps = caveloNode.description.properties.filter(
				prop => prop.displayOptions?.show?.resource?.includes('pii')
			);
			expect(piiOps.length).toBeGreaterThan(0);
		});
	});

	describe('Access Audit Operations', () => {
		it('should have access audit operations', () => {
			const accessAuditOps = caveloNode.description.properties.filter(
				prop => prop.displayOptions?.show?.resource?.includes('accessAudit')
			);
			expect(accessAuditOps.length).toBeGreaterThan(0);
		});
	});

	describe('Benchmark Operations', () => {
		it('should have benchmark operations', () => {
			const benchmarkOps = caveloNode.description.properties.filter(
				prop => prop.displayOptions?.show?.resource?.includes('benchmark')
			);
			expect(benchmarkOps.length).toBeGreaterThan(0);
		});
	});
});
