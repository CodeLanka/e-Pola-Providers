import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { makeStyles } from '@material-ui/core/styles'
import styles from './Navbar.styles'
import { Avatar } from '@material-ui/core'
import logo from './logo.png'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const useStyles = makeStyles(styles)

const changeLanguge = (lan) => {
  return () => {
    // eslint-disable-next-line no-undef
    if (localStorage) {
      // eslint-disable-next-line no-undef
      localStorage.setItem('i18nextLng', lan)
      window.location.reload()
    }
  }
}

function NavbarWithoutAuth({ children, brandPath }) {
  const classes = useStyles()

  // Language Bar Toggle
  const [anchorElLang, setAnchorElLang] = React.useState(null)
  const handleClick = (event) => {
    setAnchorElLang(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorElLang(null)
  }

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Avatar
          className={classes.brandLogo}
          variant="square"
          src={logo}
          component={Link}
          to={brandPath || '/'}
        />
        <div className={classes.langMenu}>
          <ButtonGroup
            size="small"
            aria-label="small outlined button group"
            className={classes.langExpand}>
            <Button onClick={changeLanguge('en')}>English</Button>
            <Button onClick={changeLanguge('si')}>සිංහල</Button>
            <Button onClick={changeLanguge('ta')}>தமிழ்</Button>
          </ButtonGroup>

          {/* Collpse Menu */}
          <div className={classes.langCollapse}>
            <Button
              size="small"
              variant="outlined"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}>
              Language
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorElLang}
              keepMounted
              open={Boolean(anchorElLang)}
              onClose={handleClose}>
              <MenuItem onClick={changeLanguge('en')}>English</MenuItem>
              <MenuItem onClick={changeLanguge('si')}>සිංහල</MenuItem>
              <MenuItem onClick={changeLanguge('ta')}>தமிழ்</MenuItem>
            </Menu>
          </div>
        </div>
        {children}
      </Toolbar>
    </AppBar>
  )
}

NavbarWithoutAuth.propTypes = {
  children: PropTypes.element,
  brandPath: PropTypes.string
}

export default NavbarWithoutAuth
