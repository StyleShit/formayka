import { createFormState } from './create-form-state';

type FieldsToValidators<T extends Record<string, any>> = {
	[K in keyof T]?: (value: string, formData: Partial<Omit<T, K>>) => T[K];
};

export type FormOptions<T extends Record<string, any>> = {
	validators: FieldsToValidators<T>;
	onSubmit: (args: { values: T }) => void;
};

export default function createForm<T extends Record<string, any> = never>({
	validators,
	onSubmit,
}: FormOptions<T>) {
	const formState = createFormState<T>();

	const rawValues: Partial<Record<keyof T, string>> = {};
	const validatedValues: Partial<T> = {};

	const defaultValidator = (value: string) => value;

	const validate = (field: keyof T) => {
		const validator = validators[field] ?? defaultValidator;
		const value = rawValues[field] ?? '';

		let validated: unknown;

		try {
			validated = validator(value, validatedValues);

			formState.removeError(field);
		} catch (error: unknown) {
			let message: string;

			if (error instanceof Error) {
				message = error.message;
			} else if (typeof error === 'string') {
				message = error;
			} else {
				message = 'Field is invalid';
			}

			formState.setError(field, message);
		}

		if (validated !== undefined) {
			validatedValues[field] = validated as T[keyof T];
		}
	};

	const createListeners = (field: keyof T) => {
		return {
			onClick: () => {
				formState.setTouched(field);
			},

			onFocus: () => {
				formState.setTouched(field);
			},

			onChange: (value: unknown) => {
				formState.setTouched(field);

				rawValues[field] = value as T[keyof T];

				validate(field);
			},
		};
	};

	const submit = () => {
		Object.keys(validators).forEach((field) => {
			validate(field);
		});

		if (!formState.get().isValid) {
			return;
		}

		onSubmit({ values: validatedValues as T });
	};

	return {
		getState: formState.get,
		subscribe: formState.subscribe,
		createListeners,
		submit,
	};
}
