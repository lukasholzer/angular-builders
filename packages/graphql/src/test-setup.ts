import { fs } from 'memfs';

// Mock node fs with memfs to have lightening fast tests */
jest.mock('fs', () => fs);
