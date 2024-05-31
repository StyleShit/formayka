type FormState<T extends Record<string, any>> = {
	isValid: boolean;
	errors: Partial<Record<keyof T, string>>;
};

export function createFormState<T extends Record<string, any>>() {
	let state: FormState<T> = {
		isValid: true,
		errors: {},
	};

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

	const setError = (field: keyof T, message: string) => {
		if (getState().errors[field] === message) {
			return;
		}

		setState((prev) => ({
			...prev,
			isValid: false,
			errors: {
				...prev.errors,
				[field]: message,
			},
		}));
	};

	const removeError = (field: keyof T) => {
		if (!(field in getState().errors)) {
			return;
		}

		setState((prev) => {
			const errors = { ...prev.errors };

			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete errors[field];

			return {
				...prev,
				errors,
			};
		});
	};

	return {
		get: getState,
		subscribe,
		setError,
		removeError,
	};
}
