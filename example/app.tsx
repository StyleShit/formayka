import { useForm } from '../src/react';

function App() {
	const { textProps, checkboxProps, formState, submit } = useForm<{
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
					throw new Error(
						'Email must include . if keepSignedIn is true',
					);
				}

				return value;
			},

			password: (value) => {
				if (typeof value !== 'string') {
					throw new Error('Password must be a string');
				}

				if (value.length < 8) {
					throw new Error(
						'Password must be at least 8 characters long',
					);
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
					throw new Error(
						'Password must not be the same length as name',
					);
				}

				return value;
			},
		},
		onSubmit: ({ values }) => {
			console.log('Submit', values);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();

				submit();
			}}
		>
			Touched: {Object.keys(formState.touched).join(', ') || 'none'}
			<br />
			Dirty: {Object.keys(formState.dirty).join(', ') || 'none'}
			<br />
			<br />
			<input type="text" placeholder="Name" {...textProps('name')} />
			{formState.errors.name && <>{formState.errors.name}</>}
			<br />
			<br />
			<input type="email" placeholder="Email" {...textProps('email')} />
			{formState.errors.email && <>{formState.errors.email}</>}
			<br />
			<br />
			<input
				type="password"
				placeholder="Password"
				{...textProps('password')}
			/>
			{formState.errors.password && <>{formState.errors.password}</>}
			<br />
			<br />
			<input
				type="password"
				placeholder="Confirm Password"
				{...textProps('passwordConfirm')}
			/>
			{formState.errors.passwordConfirm && (
				<>{formState.errors.passwordConfirm}</>
			)}
			<br />
			<input
				type="checkbox"
				{...checkboxProps('keepSignedIn')}
				id="keepSignedIn"
			/>
			<label htmlFor="keepSignedIn">Keep me signed in</label>
			<br />
			<br />
			<button type="submit" disabled={!formState.isValid}>
				Submit
			</button>
		</form>
	);
}

export default App;
