import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import NeedRoute from 'routes/Needs/routes/Need'
import { renderChildren } from 'utils/router'
import NeedsList from '../NeedsList'

function NeedsPage({ match }) {
  return (
    <div style={{ backgroundColor: 'white' }}>
      <Switch>
        {/* Child routes */}
        {renderChildren([NeedRoute], match)}
        {/* Main Route */}
        <Route exact path={match.path} render={() => <NeedsList />} />
      </Switch>
    </div>
  )
}

NeedsPage.propTypes = {
  match: PropTypes.object.isRequired // from enhancer (withRouter)
}

export default NeedsPage
