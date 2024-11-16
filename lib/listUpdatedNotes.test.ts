import { describe, it, expect, vi } from 'vitest';
import { listUpdatedNotes } from './listUpdatedNotes';
import { readdir, statSync } from 'fs';

vi.mock('fs');

describe('listUpdatedNotes', () => {
  it('should list updated markdown files', () => {
    const mockFiles = ['file1.md', 'file2.md', 'file3.txt'];
    const lastUpdatedAt = new Date('2023-01-01T00:00:00Z');
    const mockStats = {
      mtime: new Date('2023-02-01T00:00:00Z'),
    };

    vi.mocked(readdir).mockImplementation((path, callback) => {
      callback(null, mockFiles);
    });

    vi.mocked(statSync).mockImplementation((path) => {
      return mockStats;
    });

    const result = listUpdatedNotes('/mock/path', lastUpdatedAt);
    expect(result).toEqual(['file1.md', 'file2.md']);
  });

  it('should handle files that are not updated', () => {
    const mockFiles = ['file1.md', 'file2.md'];
    const lastUpdatedAt = new Date('2023-03-01T00:00:00Z');
    const mockStats = {
      mtime: new Date('2023-02-01T00:00:00Z'),
    };

    vi.mocked(readdir).mockImplementation((path, callback) => {
      callback(null, mockFiles);
    });

    vi.mocked(statSync).mockImplementation((path) => {
      return mockStats;
    });

    const result = listUpdatedNotes('/mock/path', lastUpdatedAt);
    expect(result).toEqual([]);
  });
});
