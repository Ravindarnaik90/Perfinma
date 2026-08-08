import '@testing-library/jest-dom';

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup/Unmount components after each test
afterEach(() => {
  cleanup();
});