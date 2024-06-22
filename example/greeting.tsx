import { useWatch } from '../src/react';
import { form } from './form';

export const Greeting = () => {
	const name = useWatch(form, 'name') || 'Guest';

	return <p>Hello {name}</p>;
};
