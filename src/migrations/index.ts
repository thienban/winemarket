import * as migration_20250803_050932_migration from './20250803_050932_migration';

export const migrations = [
  {
    up: migration_20250803_050932_migration.up,
    down: migration_20250803_050932_migration.down,
    name: '20250803_050932_migration'
  },
];
