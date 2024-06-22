import { form } from './form';
import { useForm } from '../src/react';

export const Submit = () => {
	const { formState } = useForm(form);

	return (
		<button type="submit" disabled={!formState.isValid}>
			Submit
		</button>
	);
};
