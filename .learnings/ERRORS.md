# Errors

## [ERR-20260422-001] git_commit_shell_quoting

**Logged**: 2026-04-22T19:04:00+08:00
**Priority**: medium
**Status**: noted
**Area**: docs

### Summary
Shell interpreted backticks inside a `git commit -m` command, causing spurious `command not found` output.

### Error
```text
zsh:1: command not found: changdaye-blog-worker
zsh:1: command not found: changdaye.github.io
```

### Context
- Command attempted: `git commit -m "... `changdaye-blog-worker` ... `changdaye.github.io` ..."`
- Environment: zsh shell in local repo
- The commit still succeeded, but the shell expanded backticks before invoking git.

### Suggested Fix
Avoid raw backticks inside shell-quoted commit messages; use plain quotes, single quotes, or a heredoc/commit template.

### Metadata
- Reproducible: yes
- Related Files: .learnings/ERRORS.md

---
