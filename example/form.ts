import { createForm } from '../src/core';

export const form = createForm<{
	name: string;
	email: string;
	password: string;
	passwordConfirm: string;
	keepSignedIn: boolean;
}>({
	defaultValues: {
		name: 'John Doe',
	},
	validators: {
		name: (value) => {
			if (typeof value !== 'string') {
				throw new Error('Name must be a string');
			}

			if (value.length < 3) {
				throw new Error('Name must be at least 3 characters long');
			}

			return value;
		},

		email: (value, values) => {
			if (typeof value !== 'string') {
				throw new Error('Email must be a string');
			}

			if (!value.includes('@')) {
				throw new Error('Email must include @');
			}

			if (values.keepSignedIn === true && !value.includes('.')) {
				throw new Error('Email must include . if keepSignedIn is true');
			}

			return value;
		},

		password: (value) => {
			if (typeof value !== 'string') {
				throw new Error('Password must be a string');
			}

			if (value.length < 8) {
				throw new Error('Password must be at least 8 characters long');
			}

			return value;
		},

		passwordConfirm: (value, formData) => {
			if (typeof value !== 'string') {
				throw new Error('Password must be a string');
			}

			if (value !== formData.password) {
				throw new Error('Passwords do not match');
			}

			if (value.length === formData.name?.length) {
				throw new Error('Password must not be the same length as name');
			}

			return value;
		},
	},
	onSubmit: ({ values }) => {
		// eslint-disable-next-line no-console
		console.log('Submit', values);
	},
});
