export default (theme) => ({
  flex: {
    flexGrow: 1
  },
  appBar: {
    // backgroundColor: theme.palette.primary1Color // Update this to change navbar color
    backgroundColor: 'white',
    color: 'secondary',
    boxShadow: 'none'
  },
  signIn: {
    color: 'secondary',
    textDecoration: 'none',
    alignSelf: 'center'
  },
  brandLogo: {
    marginRight: '1em',
    width: '140px'
  },
  langMenu: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  langExpand: {
    [theme.breakpoints.down(600)]: {
      display: 'none'
    },
    [theme.breakpoints.up(600)]: {
      display: 'inline-flex'
    }
  },
  langCollapse: {
    [theme.breakpoints.down(600)]: {
      display: 'inline-flex'
    },
    [theme.breakpoints.up(600)]: {
      display: 'none'
    }
  }
})
