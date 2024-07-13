import { translations } from "@prisma/client";
import { useEffect, useState, useMemo } from "react";
import { PlaygroundItem } from "../types/playground";

export const useWords = (items: PlaygroundItem[], langFrom: string, langTo: string) => {

	const [todo, setTodo] = useState(items);
	const { currentIndex, updateIndex } = useUpdateIndex();

	const updateItem = () => updateIndex(todo.length);

	useEffect(() => {
		if (todo.length === items.length) {
			return;
		}

		setTodo((todo) => ([
			...todo,
			...items,
		]))
	}, [items]);

	const checkItem = (value: string) => {
		const correctWord = todo[currentIndex].linkedWords.find((word) => word.lang === langTo);

		if (!correctWord) {
			return {
				isCorrectAnswer: false,
				isPartiallyCorrect: false,
				isSynonym: false,
			}
		}

		setTodo((todo) => todo.filter((word) => word.name !== value));
		const isCompletelyCorrect = value === correctWord.name;
		const isPartiallyCorrect = correctWord.name.includes(value);

		return {
			isCorrectAnswer: isCompletelyCorrect,
			isPartiallyCorrect: !isCompletelyCorrect && isPartiallyCorrect,
			// isSynonym: currentWord.linkedWords.some((word) => word.name === value),
		};
	};

	return { currentItem: todo[currentIndex], updateItem, checkItem };
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