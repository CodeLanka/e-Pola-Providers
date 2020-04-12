import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import GoogleMapReact from 'google-map-react'
import useSupercluster from 'use-supercluster'
import RoomIcon from '@material-ui/icons/Room'
import styles from './MapView.styles'

const useStyles = makeStyles(styles)

const Marker = ({ children }) => children

export default function MapView(props) {
  const { needs, location } = props
  const classes = useStyles()
  const mapRef = useRef()
  const [bounds, setBounds] = useState(null)
  const [zoom, setZoom] = useState(10)

  const points = needs.map((need) => ({
    type: 'Feature',
    properties: { cluster: false, needId: need.id, name: need.name },
    geometry: {
      type: 'Point',
      coordinates: [
        parseFloat(need.location.lon),
        parseFloat(need.location.lat)
      ]
    }
  }))

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  })

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
        defaultCenter={{ lat: location.lat, lng: location.lon }}
        defaultZoom={10}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom)
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat
          ])
        }}>
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates
          const {
            cluster: isCluster,
            point_count: pointCount
          } = cluster.properties

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                lat={latitude}
                lng={longitude}>
                <div
                  className={classes.clusterMarker}
                  style={{
                    width: `${10 + (pointCount / points.length) * 20}px`,
                    height: `${10 + (pointCount / points.length) * 20}px`
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    )
                    mapRef.current.setZoom(expansionZoom)
                    mapRef.current.panTo({ lat: latitude, lng: longitude })
                  }}>
                  {pointCount}
                </div>
              </Marker>
            )
          }

          return (
            <Marker
              key={`need-${cluster.properties.needId}`}
              lat={latitude}
              lng={longitude}>
              <RoomIcon />
            </Marker>
          )
        })}
      </GoogleMapReact>
    </div>
  )
}

MapView.propTypes = {
  location: PropTypes.object.isRequired,
  needs: PropTypes.array.isRequired
}
