import assert from 'node:assert/strict';
import test from 'node:test';

import { projectIds } from '@portfolio-tq/types';

import {
  defaultFeatureFlags,
  projectModuleMetadata,
  projectModuleMetadataById,
  seedDataGroupDescriptors,
  seedDataGroupDescriptorsById,
} from '../src/index.ts';

test('project module metadata covers every shared project', () => {
  assert.deepEqual(
    projectModuleMetadata.map((module) => module.id),
    [...projectIds],
  );

  for (const module of projectModuleMetadata) {
    assert.equal(projectModuleMetadataById[module.id], module);
    assert.match(module.demoRoute, /^\/demo\//);
    assert.match(module.projectRoute, /^\/projects\//);
    assert.ok(module.proofTags.length > 0);
  }
});

test('seed data descriptors distinguish file seeds from runtime data', () => {
  assert.deepEqual(
    seedDataGroupDescriptors.map((descriptor) => descriptor.id),
    ['payment-cases', 'investing-cases', 'legacy-intakes', 'policy-documents'],
  );
  assert.equal(
    seedDataGroupDescriptorsById['payment-cases'].source,
    'file_seed',
  );
  assert.equal(
    seedDataGroupDescriptorsById['policy-documents'].recordKind,
    'document',
  );
});

test('feature flag defaults cover the shared vocabulary', () => {
  assert.equal(defaultFeatureFlags.mock_tools_enabled.enabled, true);
  assert.equal(defaultFeatureFlags.demo_access_gate.enabled, false);
  assert.equal(defaultFeatureFlags.observability_live_data.enabled, true);
});
