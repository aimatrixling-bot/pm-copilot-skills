# Tool Policy

## Allowed By Default

- read files;
- inspect git status and diffs;
- create draft artifacts;
- run local validation commands;
- generate task packets and plans.

## Cautious

- modify existing code;
- install dependencies;
- change config;
- run long or external commands.

## Requires Human Approval

- delete files or data;
- commit or push;
- deploy;
- send messages or emails;
- modify production data;
- change permissions;
- call external write APIs.
