import React, { Component, Fragment } from 'react'

import { Col, Row, Grid, Button, Panel } from 'react-bootstrap'

const ArrayEditor = ({
  newValue,
  values,
  renderItem,
  isDirty,
  onCreate,
  onEdit,
  onReset,
  onDelete,
  onChange,
  onSaveChange
}) => {
  const renderItemForm = (value, index) => {
    return (
      <Fragment key={index != null ? index : 'new'}>
        {renderItem(value, index, {
          isDirty: isDirty(index),
          onCreate,
          onEdit,
          onReset,
          onDelete,
          onChange,
          onSaveChange
        })}
      </Fragment>
    )
  }

  return (
    <Fragment>
      {renderItemForm(newValue, null)}
      <hr />
      {values.map(renderItemForm)}
    </Fragment>
  )
}

export default ArrayEditor
