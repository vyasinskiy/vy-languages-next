'use client';

import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { ComponentProps } from '@lib/types';
import { useRef, useState } from 'react';


export const RestartButton = (props: ComponentProps) => {
    const anchorEl = useRef<HTMLButtonElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const id = 'restart-button';
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsOpen(true);
    };
	return (
        <>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-describedby={id}
                onClick={handleClick}
                ref={anchorEl}
            >
                <RestartAltIcon />
            </IconButton>
            <Popover
                id={id}
                open={isOpen}
                anchorEl={anchorEl.current}
                onClose={() => setIsOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                    <Box p="10px" display="flex" flexDirection="column" alignItems="center">
                        <Box>
                            Are you sure?<br />
                            This will clear your progress.
                        </Box>
                        <Box display="flex" gap="10px" mt="10px">
                            <Button variant="outlined">Yes</Button>
                            <Button variant="outlined">No</Button>
                        </Box>
                    </Box>
            </Popover>
        </>
	)
}