type Watcher<T extends Record<string, any>> = (field: keyof T) => void;

export function createFieldWatchers<T extends Record<string, any> = never>() {
	const watchers = new Map<keyof T, Set<Watcher<T>>>();

	const watch = (field: keyof T, watcher: Watcher<T>) => {
		if (!watchers.has(field)) {
			watchers.set(field, new Set());
		}

		watchers.get(field)?.add(watcher);

		return () => {
			watchers.get(field)?.delete(watcher);
		};
	};

	const notify = (field: keyof T) => {
		watchers.get(field)?.forEach((watcher) => {
			watcher(field);
		});
	};

	return {
		watch,
		notify,
	};
}
