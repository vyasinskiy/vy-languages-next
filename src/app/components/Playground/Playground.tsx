'use client';
import React, { SyntheticEvent, useEffect, useMemo, useRef } from 'react';
import { useState, ChangeEvent } from 'react';
import {
	Button,
	Divider,
	List,
	ListItem,
	TextField,
	Tooltip,
} from '@mui/material';
import Box from '@mui/material/Box';

// import { useWord } from '../../hooks/useWord';

//import { ReactComponent as FavoriteIcon } from '../../assets/icons/favorite.svg';
import { SnackBar } from '../SnackBar';
// import { AdvancedGame } from '../AdvancedGame';
import { ComponentProps } from '@lib/types';
import { UpdateWordRequestBody } from '@/app/api/playground/route';
import { PlaygroundItem } from '@/app/lib/types/playground';
import { useWords } from '@/app/lib/hooks/playground';

interface PlaygroundProps extends ComponentProps {
	items: PlaygroundItem[];
	langFrom: string;
	langTo: string;
}

export function Playground(props: PlaygroundProps) {
	// const [translations, setTranslations] = useState(props.translations ?? []);
	// const dispatch = useAppDispatch();

	// const mode = useSelector((state: RootState) => state.mode);

	const [value, setValue] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [showHelp, setShowHelp] = useState<boolean>(false);
	// const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
	const [synonymsSelected, setSynonymsSelected] = useState<string[]>([]);

	const { currentItem, updateItem, checkItem } = useWords(props.items, props.langFrom, props.langTo);

	const advancedInputRef = useRef<HTMLInputElement>();

	// useEffect(() => {
	// 	if (advancedInputRef.current) {
	// 		advancedInputRef.current.focus();
	// 	}
	// }, [showAdvanced]);

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
	};

	const handleCheck = (event: SyntheticEvent) => {
		event.preventDefault();

		if (value === '') {
			return;
		}

		const checkResult = checkItem(value);

		if (!checkResult) {
			return;
		}

		const { isCorrectAnswer, isPartiallyCorrect, isSynonym } = checkResult;

		if (isCorrectAnswer) {
			onReset();
			const requestBody: UpdateWordRequestBody = {
				translationName: value,
				isAnswered: true,
				isFavorite: false,
			}
			fetch('/api/playground', {
				method: 'PUT',
				body: JSON.stringify(requestBody)
			})
			return;
		}

		if (isPartiallyCorrect) {
			onHelp();
			return;
		}

		if (isSynonym) {
			setValue('');
			setError('Synonym! Try another one!');

			const isSynonymAlreadySelected = synonymsSelected.includes(value);

			if (isSynonymAlreadySelected) {
				return;
			}

			setSynonymsSelected((synonyms) => [...synonyms, value]);
			// dispatch(setAsSucceed({ rusKey, engKey: value }));

			return;
		}

		setError('Wrong translation!');
	};

	const handleAddToFavorite = () => {
		// dispatch(setAsFavorite({ rusKey, engKey }));
	}

	const onNext = () => {
		onReset();
		updateItem();
	};

	const onReset = () => {
		setValue('');
		setError('');
		// setSynonymsSelected([]);
		// setShowAdvanced(false);
		setShowHelp(false);
	};

	const onHelp = () => setShowHelp(true);

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			height="100%"
			mt="50px"
		>
			<h1>
				<Tooltip
					placement="top"
					title={<span>{currentItem.exampleFrom}</span>}
				>
					<span>
						{currentItem.wordFrom}
					</span>
				</Tooltip>
				{/* <FavoriteIcon
					className={cn(styles.favoriteIcon, {
						[styles.active]: isFavorite,
					})}
					onClick={handleAddToFavorite}
				/> */}
			</h1>

			<Box
				component="form"
				display="flex"
				flexDirection="column"
				gap="10px"
				width="400px"
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
					disabled={showHelp
						// || showAdvanced
					}
				/>
				<Button
					variant="contained"
					fullWidth
					type="submit"
					disabled={showHelp
						// || showAdvanced
					}
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
						disabled={showHelp
							// || showAdvanced
						}
					>
						Help
					</Button>
					<Button
						variant="outlined"
						fullWidth
						onClick={onNext}
						// disabled={isLast
						// 	//  || showAdvanced
						// }
					>
						{showHelp ? 'Next' : 'Skip'}
					</Button>
				</Box>
			</Box>

			{/* {synonymsSelected.length > 0 && (
				<List>
					{synonymsSelected.map((synonym) => (
						<React.Fragment key={synonym}>
							<ListItem>{synonym}</ListItem>
							<Divider />
						</React.Fragment>
					))}
				</List>
			)} */}

			{showHelp && (
				<Tooltip
					title={<span>{currentItem.exampleTo}</span>}
				>
					<Box mt="10px">{currentItem.wordTo}</Box>
				</Tooltip>
			)}

			{/* {mode === GameMode.Advanced && showAdvanced && (
				<AdvancedGame
					inputRef={advancedInputRef}
					rusContext={rusContext}
					engContext={engContext}
					onCheck={handleCheck}
				/>
			)} */}
			<SnackBar />
		</Box>
	);
}
