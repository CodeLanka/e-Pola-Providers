import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  useFirestore,
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
import SideMenu from '../SideMenu'
import styles from './NeedsList.styles'
import { usePosition } from 'use-position'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TableChartIcon from '@material-ui/icons/TableChart'
import MapIcon from '@material-ui/icons/Map'
import fetcher from 'utils/fetcher'
import Grid from '@material-ui/core/Grid'
import AssignNeedDialog from '../AssignNeedDialog'
import { useNotifications } from 'modules/notification'

const useStyles = makeStyles(styles)

function useNeedsList() {
  const { showSuccess, showError } = useNotifications()
  const firestore = useFirestore()
  const [selectedProducts, setSelectedProducts] = React.useState(new Set())

  // New dialog
  const [assignNeedsDialogOpen, changeAssignNeedsDialogState] = useState(false)
  const toggleassignNeedsDialog = () =>
    changeAssignNeedsDialogState(!assignNeedsDialogOpen)

  const handleSelectedProductsChange = (product, state) => {
    let nextSelectedProducts = null
    if (state) {
      nextSelectedProducts = selectedProducts.add(product)
      setSelectedProducts(new Set())
    } else {
      selectedProducts.delete(product)
      nextSelectedProducts = selectedProducts
    }
    setSelectedProducts(new Set(nextSelectedProducts))
  }

  const url = `https://api-aw4mzcvpla-uc.a.run.app/api/v2/needs?products=${[
    ...selectedProducts.keys()
  ].join()}`
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

  function addDelivery(newInstance) {
    if (!auth.uid) {
      return showError('You must be logged in to assign a delivery')
    }
    return firestore
      .add('delivery', {
        ...newInstance,
        createdBy: auth.uid,
        createdAt: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        toggleassignNeedsDialog()
        showSuccess('Delivery added successfully')
      })
      .catch((err) => {
        console.error('Error:', err) // eslint-disable-line no-console
        showError(err.message || 'Could not add delivery')
        return Promise.reject(err)
      })
  }

  return {
    needs,
    location,
    selectedProducts,
    handleSelectedProductsChange,
    assignNeedsDialogOpen,
    toggleassignNeedsDialog,
    addDelivery
  }
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
  const {
    needs,
    location,
    selectedProducts,
    handleSelectedProductsChange,
    assignNeedsDialogOpen,
    toggleassignNeedsDialog,
    addDelivery
  } = useNeedsList()
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
    <Grid container spacing={2}>
      <Grid item xs={2} className={classes.sideMenu}>
        <SideMenu
          selectedProducts={selectedProducts}
          onSelectedProductsChange={handleSelectedProductsChange}
        />
      </Grid>
      <Grid item xs={10} className={classes.main}>
        <AssignNeedDialog
          onSubmit={addDelivery}
          open={assignNeedsDialogOpen}
          onRequestClose={toggleassignNeedsDialog}
        />
        <AppBar position="static" color="transparent" elevation={0}>
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
          <NewNeedTable
            needs={rows}
            location={location}
            toggleassignNeedsDialog={toggleassignNeedsDialog}
          />
        </TabPanel>
        <TabPanel value={tab} index={1} noPadding>
          <MapView needs={rows} location={location} />
        </TabPanel>
      </Grid>
    </Grid>
  )
}

export default NeedsList
