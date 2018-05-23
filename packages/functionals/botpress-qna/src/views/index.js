import React, { Component, Fragment } from 'react'

import { Col, Row, Grid, FormGroup, ControlLabel, FormControl, Panel, ButtonToolbar, Button } from 'react-bootstrap'

import classnames from 'classnames'
import omit from 'lodash/omit'

import ArrayEditor from './ArrayEditor'
import style from './style.scss'

const NEW_INDEX = 'new'

export default class QnaAdmin extends Component {
  createEmptyQuestion() {
    return {
      id: null,
      data: {
        questions: [],
        answer: '',
        enabled: true
      }
    }
  }

  state = {
    newItem: this.createEmptyQuestion(),
    items: [],
    originals: {}
  }

  onCreate = value => {
    this.setState({
      newItem: this.createEmptyQuestion(),
      items: [this.state.newItem].concat(this.state.items)
    })
  }

  onChange = (value, index) => {
    if (index == null) {
      const newState = { newItem: value }
      if (!this.state.originals[NEW_INDEX]) {
        newState.originals = {
          ...this.state.originals,
          [NEW_INDEX]: this.state.newItem
        }
      }
      this.setState(newState)
    } else {
      const items = [...this.state.items]
      items[index] = value
      const newState = { items }
      if (!this.state.originals[index]) {
        newState.originals = {
          ...this.state.originals,
          [index]: this.state.items[index]
        }
      }
      this.setState(newState)
    }
  }

  onSaveChange = index => {
    this.setState({
      originals: omit(this.state.originals, index == null ? NEW_INDEX : index)
    })
    if (index == null) {
    } else {
    }
  }

  onReset = index => {
    if (index == null) {
      this.setState({
        newItem: this.state.originals[NEW_INDEX],
        originals: omit(this.state.originals, NEW_INDEX)
      })
    } else {
      const items = [...this.state.items]
      items[index] = this.state.originals[index]
      this.setState({ items, originals: omit(this.state.originals, index) })
    }
  }

  onDelete = index => {
    const { items } = this.state
    this.setState({ items: items.slice(0, index).concat(items.slice(index + 1)) })
  }

  onPropChange = (index, prop, onChange) => event => {
    const value = index == null ? this.state.newItem : this.state.items[index]
    onChange(
      {
        ...value,
        data: {
          ...value.data,
          [prop]: event.target.value
        }
      },
      index
    )
  }

  isDirty = index => !!this.state.originals[index == null ? NEW_INDEX : index]

  getFormControlId = (index, suffix) => `form-${index != null ? index : NEW_INDEX}-${suffix}`

  renderQuestionForm = ({ data }, index, { isDirty, onCreate, onEdit, onReset, onDelete, onChange, onSaveChange }) => (
    <Fragment>
      {index == null && <h3>New Q&amp;A</h3>}
      <FormGroup controlId={this.getFormControlId(index, 'answer')}>
        <ControlLabel>Answer:</ControlLabel>
        <FormControl
          componentClass="textarea"
          placeholder="Answer"
          value={data.answer}
          onChange={this.onPropChange(index, 'answer', onChange)}
        />
      </FormGroup>
      <ButtonToolbar>
        <Button type="button" onClick={() => onReset(index)} disabled={!isDirty}>
          Reset
        </Button>
        {index != null && (
          <Button type="button" bsStyle="danger" onClick={() => onDelete(index)}>
            Delete
          </Button>
        )}
        <Button
          type="button"
          bsStyle="success"
          onClick={() => (index != null ? onSaveChange(index) : onCreate(data))}
          disabled={!isDirty}
        >
          Save
        </Button>
      </ButtonToolbar>
    </Fragment>
  )

  render() {
    return (
      <Panel>
        <Panel.Body>
          <ArrayEditor
            values={this.state.items}
            newValue={this.state.newItem}
            renderItem={this.renderQuestionForm}
            onCreate={this.onCreate}
            onEdit={this.onEdit}
            onDelete={this.onDelete}
            onSaveChange={this.onSaveChange}
            onChange={this.onChange}
            onReset={this.onReset}
            isDirty={this.isDirty}
          />
        </Panel.Body>
      </Panel>
    )
  }
}
