import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContentText from '@mui/material/DialogContentText';
import { ComponentProps } from '@/app/lib/types';

export interface BaseModalProps extends ComponentProps {
    isOpen: boolean;
    isLoading?: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    formId: string;
    additionalButtons: React.JSX.Element;
}

export const BaseModal = ({ isOpen, isLoading, onClose, title, subtitle, formId, children, additionalButtons }: BaseModalProps) => {

  return (
    <Dialog
        onClose={onClose}
        open={isOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {title}
        </DialogTitle>
        <IconButton
          disabled={isLoading}
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
            {subtitle && (
              <DialogContentText>
                  {subtitle}
              </DialogContentText>
            )}
            {children}
        </DialogContent>
        <DialogActions>
          {additionalButtons}
          <Button disabled={isLoading} onClick={onClose}>Cancel</Button>
          <Button disabled={isLoading} type='submit' form={formId}>Confirm</Button>
        </DialogActions>
      </Dialog>
  );
}
