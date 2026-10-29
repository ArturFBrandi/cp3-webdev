-- Featured projects after curating the portfolio list (src/content/shared.ts, portfolioRepos).
-- ai-hardcore-engineer-v2 is the main focus; the order can still be changed in the dashboard.
delete from public.featured_projects;

insert into public.featured_projects (repo_name, position) values
  ('ai-hardcore-engineer-v2', 1),
  ('smartlar-manager', 2),
  ('aseprite-compiler', 3);
