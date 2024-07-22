'use client';
import React, { SyntheticEvent, useEffect, useMemo, useRef } from 'react';
import { useState, ChangeEvent } from 'react';
import {
	Button,
	TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { SnackBar } from '../SnackBar';
import { ComponentProps } from '@lib/types';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EditIcon from '@mui/icons-material/Edit';
import { PlaygroundItem } from '@/app/lib/types/playground';
import { useWords } from '@/app/lib/hooks/playground';
import { ProgressUiRequestBody } from '@/app/api/playground/progress/route';
import { Tooltip } from '../Tooltip';
import { EditWordModal } from '../Modals/EditWordModal';
import { capitalizeFirst } from '@/app/lib/tools/playground';

interface PlaygroundProps extends ComponentProps {
	items: PlaygroundItem[];
	langFrom: string;
	langTo: string;
}

export function Playground(props: PlaygroundProps) {
	const [value, setValue] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [showHelp, setShowHelp] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);

	const getMore = async (ignoreIds: number[]) => {
		const searchParams = new URLSearchParams({ ignoreIds: ignoreIds.toString() });
		const response = await fetch('/api/playground/progress?' + searchParams.toString(), {
			method: 'GET',
		});
		const responseBody = await response.json();

		return responseBody.data as PlaygroundItem[];
	}

	const {
		currentItem,
		getNewItem,
		checkItem,
		setAsAnswered,
		toggleAsFavorite,
		removeFromTodo,
	} = useWords(props.items, getMore);

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
	};

	const handleCheck = async (event: SyntheticEvent) => {
		event.preventDefault();

		if (value === '') {
			return;
		}

		const checkResult = checkItem(value);

		if (!checkResult) {
			return;
		}

		const { isCompletelyCorrect, isPartiallyCorrect } = checkResult;

		if (isCompletelyCorrect) {
			await handleSetAsAnswered();
			return;
		}

		if (isPartiallyCorrect) {
			onHelp();
			return;
		}

		setError('Wrong translation!');
	};

	const handleSetAsAnswered = async () => {
		onReset();
		setAsAnswered(currentItem.translationId);
		const requestBody: ProgressUiRequestBody = {
			translationId: currentItem.translationId,
			isAnswered: true,
			isFavorite: currentItem.isFavorite,
		}
		await fetch('/api/playground/progress', {
			method: 'POST',
			body: JSON.stringify(requestBody)
		});
	} 

	const handleToggleFavorite = async () => {
		toggleAsFavorite(currentItem.translationId, !currentItem.isFavorite);
		const requestBody: ProgressUiRequestBody = {
			translationId: currentItem.translationId,
			isFavorite: !currentItem.isFavorite,
			isAnswered: false,
		}
		const result = await fetch('/api/playgroung/progress', {
			method: 'PUT',
			body: JSON.stringify(requestBody)
		});
		if (!result.ok) {
			toggleAsFavorite(currentItem.translationId, currentItem.isFavorite);
		}
	}

	const onNext = () => {
		onReset();
		getNewItem();
	};

	const onReset = () => {
		setValue('');
		setError('');
		setShowHelp(false);
	};

	const onSuccess = () => {
		removeFromTodo(currentItem.translationId);
		onReset();
	}

	const onDelete = async () => {
		removeFromTodo(currentItem.translationId);
		onReset();
	}

	const onHelp = () => setShowHelp(true);

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			height="100%"
			mt="50px"
		>
			<Box display="flex" alignItems="center">
				<Tooltip
					placement="top"
					title={currentItem.exampleFrom}
					text={
						<Box component="h2" display="inline">{capitalizeFirst(currentItem.wordFrom)}</Box>
					}
				/>
				<IconButton size='small' onClick={handleToggleFavorite}>
					{currentItem.isFavorite ? <StarIcon color='primary'/> : <StarBorderIcon color='primary' />}
				</IconButton>
				<IconButton onClick={() => setOpen(true)} size='small'>
					<EditIcon color="primary"/>
				</IconButton>
				<EditWordModal
					onClose={() => setOpen(false)}
					isOpen={open}
					playgroundItem={currentItem}
					onSuccess={onSuccess}
					onDelete={onDelete}
				/>
			</Box>
			<Box
				component="form"
				display="flex"
				flexDirection="column"
				gap="10px"
				width="400px"
				mb="25px"
				mt='20px'
				onSubmit={handleCheck}
			>
				<TextField
					autoComplete="off"
					color="primary"
					fullWidth
					label="Type your answer"
					variant="outlined"
					helperText={error}
					autoFocus={true}
					onChange={onChange}
					value={value}
					error={Boolean(error)}
					disabled={showHelp}
				/>
				<Button
					variant="contained"
					fullWidth
					type="submit"
					disabled={showHelp}
				>
					Answer
				</Button>
				<Box
					display="flex"
					gap="10px"
				>
					<Button
						variant="outlined"
						fullWidth
						onClick={onHelp}
						disabled={showHelp}
					>
						Help
					</Button>
					<Button
						variant="outlined"
						fullWidth
						onClick={onNext}
					>
						{showHelp ? 'Next' : 'Skip'}
					</Button>
				</Box>
			</Box>

			{showHelp && (
				<Tooltip
					title={currentItem.exampleTo}
					text={currentItem.wordTo}
				/>
			)}
			<SnackBar />
		</Box>
	);
}
