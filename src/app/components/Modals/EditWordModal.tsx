'use client';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { BaseModal, BaseModalProps } from './BaseModal';
import { PlaygroundItem } from '@/app/lib/types/playground';
import { FormikHelpers, useFormik } from 'formik';
import * as Yup from 'yup';
import { ProgressContainer } from '../ProgressContainer/ProgressContainer';
import { UpdateWordUiRequestBody } from '@/app/api/playground/words/route';
import Button from '@mui/material/Button';
import { DeleteTranslationUiRequestBody } from '@/app/api/playground/translations/route';
import Box from '@mui/material/Box';

type EditPlaygroundItemModalProps = Pick<BaseModalProps, 'isOpen' | 'onClose'>
  & {
  playgroundItem: PlaygroundItem,
  onSuccess: () => void,
  onDelete: () => void,
};

const validationSchema = Yup.object().shape({
  wordIdFrom: Yup.number()
    .required('Required'),
  wordFrom: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  exampleFrom: Yup.string()
    .min(2, 'Too Short!')
    .max(1000, 'Too Long!')
    .required('Required'),
  wordIdTo: Yup.number()
    .required('Required'),
  wordTo: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  exampleTo: Yup.string()
    .min(2, 'Too Short!')
    .max(1000, 'Too Long!')
    .required('Required'),
});

export const EditWordModal = ({ isOpen, onClose, playgroundItem, onSuccess, onDelete }: EditPlaygroundItemModalProps) => {
    const onSubmit = async (
      values: UpdateWordUiRequestBody,
      formikHelpers: FormikHelpers<UpdateWordUiRequestBody>
    ) => {
        const response = await fetch('/api/playground/words', {
          method: 'PUT',
          body: JSON.stringify(values),
        });

        if (response.ok) {
          onClose();
          onSuccess();
        }
    }

    const handleDelete = async () => {
      const requestBody: DeleteTranslationUiRequestBody = {
        translationId: playgroundItem.translationId,
      }
      const result = await fetch('/api/playground/translations', {
        method: 'DELETE',
        body: JSON.stringify(requestBody)
      });
      if (result.ok) {
        onClose();
        onDelete();
      }
    }

    const initialValues: UpdateWordUiRequestBody = {
      wordIdFrom: playgroundItem.wordIdFrom,
      wordFrom: playgroundItem.wordFrom,
      exampleFrom: playgroundItem.exampleFrom ?? '',
      wordIdTo: playgroundItem.wordIdTo,
      wordTo: playgroundItem.wordTo,
      exampleTo: playgroundItem.exampleTo ?? '',
    };

    const formik = useFormik({
      initialValues,
      onSubmit,
      enableReinitialize: true,
      validationSchema: validationSchema,
    });

    const handleFixTags = () => {
      const replaced = (x: string) => x.replaceAll('<em>', '').replaceAll('</em>', '');
      formik.setFieldValue('wordFrom', replaced(formik.values.wordFrom));
      formik.setFieldValue('wordTo', replaced(formik.values.wordTo));
      formik.setFieldValue('exampleFrom', replaced(formik.values.exampleFrom));
      formik.setFieldValue('exampleTo', replaced(formik.values.exampleTo));
    };

    const formId = "edit-translation-form";

    const additionalButtons = (
      <>
        <Box flexGrow={1}>
          <Button color='error' onClick={handleDelete}>Delete</Button>
        </Box>
        <Button onClick={handleFixTags}>Fix tags</Button>
      </>
    )

  return (
    <BaseModal
      title='Edit translation'
      subtitle={`translationId: ${playgroundItem.translationId}`}
      isOpen={isOpen}
      isLoading={formik.isSubmitting}
      onClose={onClose}
      formId={formId}
      additionalButtons={additionalButtons}
    >
      <ProgressContainer isLoading={formik.isSubmitting}>
        <form onSubmit={formik.handleSubmit} id={formId}>
            <TextField
                id="wordFrom"
                name="wordFrom"
                label="Word from"
                value={formik.values.wordFrom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.wordFrom && Boolean(formik.errors.wordFrom)}
                helperText={formik.touched.wordFrom && formik.errors.wordFrom}
                autoFocus
                margin="dense"
                fullWidth
                variant="standard"
            />
            <TextField
                id="exampleFrom"
                name="exampleFrom"
                label="Example from"
                value={formik.values.exampleFrom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.exampleFrom && Boolean(formik.errors.exampleFrom)}
                helperText={formik.touched.exampleFrom && formik.errors.exampleFrom}
                autoFocus
                margin="dense"
                fullWidth
                variant="standard"
            />
            <TextField
                id="wordTo"
                name="wordTo"
                label="Word to"
                value={formik.values.wordTo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.wordTo && Boolean(formik.errors.wordTo)}
                helperText={formik.touched.wordTo && formik.errors.wordTo}
                autoFocus
                margin="dense"
                fullWidth
                variant="standard"
            />
            <TextField
                id="exampleTo"
                name="exampleTo"
                label="Example to"
                value={formik.values.exampleTo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.exampleTo && Boolean(formik.errors.exampleTo)}
                helperText={formik.touched.exampleTo && formik.errors.exampleTo}
                autoFocus
                margin="dense"
                fullWidth
                variant="standard"
            />
        </form>
      </ProgressContainer>
    </BaseModal>
  );
}
