# Tests — Serverless SaaS UI

Lightweight, dependency‑free examples for exercising the feature in isolation.

How to run examples
- Use `ts-node` or your editor’s TS runner, or paste into a sandbox to execute snippets.
- No network calls are made; all adapters are mocks.

Examples

## Auth adapter

```ts
import { authMock } from '../../features/serverless-saas-ui/src/lib/auth';

async function demo() {
  try {
    const session = await authMock.signup('alice@example.com', 'password123');
    console.log('Signed up:', session);
    const current = await authMock.getSession();
    console.log('Session:', current);
    await authMock.signin('alice@example.com', 'password123');
    const after = await authMock.getSession();
    console.log('After signin:', after);
    await authMock.signout();
  } catch (e) {
    console.error('Auth error', e);
  }
}

demo();
```

## Chat adapter

```ts
import { chatMock } from '../../features/serverless-saas-ui/src/lib/chat';
import type { ChatMessage } from '../../features/serverless-saas-ui/src/types';

async function demo() {
  const msgs: ChatMessage[] = [{ id: '1', role: 'user', content: 'I need auth and a dashboard', timestamp: new Date().toISOString() }];
  const reply = await chatMock.send(msgs);
  console.log('Suggestion:', reply);
}

demo();
```

## Telemetry

```ts
import { logEvent, logError } from '../../features/serverless-saas-ui/telemetry/logger';
import { incCounter, getCounter, observeLatencyMs, readHistogram } from '../../features/serverless-saas-ui/telemetry/metrics';

logEvent('sample_action', 'start');
incCounter('feature_events_total');
logError('sample_action', 'UNKNOWN');
observeLatencyMs(42);
console.log('events_total=', getCounter('feature_events_total'));
console.log('latency_histogram=', readHistogram());
```

Notes
- These are illustrative; adapt to your environment as needed.

