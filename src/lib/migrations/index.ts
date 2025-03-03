/**
 * Data Migration Utilities
 * 
 * This module exports all migration utilities for schema updates.
 */

export * from './symptoms-schema-migration';

/**
 * Migration versions - used for tracking which migrations have been applied
 */
export const MIGRATION_VERSIONS = {
  INITIAL: '1.0.0',
  SYMPTOMS_MULTI_ITEM: '1.1.0',
  // Add new migration versions here as needed
};

/**
 * Migration registry - maps migration version to description
 */
export const MIGRATIONS_REGISTRY = {
  [MIGRATION_VERSIONS.INITIAL]: 'Initial schema version',
  [MIGRATION_VERSIONS.SYMPTOMS_MULTI_ITEM]: 'Update symptoms schema to support multiple physical and cognitive symptoms',
  // Add new migration entries here as needed
};
