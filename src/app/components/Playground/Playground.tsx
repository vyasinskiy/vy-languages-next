'use client';
import React, { SyntheticEvent, useEffect, useRef } from 'react';
import { useState, ChangeEvent } from 'react';
import {
	Button,
	Divider,
	List,
	ListItem,
	TextField,
	Tooltip,
} from '@mui/material';
import { clsx } from 'clsx';
import Box from '@mui/material/Box';
// import cn from 'classnames';

// import { useWord } from '../../hooks/useWord';

//import { ReactComponent as FavoriteIcon } from '../../assets/icons/favorite.svg';
// import styles from './Playground.module.scss';
import { SnackBar } from '../SnackBar';
import { AdvancedGame } from '../AdvancedGame';
import { GameMode } from '@lib/types';

export function Playground() {
	// const dispatch = useAppDispatch();

	// const mode = useSelector((state: RootState) => state.mode);

	const [value, setValue] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [showHelp, setShowHelp] = useState<boolean>(false);
	const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
	const [synonymsSelected, setSynonymsSelected] = useState<string[]>([]);

	// const { currentWord, updateWord, checkWord } = useWord();

	// const { engKey, rusKey, engContext, rusContext, isFavorite, isLast } =
	// 	currentWord;
	const engKey = '', rusKey = '', engContext = '', rusContext = '', isFavorite = true, isLast = true;

	const advancedInputRef = useRef<HTMLInputElement>();

	useEffect(() => {
		if (advancedInputRef.current) {
			advancedInputRef.current.focus();
		}
	}, [showAdvanced]);

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
	};

	const handleCheck = (event: SyntheticEvent) => {
		event.preventDefault();

		if (value === '') {
			return;
		}

		// const checkResult = checkWord(value);
		const checkResult = '';

		if (!checkResult) {
			return;
		}

		const { isCorrectAnswer, isPartiallyCorrect, isSynonym } = checkResult;

		if (isCorrectAnswer) {
			setError('');

			// if (mode === GameMode.Advanced && !showAdvanced) {
			// 	setShowAdvanced(true);
			// 	return;
			// }

			onReset();
			// dispatch(setAsSucceed({ rusKey, engKey: value }));
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
		// onReset();
		// updateWord();
	};

	const onReset = () => {
		// setValue('');
		// setError('');
		// setSynonymsSelected([]);
		// setShowAdvanced(false);
		// setShowHelp(false);
	};

	const onHelp = () => setShowHelp(true);

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			height="100%"
			mt="50px"
			// className={styles.wrapper}
		>
			<h1
				// className={styles.title}
			>
				<Tooltip
					placement="top"
					// className={styles.tooltip}
					title={
						<span
							// className={styles.exampleText}
						>{rusContext}</span>
					}
				>
					<span>
						Test{/* {rusKey[0].toUpperCase() + rusKey.slice(1)} */}
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
				// className={styles.form}
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
					// className={styles.verticalOffset}
					onChange={onChange}
					value={value}
					error={Boolean(error)}
					disabled={showHelp || showAdvanced}
				/>
				<Button
					// className={styles.verticalOffset}
					variant="contained"
					fullWidth
					type="submit"
					disabled={showHelp || showAdvanced}
				>
					Answer
				</Button>
				<Box
					display="flex"
					gap="10px"
					// className={styles.helpButtons}
				>
					<Button
						variant="outlined"
						fullWidth
						onClick={onHelp}
						disabled={showHelp || showAdvanced}
					>
						Help
					</Button>
					<Button
						variant="outlined"
						fullWidth
						onClick={onNext}
						disabled={isLast || showAdvanced}
					>
						{showHelp ? 'Next' : 'Skip'}
					</Button>
				</Box>
			</Box>

			{synonymsSelected.length > 0 && (
				<List
					// className={clsx(styles.synonyms, styles.verticalOffset)}
				>
					{synonymsSelected.map((synonym) => (
						<React.Fragment key={synonym}>
							<ListItem>{synonym}</ListItem>
							<Divider />
						</React.Fragment>
					))}
				</List>
			)}

			{showHelp && (
				<Tooltip
					// className={styles.tooltip}
					title={
						<span
							// className={styles.exampleText}
						>{engContext}</span>
					}
				>
					<span
						// className={styles.help}
					>{engKey}</span>
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
