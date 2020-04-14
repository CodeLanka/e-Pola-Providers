import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import groupBy from 'lodash/groupBy'

import styles from './SideMenu.styles'
import * as PropTypes from 'prop-types'

const useStyles = makeStyles(styles)

function Category(props) {
  const {
    category,
    products,
    open,
    selectedProducts,
    onChange,
    classes
  } = props
  const handleChange = (id, state) => {
    return () => onChange(id, state)
  }
  if (!products) return null
  return (
    <>
      <ListItem button onClick={props.onClick}>
        <ListItemIcon>🧀</ListItemIcon>
        <ListItemText primary={category} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {products &&
            products.map((product) => (
              <ListItem className={classes.nested} key={product.id}>
                <ListItemIcon>
                  <Checkbox
                    checked={selectedProducts.has(product.id)}
                    onChange={handleChange(
                      product.id,
                      !selectedProducts.has(product.id)
                    )}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </ListItemIcon>
                <ListItemText primary={product.name} />
              </ListItem>
            ))}
        </List>
      </Collapse>
    </>
  )
}

Category.propTypes = {
  onClick: PropTypes.func,
  open: PropTypes.bool,
  classes: PropTypes.any,
  onChange: PropTypes.func,
  category: PropTypes.string,
  products: PropTypes.array,
  selectedProducts: PropTypes.object
}

export default function SideMenu(props) {
  const { selectedProducts, onSelectedProductsChange } = props
  const classes = useStyles()
  const [openCategories, setOpenCategories] = React.useState(new Map())
  const categories = {
    meat: 'Meat,Saefood & Poultry',
    dairy: 'Dairy',
    grocery: 'Grocery',
    grains: 'Grains',
    foo: 'Fooo'
  }

  useFirestoreConnect({
    collection: 'products',
    where: ['category', 'in', Object.keys(categories)]
  })

  const products = useSelector(({ firestore: { ordered } }) => ordered.products)
  const productGroups = groupBy(products, 'category')

  const handleClick = (category, state) => {
    return () => setOpenCategories(new Map(openCategories.set(category, state)))
  }

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Filters
        </ListSubheader>
      }
      className={classes.root}>
      <ListItem>
        <TextField label="Area" variant="outlined" />
      </ListItem>
      <ListItem>
        <TextField label="Suburb" variant="outlined" />
      </ListItem>
      {Object.keys(categories).map((category) => (
        <Category
          onClick={handleClick(category, !openCategories.get(category))}
          open={!!openCategories.get(category)}
          classes={classes}
          onChange={onSelectedProductsChange}
          selectedProducts={selectedProducts}
          category={categories[category]}
          products={productGroups[category]}
          key={category}
        />
      ))}
    </List>
  )
}

SideMenu.propTypes = {
  onSelectedProductsChange: PropTypes.func,
  selectedProducts: PropTypes.object
}
