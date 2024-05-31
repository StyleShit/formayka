import { createRef, useState, useSyncExternalStore } from 'react';
import createForm from '../core/create-form';
import type { FormOptions } from '../core/create-form';

export default function useForm<T extends Record<string, any> = never>(
	options: FormOptions<T>,
) {
	const [form] = useState(() => createForm(options));
	const formState = useSyncExternalStore(form.subscribe, form.getState);

	const textProps = (name: keyof T) => {
		const { onChange } = form.createListeners(name);

		return {
			name,
			ref: createRef<HTMLInputElement>(),
			onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
				onChange(event.target.value);
			},
		};
	};

	return {
		formState,
		textProps,
		submit: form.submit,
	};
}
