import type { Meta, StoryObj } from '@storybook/react';
import { ChatInput } from '../components/ChatInput';

const meta: Meta<typeof ChatInput> = { title: 'Components/ChatInput', component: ChatInput };
export default meta;
type Story = StoryObj<typeof ChatInput>;

export const Default: Story = { args: { onSend: () => {} } };
export const Disabled: Story = { args: { onSend: () => {}, disabled: true } };

