import type { Meta, StoryObj } from '@storybook/react';
import { MessageBubble } from '../components/MessageBubble';

const meta: Meta<typeof MessageBubble> = { title: 'Components/MessageBubble', component: MessageBubble };
export default meta;
type Story = StoryObj<typeof MessageBubble>;

export const User: Story = { args: { role: 'user', content: 'Hello', timestamp: new Date().toISOString() } };
export const System: Story = { args: { role: 'system', content: 'Hi!', timestamp: new Date().toISOString() } };

