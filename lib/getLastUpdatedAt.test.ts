import { describe, it, expect, vi, afterEach } from 'vitest';
import { getLastUpdatedAt } from './getLastUpdatedAt';
import { readFileSync } from 'fs';

vi.mock('fs');

describe('getLastUpdatedAt', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return the date from the lastUpdatedAt file', () => {
    const mockDate = '2023-01-01T00:00:00Z';
    vi.mocked(readFileSync).mockReturnValue(mockDate);

    const result = getLastUpdatedAt();
    expect(result).toEqual(new Date(mockDate));
  });

  it('should return the epoch date if the lastUpdatedAt file does not exist', () => {
    vi.mocked(readFileSync).mockImplementation(() => {
      throw new Error('File not found');
    });

    const result = getLastUpdatedAt();
    expect(result).toEqual(new Date(0));
  });

  it('should return the epoch date if the lastUpdatedAt file is empty', () => {
    vi.mocked(readFileSync).mockReturnValue('');

    const result = getLastUpdatedAt();
    expect(result).toEqual(new Date(0));
  });

  it('should return the epoch date if the lastUpdatedAt file contains invalid date', () => {
    vi.mocked(readFileSync).mockReturnValue('invalid-date');

    const result = getLastUpdatedAt();
    expect(result).toEqual(new Date(0));
  });
});
