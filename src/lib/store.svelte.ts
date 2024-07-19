import type { Category } from '@prisma/client';

type Item = {
	id: string;
	title: string;
};

function createNewNoteInitialCategoryStore() {
	let id = $state<Category | undefined>();

	return {
		get category() {
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

function createNewQuizInitialItemsStore() {
	let notes = $state<Item[] | undefined>();

	return {
		get notes() {
			return notes;
		},
		addItem(val: Item) {
			notes = notes ? [...notes, val] : [val];
		},
		reset() {
			notes = undefined;
		},
		removeItem(id: string) {
			notes = notes?.filter((item) => item.id !== id);
		}
	};
}

function createNewFlashcardInitialItemsStore() {
	let notes = $state<Item[] | undefined>();

	return {
		get notes() {
			return notes;
		},
		addItem(val: Item) {
			notes = notes ? [...notes, val] : [val];
		},
		reset() {
			notes = undefined;
		},
		removeItem(id: string) {
			notes = notes?.filter((item) => item.id !== id);
		}
	};
}

function createXPStore() {
	let xp = $state<number | undefined>();

	return {
		get xp() {
			return xp;
		},
		setInitial(val: number) {
			xp = val;
		},
		addXP(val: number) {
			xp = xp ? xp + val : val;
		}
	};
}

const newNoteInitialCategoryStore = createNewNoteInitialCategoryStore();

const newQuizInitialStore = createNewQuizInitialItemsStore();
const newFlashcardInitialStore = createNewFlashcardInitialItemsStore();
const xpStore = createXPStore();

export { newNoteInitialCategoryStore, newQuizInitialStore, newFlashcardInitialStore, xpStore };
