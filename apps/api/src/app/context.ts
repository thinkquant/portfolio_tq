import type { Firestore } from '@google-cloud/firestore';

import type { RuntimeConfig } from '../config/runtime.js';
import type { Logger } from '../services/logs.js';

export type AppContext = {
  config: RuntimeConfig;
  firestore: Firestore | null;
  logger: Logger;
};
