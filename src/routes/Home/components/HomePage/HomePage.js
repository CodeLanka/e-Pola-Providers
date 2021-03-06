import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import styles from './HomePage.styles'
import Image from 'material-ui-image'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import { Trans } from 'react-i18next'

// const reactRouterUrl = 'https://github.com/ReactTraining/react-router'

const useStyles = makeStyles(styles)

function Home() {
  const classes = useStyles()

  return (
    <div>
      <Grid container spacing={3} className={classes.mainContainer}>
        <Grid item xs={12} sm={6} className={classes.leftSide}>
          <Image
            src="/img/bikebanner.gif"
            imageStyle={{
              width: '300px',
              height: 'auto',
              position: 'relative'
            }}
            style={{
              padding: '0',
              width: '100%',
              textAlign: 'center',
              marginBottom: '1.5rem',
              flexDirection: 'column'
            }}
          />
          <Typography variant="subtitle1" gutterBottom>
            Got stuff to deliver to people? <br />
            GiveMe.lk will help you find the people who need them.
          </Typography>
          <br />
          <Typography variant="subtitle2" gutterBottom>
            <Trans>Developed By</Trans>:
          </Typography>
          <a
            href="http://codelanka.org"
            target="_blank"
            rel="noopener noreferrer">
            <Image
              src="/img/codelanka.png"
              imageStyle={{
                width: '100px',
                height: 'auto',
                position: 'relative'
              }}
              style={{
                padding: '0',
                width: '100%',
                textAlign: 'center',
                marginBottom: '1.5rem',
                flexDirection: 'column'
              }}
            />
          </a>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.rightSide}>
          <Typography variant="h4" gutterBottom className={classes.welcome}>
            <Trans>
              Welcome to GIVE<strong className={classes.strong}>ME</strong>.lk!
            </Trans>
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <Trans>
              Log-in and you can get started to supply your goods. Here is how
              you do that...
            </Trans>
          </Typography>

          <Card className={classes.cardRoot}>
            <CardMedia
              className={classes.cover}
              component="img"
              width="50%"
              image="/img/step1.svg"
            />
            <div>
              <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                  <Trans>Step</Trans> 1
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  <Trans>
                    You log in to GIVE
                    <strong className={classes.strong}>ME</strong>.
                  </Trans>
                </Typography>
              </CardContent>
            </div>
          </Card>

          <Card className={classes.cardRoot}>
            <CardMedia
              className={classes.cover}
              component="img"
              width="50%"
              image="/img/step2.svg"
            />
            <div>
              <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                  <Trans>Step</Trans> 2
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  You set your supply areas
                </Typography>
              </CardContent>
            </div>
          </Card>

          <Card className={classes.cardRoot}>
            <CardMedia
              className={classes.cover}
              component="img"
              width="50%"
              image="/img/step3.svg"
            />
            <div>
              <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                  <Trans>Step</Trans> 3
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  You get the list of locations which need produce
                </Typography>
              </CardContent>
            </div>
          </Card>

          <Card className={classes.cardRoot}>
            <CardMedia
              className={classes.cover}
              component="img"
              width="50%"
              image="/img/step4.svg"
            />
            <div>
              <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                  <Trans>Step</Trans> 4
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  You visit the locations and supply the items.
                </Typography>
              </CardContent>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default Home
