import * as React from 'react';
import { ComponentProps } from '@/app/lib/types';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface CircularProgressProps extends ComponentProps {
  isLoading: boolean;
}

export const ProgressContainer = ({ children, isLoading }: CircularProgressProps) => {
  return (
    <Box position="relative">
      <Box sx={{ filter: isLoading ? 'blur(1px)' : 'initial' }}>
        {children}
      </Box>
      {isLoading && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              zIndex: 999,
              bgcolor: (theme) => theme.palette.grey[700],
              opacity: 0.1,
              boxShadow: (theme) => `0px 0px 10px 10px ${theme.palette.grey[700]}`,
            }}
          />
          <CircularProgress
            size={50}
            color='primary'
            sx={{
              position: 'absolute',
              top: '40%',
              left: '45%',
              zIndex: 1000,
            }}
          />
        </>
      )}
    </Box>
  );
}
