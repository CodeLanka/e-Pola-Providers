import React from 'react'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import styles from './TabPanel.styles'

const useStyles = makeStyles(styles)

function TabPanel(props) {
  const { children, value, index, noPadding, ...other } = props
  const classes = useStyles()

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      className={classes.root}
      {...other}>
      {value === index && <Box p={noPadding ? 0 : 3}>{children}</Box>}
    </Box>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  noPadding: PropTypes.bool.isRequired
}

TabPanel.defaultProps = {
  noPadding: false
}

export default TabPanel
