import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  // useFirestore,
  useFirestoreConnect,
  isLoaded
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'
// import { useNotifications } from 'modules/notification'
import useSwr from 'swr'
import LoadingSpinner from 'components/LoadingSpinner'
import TabPanel from '../TabPanel'
import NewNeedTable from '../NewNeedTable'
import MapView from '../MapView'
import styles from './NeedsList.styles'
import { usePosition } from 'use-position'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TableChartIcon from '@material-ui/icons/TableChart'
import MapIcon from '@material-ui/icons/Map'
import fetcher from 'utils/fetcher'

const useStyles = makeStyles(styles)

function useNeedsList() {
  // const { showSuccess, showError } = useNotifications()
  // const firestore = useFirestore()
  const url = 'https://api-aw4mzcvpla-uc.a.run.app/api/v1/needs'
  const { data, error } = useSwr(url, { fetcher })
  const needs = data && !error ? data : []

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
  // const needs = useSelector(({ firestore: { ordered } }) => ordered.needs)

  // console.log(needs,crimes)

  return { needs, location }
}

function createData(id, name, amount, time, user, location) {
  return { id, name, amount, time, user, location }
}

function createAllData(needs) {
  return needs.map((need) => {
    return createData(
      `id-${Math.random()}`,
      need.name,
      need.amount,
      Date.parse(need.createdAt),
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
          <Tab icon={<TableChartIcon />} label="Table" />
          <Tab icon={<MapIcon />} label="Map" />
        </Tabs>
      </AppBar>
      <TabPanel value={tab} index={0}>
        <NewNeedTable needs={rows} location={location} />
      </TabPanel>
      <TabPanel value={tab} index={1} noPadding>
        <MapView needs={rows} location={location} />
      </TabPanel>
    </div>
  )
}

export default NeedsList
