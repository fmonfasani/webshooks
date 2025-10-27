import type { Meta, StoryObj } from '@storybook/react';
import { AuthForm } from '../components/AuthForm';

const meta: Meta<typeof AuthForm> = { title: 'Components/AuthForm', component: AuthForm };
export default meta;
type Story = StoryObj<typeof AuthForm>;

export const SignIn: Story = { args: { mode: 'signin', loading: false, onSubmit: async () => {} } };
export const SignUp: Story = { args: { mode: 'signup', loading: false, onSubmit: async () => {} } };
export const Loading: Story = { args: { mode: 'signin', loading: true, onSubmit: async () => {} } };

