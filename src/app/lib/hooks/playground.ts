import { useEffect, useState } from "react";
import { PlaygroundItem } from "../types/playground";

export const useWords = (items: PlaygroundItem[], getMore: (ignoreIds: number[]) => Promise<PlaygroundItem[]>) => {

	const [todo, setTodo] = useState(items);
	const { currentIndex, updateIndex } = useUpdateIndex();
	const currentItem = todo[currentIndex];
	const getNewItem = () => updateIndex(todo.length);

	useEffect(() => {
		if (todo.length > 5) {
			return;
		}

		const getMoreItems = async () => {
			const newItems = await getMore(todo.map(t => t.translationId));
			if (!newItems.length) return;
			setTodo((todo) => ([...todo,...newItems]))
		}

		getMoreItems();
	}, [todo, getMore]);

	const checkItem = (value: string) => {
		const isCompletelyCorrect = value === currentItem.wordTo;
		const isPartiallyCorrect = currentItem.wordTo.includes(value) && !isCompletelyCorrect;

		return { isPartiallyCorrect, isCompletelyCorrect };
	};

	const setAsAnswered = (translationId: number) => {
		setTodo((todo) => todo.filter((item) => item.translationId !== translationId));
		updateIndex(todo.length - 1);
	};

	const toggleAsFavorite = (translationId: number, isFavorite: boolean) => {
		setTodo((todo) => todo.map((item) => {
			if (item.translationId === translationId) {
				return {
					...item,
					isFavorite,
				}
			}

			return item;
		}));
	};

	const removeFromTodo = (translationId: number) => {
		const filtredTodo = todo.filter((item) => item.translationId !== translationId);
		setTodo(filtredTodo);
		updateIndex(filtredTodo.length - 1);
	}

	return { currentItem, getNewItem, checkItem, setAsAnswered, toggleAsFavorite, removeFromTodo };
}

function useUpdateIndex() {
	const [currentIndex, setCurrentIndex] = useState<number>(1);

	const updateIndex = (arrayLength: number) => {
		const maxIndex = arrayLength - 1;
		let newIndex = getRandomInt(maxIndex, currentIndex);

		while (!isAcceptedIndex(currentIndex, newIndex, maxIndex)) {
			newIndex = getRandomInt(maxIndex, currentIndex);
		}

		setCurrentIndex(newIndex);
	};

	return { currentIndex, updateIndex };
}

function getRandom(): number {
	return +(Math.random() * 10).toFixed(0);
}

function isAcceptedIndex(
	currentIndex: number,
	newIndex: number,
	maxIndex: number
) {
	const acceptedAsSecondToLast = newIndex === 1 && maxIndex === 1;
	const acceptedAsLastWord = currentIndex === 1 && newIndex === 0 && maxIndex === 0;
	// we must avoid index === 0 to proceed with rerender after index update
	// as at the end of the game index may be changed from 0 => 0 withour rerender
	const acceptedAsNotZero =
		newIndex !== 0 && !acceptedAsLastWord && !acceptedAsSecondToLast;

	return acceptedAsLastWord || acceptedAsSecondToLast || acceptedAsNotZero;
}

const MAX_CONSTRAINT_INT = 30;

function isAcceptableInteger(
	checkInt: number,
	maxInt: number,
	excludeInt?: number
) {
	return Boolean(
		checkInt !== excludeInt &&
			checkInt <= maxInt &&
			checkInt < MAX_CONSTRAINT_INT
	);
}

function getRandomInt(maxInt: number, excludeInt?: number) {
	if (maxInt === 0) {
		return 0;
	}

	let randomIndex = getRandom() * getRandom();

	while (!isAcceptableInteger(randomIndex, maxInt, excludeInt)) {
		randomIndex = getRandom() * getRandom();
	}

	return randomIndex;
}