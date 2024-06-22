import { useCallback, useSyncExternalStore } from 'react';
import type { Form } from '../core';

export function useWatch<
	T extends Record<string, any> = never,
	K extends keyof T = never,
>(form: Form<T>, field: K): T[K] {
	// Keep a stable reference to the subscribe function to avoid unnecessary re-subscribing.
	const subscribe = useCallback(
		(onChange: () => void) => form.watch(field, onChange),
		[form, field],
	);

	const getSnapshot = () => form.getRawValue(field) as never;

	return useSyncExternalStore(subscribe, getSnapshot);
}
