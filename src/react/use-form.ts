import { createRef, useSyncExternalStore } from 'react';
import type { Form, FormOptions } from '../core/create-form';

export type { FormOptions };

export function useForm<T extends Record<string, any> = never>(form: Form<T>) {
	const formState = useSyncExternalStore(form.subscribe, form.getState);

	const textProps = (
		name: FilterFields<T, string>,
	): Partial<React.JSX.IntrinsicElements['input']> => {
		const { onClick, onFocus, onChange } = form.createListeners(name);

		return {
			name,
			ref: createRef(),
			defaultValue: form.getRawValue(name) as string,
			onClick,
			onFocus,
			onChange: (event) => {
				onChange(event.target.value);
			},
		};
	};

	const checkboxProps = (
		name: FilterFields<T, boolean>,
	): Partial<React.JSX.IntrinsicElements['input']> => {
		const { onClick, onFocus, onChange } = form.createListeners(name);

		return {
			name,
			ref: createRef(),
			defaultChecked: form.getRawValue(name) as boolean,
			onClick,
			onFocus,
			onChange: (event) => {
				onChange(event.target.checked);
			},
		};
	};

	return {
		formState,
		textProps,
		checkboxProps,
		submit: form.submit,
	};
}

// Get only the keys of T that are of type U.
type FilterFields<T extends Record<string, any>, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T] &
	string;
