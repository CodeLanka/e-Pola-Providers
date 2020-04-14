import React from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import styles from './AssignNeedDialog.styles'
import { Trans } from 'react-i18next'

const useStyles = makeStyles(styles)

function AssignNeedDialog({ onSubmit, open, onRequestClose }) {
  const classes = useStyles()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid }
  } = useForm({ mode: 'onChange' })

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle id="new-need-dialog-title" color="secondary">
        <Trans>Assign for Delivery</Trans>
      </DialogTitle>
      <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            inputRef={register}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onRequestClose} color="secondary">
            <Trans>Cancel</Trans>
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={isSubmitting || !isValid}>
            {isSubmitting ? (
              <Trans>Requesting...</Trans>
            ) : (
              <Trans>Request</Trans>
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

AssignNeedDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
}

export default AssignNeedDialog
