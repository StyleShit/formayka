export function createFormDependencies<T extends Record<string, any>>() {
	const dependencies = new Map<keyof T, Set<keyof T>>();

	const proxify = (field: keyof T, values: Partial<T>) => {
		return new Proxy(values, {
			get(target, key: string) {
				if (!dependencies.has(key)) {
					dependencies.set(key, new Set());
				}

				dependencies.get(key)?.add(field);

				return Reflect.get(target, key) as never;
			},
		});
	};

	const get = (field: keyof T) => {
		return dependencies.get(field) ?? new Set();
	};

	return {
		proxify,
		get,
	};
}
