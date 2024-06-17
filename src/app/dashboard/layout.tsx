import type { Metadata } from "next";
import { ComponentProps } from "../lib/types";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import { RestartButton } from "@components";


export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard page",
};

export default function DashboardLayout(props: ComponentProps) {
    return (
			<>
        <Box>
					<AppBar position="static">
						<Toolbar>
							<Box display="flex" justifyContent="flex-end" width="100%">
								<RestartButton />
							</Box>
						</Toolbar>
					</AppBar>
				</Box>
				{props.children}
			</>
    );
  }