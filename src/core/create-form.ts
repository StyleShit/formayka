type FieldsToValidators<T extends Record<string, any>> = {
	[K in keyof T]?: (value: string, formData: Partial<Omit<T, K>>) => T[K];
};

type FormState<T extends Record<string, any>> = {
	isValid: boolean;
	errors: Partial<Record<keyof T, string>>;
};

export type FormOptions<T extends Record<string, any>> = {
	validators: FieldsToValidators<T>;
	onSubmit: (args: { values: T }) => void;
};

export default function createForm<T extends Record<string, any> = never>({
	validators,
	onSubmit,
}: FormOptions<T>) {
	let state: FormState<T> = {
		isValid: true,
		errors: {},
	};

	const rawValues: Partial<Record<keyof T, string>> = {};
	const validatedValues: Partial<T> = {};

	const getState = () => {
		state.isValid = Object.keys(state.errors).length === 0;

		return state;
	};

	const setState = (setter: (state: FormState<T>) => FormState<T>) => {
		state = setter(state);

		notify();
	};

	const subscribers = new Set<() => void>();

	const subscribe = (subscriber: () => void) => {
		subscribers.add(subscriber);

		return () => {
			subscribers.delete(subscriber);
		};
	};

	const notify = () => {
		subscribers.forEach((subscriber) => {
			subscriber();
		});
	};

	const defaultValidator = (value: string) => value;

	const validate = (field: keyof T) => {
		const validator = validators[field] ?? defaultValidator;
		const value = rawValues[field] ?? '';

		let validated: unknown;

		try {
			validated = validator(value, validatedValues);

			if (field in getState().errors) {
				setState((prev) => {
					const errors = { ...prev.errors };

					// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
					delete errors[field];

					return {
						...prev,
						errors,
					};
				});
			}
		} catch (error: unknown) {
			let message: string;

			if (error instanceof Error) {
				message = error.message;
			} else if (typeof error === 'string') {
				message = error;
			} else {
				message = 'Field is invalid';
			}

			if (getState().errors[field] !== message) {
				setState((prev) => ({
					...prev,
					isValid: false,
					errors: {
						...prev.errors,
						[field]: message,
					},
				}));
			}
		}

		if (validated !== undefined) {
			validatedValues[field] = validated as T[keyof T];
		}
	};

	const createListeners = (field: keyof T) => {
		return {
			onChange: (value: unknown) => {
				rawValues[field] = value as T[keyof T];

				validate(field);
			},
		};
	};

	const submit = () => {
		Object.keys(validators).forEach((field) => {
			validate(field);
		});

		if (!getState().isValid) {
			return;
		}

		onSubmit({ values: validatedValues as T });
	};

	return {
		getState,
		subscribe,
		createListeners,
		submit,
	};
}
