import React, { ReactElement } from 'react';
import Box from '@mui/material/Box';
import MuiTooltip from '@mui/material/Tooltip';

interface TooltipProps {
	title?: string | ReactElement | null;
	text?: string | ReactElement | null;
	placement?: string;
}

export const Tooltip = (props: TooltipProps) => {
	return props.text && props.title ? (
		<MuiTooltip
			arrow
			// placement={props.placement}
			title={<Box fontSize="14px" padding="6px">{props.title}</Box>}
		>
			<Box display="inline" fontSize="18px">{props.text}</Box>
		</MuiTooltip>
		) : (
			<Box display="inline" fontSize="18px">{props.text}</Box>
		)
};
