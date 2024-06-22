import { createFormDependencies } from './create-form-dependencies';
import { createFormState } from './create-form-state';
import { createFieldWatchers } from './create-field-watchers';

type FieldValue = string | boolean;

type FieldsToValidators<T extends Record<string, any>> = {
	[K in keyof T]?: (value: FieldValue, formData: Partial<Omit<T, K>>) => T[K];
};

export type FormOptions<T extends Record<string, any>> = {
	defaultValues?: Partial<T>;
	validators?: FieldsToValidators<T>;
	onSubmit?: (args: { values: T }) => void;
};

export type Form<T extends Record<string, any>> = ReturnType<
	typeof createForm<T>
>;

export function createForm<T extends Record<string, any> = never>({
	defaultValues = {},
	validators = {},
	onSubmit,
}: FormOptions<T>) {
	const formState = createFormState<T>();
	const dependencies = createFormDependencies<T>();
	const watchers = createFieldWatchers<T>();

	const rawValues: Partial<Record<keyof T, FieldValue>> = defaultValues;
	const validatedValues: Partial<T> = {};

	const defaultValidator = (value: FieldValue) => value;

	const getRawValue = (field: keyof T) => rawValues[field] ?? '';

	const validate = (
		field: keyof T,
		options: { withDeps: boolean } = { withDeps: true },
	) => {
		const validator = validators[field] ?? defaultValidator;
		const value = rawValues[field];

		let validated: unknown;

		try {
			const proxifiedValues = dependencies.proxify(field, {
				...rawValues,
				...validatedValues,
			});

			validated = validator(value as FieldValue, proxifiedValues);

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

		if (options.withDeps) {
			dependencies.get(field).forEach((dependentField) => {
				validate(dependentField);
			});
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
				formState.setDirty(field);

				rawValues[field] = value as T[keyof T];

				validate(field);

				watchers.notify(field);
			},
		};
	};

	const submit = () => {
		Object.keys(validators).forEach((field) => {
			validate(field, {
				withDeps: false,
			});
		});

		if (!formState.get().isValid) {
			return;
		}

		onSubmit?.({ values: validatedValues as T });
	};

	return {
		getState: formState.get,
		subscribe: formState.subscribe,
		watch: watchers.watch,
		getRawValue,
		createListeners,
		submit,
	};
}
