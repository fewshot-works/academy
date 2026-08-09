CREATE TABLE IF NOT EXISTS feedback_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  background TEXT NOT NULL,
  region TEXT,
  sections TEXT NOT NULL,
  helpful INTEGER NOT NULL,
  recommend TEXT NOT NULL,
  what_could_be_better TEXT,
  other_topics TEXT,
  created_at TEXT NOT NULL
);
