import type { Meta, StoryObj } from '@storybook/react';
import { ChatPanel } from '../components/ChatPanel';

const meta: Meta<typeof ChatPanel> = { title: 'Components/ChatPanel', component: ChatPanel };
export default meta;
type Story = StoryObj<typeof ChatPanel>;

export const Empty: Story = { args: { messages: [], state: 'empty' } };
export const Loading: Story = { args: { messages: [], state: 'loading' } };
export const Populated: Story = {
  args: {
    state: 'success',
    messages: [
      { id: '1', role: 'user', content: 'Hi', timestamp: new Date().toISOString() },
      { id: '2', role: 'system', content: 'Hello!', timestamp: new Date().toISOString() },
    ],
  },
};

