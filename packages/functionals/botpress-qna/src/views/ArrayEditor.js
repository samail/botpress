import React, { Component, Fragment } from 'react'
import omit from 'lodash/omit'

const NEW_INDEX = 'new'

export default class ArrayEditor extends Component {
  state = {
    originals: {}
  }

  onCreate = () => {
    const { newItem, onCreate, updateState, createNewItem } = this.props

    onCreate && onCreate(newItem)

    updateState &&
      updateState({
        newItem: createNewItem(),
        items: [newItem].concat(this.props.items)
      })
  }

  onChange = (value, index) => {
    const { onChange, updateState } = this.props

    onChange && onChange(value, index)

    if (index == null) {
      if (!this.state.originals[NEW_INDEX]) {
        this.setState({
          originals: {
            ...this.state.originals,
            [NEW_INDEX]: this.props.newItem
          }
        })
      }
      updateState && updateState({ newItem: value })
    } else {
      const items = [...this.props.items]
      items[index] = value
      if (!this.state.originals[index]) {
        this.setState({
          originals: {
            ...this.state.originals,
            [index]: this.props.items[index]
          }
        })
      }
      updateState && updateState({ items })
    }
  }

  onEdit = index => {
    const { onEdit } = this.props

    onEdit && onEdit(index)

    this.setState({
      originals: omit(this.state.originals, index)
    })
  }

  onReset = index => {
    const { onReset, updateState } = this.props

    onReset && onReset(index)

    if (index == null) {
      updateState &&
        updateState({
          newItem: this.state.originals[NEW_INDEX]
        })
      this.setState({
        originals: omit(this.state.originals, NEW_INDEX)
      })
    } else {
      const items = [...this.props.items]
      items[index] = this.state.originals[index]
      updateState && updateState({ items })
      this.setState({ originals: omit(this.state.originals, index) })
    }
  }

  onDelete = index => {
    const { items, onDelete, updateState } = this.props

    onDelete && onDelete(index)

    updateState && updateState({ items: items.slice(0, index).concat(items.slice(index + 1)) })
  }

  isDirty = index => !!this.state.originals[index == null ? NEW_INDEX : index]

  renderItemForm = (value, index) => {
    const { renderItem } = this.props

    return (
      <Fragment key={index != null ? index : 'new'}>
        {renderItem(value, index, {
          isDirty: this.isDirty(index),
          onCreate: this.onCreate,
          onEdit: this.onEdit,
          onReset: this.onReset,
          onDelete: this.onDelete,
          onChange: this.onChange
        })}
      </Fragment>
    )
  }

  render() {
    const { newItem, items } = this.props

    return (
      <Fragment>
        {this.renderItemForm(newItem, null)}
        <hr />
        {items.map(this.renderItemForm)}
      </Fragment>
    )
  }
}
