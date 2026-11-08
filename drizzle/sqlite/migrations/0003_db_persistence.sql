-- ARKI F1b — persistencia SICL Web sobre SQLite única (sicl.db)
-- Replica idempotente del esquema de 0000_initial.sql para las 5 tablas
-- de SICL Web. No toca 0000_initial.sql ni 0001/0002 de identity.
-- Fechas: epoch ms (integer). Booleanos: 0/1 (integer).

CREATE TABLE IF NOT EXISTS users (
  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  openId text NOT NULL,
  name text,
  email text,
  loginMethod text,
  role text NOT NULL DEFAULT 'user',
  createdAt integer NOT NULL,
  updatedAt integer NOT NULL,
  lastSignedIn integer NOT NULL,
  CONSTRAINT sqlite_role_check CHECK (role IN ('user', 'admin'))
);
CREATE UNIQUE INDEX IF NOT EXISTS users_openId_unique ON users (openId);

CREATE TABLE IF NOT EXISTS sicl_projects (
  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  ownerId integer NOT NULL,
  projectId text NOT NULL,
  name text NOT NULL,
  location text,
  status text NOT NULL DEFAULT 'DRAFT',
  version integer NOT NULL DEFAULT 1,
  snapshot text NOT NULL,
  createdAt integer NOT NULL,
  updatedAt integer NOT NULL,
  CONSTRAINT sqlite_project_status_check CHECK (status IN ('DRAFT', 'ACTIVE', 'DECIDED', 'ARCHIVED'))
);
CREATE UNIQUE INDEX IF NOT EXISTS sicl_projects_projectId_unique ON sicl_projects (projectId);
CREATE INDEX IF NOT EXISTS sicl_projects_ownerId_idx ON sicl_projects (ownerId);

CREATE TABLE IF NOT EXISTS parametric_files (
  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  ownerId integer NOT NULL,
  projectId text NOT NULL,
  artifactId text NOT NULL,
  fileName text NOT NULL,
  format text NOT NULL,
  sizeBytes integer NOT NULL,
  checksum text NOT NULL,
  parsed integer NOT NULL DEFAULT 0,
  declaredDependencies text NOT NULL,
  capabilities text NOT NULL,
  hostRequired text,
  status text NOT NULL,
  storageKey text NOT NULL,
  storageUrl text NOT NULL,
  humanReviewRequired integer NOT NULL DEFAULT 1,
  uploadedAt integer NOT NULL,
  createdAt integer NOT NULL,
  updatedAt integer NOT NULL,
  CONSTRAINT sqlite_parametric_status_check CHECK (status IN ('INSPECTED', 'OPAQUE_HOST_REQUIRED', 'REJECTED', 'ARCHIVED'))
);
CREATE UNIQUE INDEX IF NOT EXISTS parametric_files_artifactId_unique ON parametric_files (artifactId);
CREATE INDEX IF NOT EXISTS parametric_files_owner_project_idx ON parametric_files (ownerId, projectId);
CREATE INDEX IF NOT EXISTS parametric_files_status_idx ON parametric_files (status);

CREATE TABLE IF NOT EXISTS arki_command_sessions (
  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  ownerId integer NOT NULL,
  projectId text NOT NULL,
  sessionId text NOT NULL,
  commandName text NOT NULL,
  parameters text NOT NULL,
  previewResult text NOT NULL,
  tutorialStep integer NOT NULL DEFAULT 0,
  exerciseScore integer,
  exerciseState text NOT NULL DEFAULT 'IN_PROGRESS',
  lastAction text NOT NULL DEFAULT 'AUTOSAVE',
  createdAt integer NOT NULL,
  updatedAt integer NOT NULL,
  CONSTRAINT sqlite_session_exercise_state_check CHECK (exerciseState IN ('IN_PROGRESS', 'PASSED', 'REVIEW_REQUIRED')),
  CONSTRAINT sqlite_session_last_action_check CHECK (lastAction IN ('AUTOSAVE', 'EXERCISE_SUBMIT', 'MANUAL_SAVE', 'COMMAND_CHANGE'))
);
CREATE UNIQUE INDEX IF NOT EXISTS arki_command_sessions_sessionId_unique ON arki_command_sessions (sessionId);
CREATE INDEX IF NOT EXISTS arki_command_sessions_owner_project_idx ON arki_command_sessions (ownerId, projectId);

CREATE TABLE IF NOT EXISTS federated_assistant_handoffs (
  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  handoffId text NOT NULL,
  ownerId integer NOT NULL,
  sourceProduct text NOT NULL,
  targetProduct text NOT NULL,
  sourceAssistantId text NOT NULL,
  targetAssistantId text,
  request text NOT NULL,
  status text NOT NULL DEFAULT 'CANDIDATE',
  sourceCommit text NOT NULL,
  evidenceJson text NOT NULL,
  traceJson text NOT NULL,
  reviewNote text,
  reviewerOpenId text,
  reviewedAt integer,
  createdAt integer NOT NULL,
  updatedAt integer NOT NULL,
  CONSTRAINT sqlite_handoff_status_check CHECK (status IN ('CANDIDATE', 'HUMAN_REVIEW', 'APPROVED', 'REJECTED', 'FROZEN'))
);
CREATE UNIQUE INDEX IF NOT EXISTS federated_assistant_handoffs_handoffId_unique ON federated_assistant_handoffs (handoffId);
CREATE INDEX IF NOT EXISTS federated_assistant_handoffs_owner_status_idx ON federated_assistant_handoffs (ownerId, status);
