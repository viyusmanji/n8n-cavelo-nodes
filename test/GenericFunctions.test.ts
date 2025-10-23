import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock n8n-workflow
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

import {
	buildDateRangeFilters,
	calculateDaysSinceDiscovery,
	formatSeverity,
	isBusinessHours,
	calculateRiskScore,
} from '../nodes/Cavelo/GenericFunctions';

describe('GenericFunctions', () => {
	describe('buildDateRangeFilters', () => {
		it('should build last24h filters correctly', () => {
			const filters = buildDateRangeFilters('last24h', 'startField', 'endField');
			expect(filters).toHaveProperty('startField');
			expect(new Date(filters.startField)).toBeInstanceOf(Date);
		});

		it('should build last7days filters correctly', () => {
			const filters = buildDateRangeFilters('last7days', 'startField', 'endField');
			expect(filters).toHaveProperty('startField');
			const startDate = new Date(filters.startField);
			const now = new Date();
			const diffDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
			expect(diffDays).toBeLessThanOrEqual(7);
		});

		it('should build last30days filters correctly', () => {
			const filters = buildDateRangeFilters('last30days', 'startField', 'endField');
			expect(filters).toHaveProperty('startField');
			const startDate = new Date(filters.startField);
			const now = new Date();
			const diffDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
			expect(diffDays).toBeLessThanOrEqual(30);
		});

		it('should return empty object for custom range', () => {
			const filters = buildDateRangeFilters('custom', 'startField', 'endField');
			expect(filters).toEqual({});
		});
	});

	describe('calculateDaysSinceDiscovery', () => {
		it('should calculate days correctly for recent date', () => {
			const recentDate = new Date();
			recentDate.setDate(recentDate.getDate() - 5);
			const days = calculateDaysSinceDiscovery(recentDate.toISOString());
			expect(days).toBe(5);
		});

		it('should calculate days correctly for old date', () => {
			const oldDate = new Date();
			oldDate.setDate(oldDate.getDate() - 30);
			const days = calculateDaysSinceDiscovery(oldDate.toISOString());
			expect(days).toBe(30);
		});
	});

	describe('formatSeverity', () => {
		it('should format critical severity correctly', () => {
			expect(formatSeverity(9.5)).toBe('Critical');
			expect(formatSeverity(9.0)).toBe('Critical');
		});

		it('should format high severity correctly', () => {
			expect(formatSeverity(8.5)).toBe('High');
			expect(formatSeverity(7.0)).toBe('High');
		});

		it('should format medium severity correctly', () => {
			expect(formatSeverity(6.5)).toBe('Medium');
			expect(formatSeverity(4.0)).toBe('Medium');
		});

		it('should format low severity correctly', () => {
			expect(formatSeverity(3.5)).toBe('Low');
			expect(formatSeverity(1.0)).toBe('Low');
		});

		it('should handle undefined score', () => {
			expect(formatSeverity(undefined)).toBe('Unknown');
		});
	});

	describe('isBusinessHours', () => {
		it('should return true for business hours', () => {
			const businessDate = new Date('2024-01-15T14:30:00Z'); // Monday 2:30 PM
			expect(isBusinessHours(businessDate.toISOString())).toBe(true);
		});

		it('should return false for off-hours', () => {
			const offHoursDate = new Date('2024-01-15T22:30:00Z'); // Monday 10:30 PM
			expect(isBusinessHours(offHoursDate.toISOString())).toBe(false);
		});

		it('should return false for weekends', () => {
			const weekendDate = new Date('2024-01-13T14:30:00Z'); // Saturday 2:30 PM
			expect(isBusinessHours(weekendDate.toISOString())).toBe(false);
		});
	});

	describe('calculateRiskScore', () => {
		it('should calculate high risk score for delete action', () => {
			const event = {
				action: 'delete',
				eventTime: '2024-01-15T14:30:00Z',
				success: true,
			};
			const score = calculateRiskScore(event);
			expect(score).toBe(10);
		});

		it('should calculate high risk score for failed access', () => {
			const event = {
				action: 'read',
				eventTime: '2024-01-15T14:30:00Z',
				success: false,
			};
			const score = calculateRiskScore(event);
			expect(score).toBe(15);
		});

		it('should calculate medium risk score for off-hours access', () => {
			const event = {
				action: 'read',
				eventTime: '2024-01-15T22:30:00Z', // Off-hours
				success: true,
			};
			const score = calculateRiskScore(event);
			expect(score).toBe(5);
		});

		it('should calculate combined risk score', () => {
			const event = {
				action: 'delete',
				eventTime: '2024-01-15T22:30:00Z', // Off-hours
				success: false,
			};
			const score = calculateRiskScore(event);
			expect(score).toBe(30); // 10 (delete) + 5 (off-hours) + 15 (failed)
		});
	});
});
