import { useForm } from '../src/react';
import { form } from './form';
import { Submit } from './submit';

function App() {
	const { textProps, checkboxProps, formState, submit } = useForm(form);

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
			<Submit />
		</form>
	);
}

export default App;
