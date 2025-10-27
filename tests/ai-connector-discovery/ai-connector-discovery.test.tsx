/*
  Test stubs for AI Connector Discovery.
  These are skipped by default to avoid introducing dependencies.
  Enable by installing Jest/Vitest + React Testing Library and removing `.skip`.

  Suggested dev deps (Jest):
  - jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom jsdom typescript
*/

/* @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AIConnectorDiscovery } from '../../features/ai-connector-discovery/ui/AIConnectorDiscovery';

describe('AIConnectorDiscovery (smoke)', () => {
  it.skip('renders loading state', () => {
    render(<AIConnectorDiscovery isLoading items={[]} />);
    // Expect skeleton rows or a polite status region
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it.skip('renders empty state', () => {
    render(<AIConnectorDiscovery items={[]} isLoading={false} />);
    expect(screen.getByText(/No connectors/)).toBeInTheDocument();
  });

  it.skip('renders error state', () => {
    render(<AIConnectorDiscovery error={{ code: 'ADAPTER_ERROR', message: 'Failed' }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('ADAPTER_ERROR');
  });

  it.skip('renders items', () => {
    render(
      <AIConnectorDiscovery
        items={[
          { id: 'slack', name: 'Slack', status: 'requires_auth' },
          { id: 'github', name: 'GitHub', status: 'available' },
        ]}
      />
    );
    expect(screen.getByText('Slack')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getAllByText(/Select/).length).toBeGreaterThan(0);
  });
});

