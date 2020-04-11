import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  // useFirestore,
  useFirestoreConnect,
  isLoaded
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'
// import { useNotifications } from 'modules/notification'
import LoadingSpinner from 'components/LoadingSpinner'
import TabPanel from '../TabPanel'
import NewNeedTable from '../NewNeedTable'
import styles from './NeedsList.styles'
import { usePosition } from 'use-position'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import PhoneIcon from '@material-ui/icons/Phone'
import MapIcon from '@material-ui/icons/Map'

const useStyles = makeStyles(styles)

function useNeedsList() {
  // const { showSuccess, showError } = useNotifications()
  // const firestore = useFirestore()

  // Get auth from redux state
  const auth = useSelector(({ firebase: { auth, profile } }) => auth)
  const profile = useSelector(({ firebase: { profile } }) => profile)
  const { latitude, longitude } = usePosition()
  const location = { lat: 0, lon: 0 }

  if (profile.location) {
    const { lat: latitude, lon: longitude } = profile.location
    location.lat = latitude
    location.lon = longitude
  } else if (latitude && longitude) {
    location.lat = latitude
    location.lon = longitude
  }

  useFirestoreConnect([
    {
      collection: 'needs',
      where: ['createdBy', '==', auth.uid]
    }
  ])

  // Get needs from redux state
  const needs = useSelector(({ firestore: { ordered } }) => ordered.needs)

  return { needs, location }
}

function createData(name, amount, time, user, location) {
  return { name, amount, time, user, location }
}

function createAllData(needs) {
  return needs.map((need) => {
    return createData(
      need.name,
      need.amount,
      need.createdAt.seconds * 1000,
      need.createdBy,
      need.location
    )
  })
}

function NeedsList() {
  const classes = useStyles()
  const { needs, location } = useNeedsList()
  const rows = needs ? createAllData(needs) : []
  const [tab, setTab] = React.useState(0)

  const handleChange = (event, newTab) => {
    setTab(newTab)
  }

  // Show spinner while needs are loading
  if (!isLoaded(needs)) {
    return <LoadingSpinner />
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Tabs
          value={tab}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="secondary"
          textColor="secondary"
          aria-label="icon label tabs example">
          <Tab icon={<PhoneIcon />} label="RECENTS" />
          <Tab icon={<MapIcon />} label="NEARBY" />
        </Tabs>
      </AppBar>
      <TabPanel value={tab} index={0}>
        <NewNeedTable needs={rows} location={location} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        Item Two
      </TabPanel>
    </div>
  )
}

export default NeedsList
