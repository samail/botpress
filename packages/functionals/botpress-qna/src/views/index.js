import React, { Component, Fragment } from 'react'

import { FormGroup, ControlLabel, FormControl, Checkbox, Panel, ButtonToolbar, Button } from 'react-bootstrap'

import classnames from 'classnames'

import ArrayEditor from './ArrayEditor'
import style from './style.scss'

const getInputValue = input => {
  switch (input.type) {
    case 'checkbox':
      return input.checked
    default:
      return input.value
  }
}

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
    items: []
  }

  onCreate = value => {
    // API to create new
    console.log('created', value)
  }

  onEdit = index => {
    // API to edit
    console.log('edited', index)
  }

  onDelete = index => {
    // API to delete
    console.log('delete', index)
  }

  onPropChange = (index, prop, onChange) => event => {
    const value = index == null ? this.state.newItem : this.state.items[index]
    onChange(
      {
        ...value,
        data: {
          ...value.data,
          [prop]: getInputValue(event.target)
        }
      },
      index
    )
  }

  updateState = newState => this.setState(newState)

  getFormControlId = (index, suffix) => `form-${index != null ? index : 'new'}-${suffix}`

  canSave = data => !!data.answer // && !!data.questions.length

  renderQuestionForm = ({ data }, index, { isDirty, onCreate, onEdit, onReset, onDelete, onChange }) => (
    <Fragment>
      {index == null && <h3>New Q&amp;A</h3>}
      <Checkbox checked={data.enabled} onChange={this.onPropChange(index, 'enabled', onChange)}>
        Enabled
      </Checkbox>
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
          onClick={() => (index != null ? onEdit(index) : onCreate())}
          disabled={!isDirty || !this.canSave(data)}
        >
          {index != null ? 'Save' : 'Create'}
        </Button>
      </ButtonToolbar>
    </Fragment>
  )

  render() {
    return (
      <Panel>
        <Panel.Body>
          <ArrayEditor
            items={this.state.items}
            newItem={this.state.newItem}
            renderItem={this.renderQuestionForm}
            onCreate={this.onCreate}
            onEdit={this.onEdit}
            onDelete={this.onDelete}
            onChange={this.onChange}
            onReset={this.onReset}
            isDirty={this.isDirty}
            updateState={this.updateState}
            createNewItem={this.createEmptyQuestion}
          />
        </Panel.Body>
      </Panel>
    )
  }
}
