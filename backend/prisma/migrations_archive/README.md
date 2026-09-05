# Archived Prisma migrations

These migrations were archived when baselining the production database for Prisma Migrate (P3005).

The live migration history now starts at `prisma/migrations/0_init`, which matches the current `schema.prisma`.

Do not re-apply these archived migrations against production — they include destructive steps (drop tables/columns) that are unsafe on an existing database.
