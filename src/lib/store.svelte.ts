import type { Category } from '@prisma/client';

function createNewNoteInitialCategoryStore() {
	let id = $state<Category | undefined>();

	return {
		get category(): Category | undefined {
			return id;
		},
		update(val: Category) {
			id = val;
		},
		reset() {
			id = undefined;
		}
	};
}

const newNoteInitialCategoryStore = createNewNoteInitialCategoryStore();

export { newNoteInitialCategoryStore };
