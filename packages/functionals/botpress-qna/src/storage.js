import mkdirp from 'mkdirp'
import path from 'path'
import _ from 'lodash'
import Promise from 'bluebird'
import generate from 'nanoid/generate'

const safeId = (length = 10) => generate('1234567890abcdefghijklmnopqrsuvwxyz', length)

const slugify = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '_')

const getQuestionId = ({ questions }) => `${safeId()}_${slugify(questions[0]).substring(0, 50)}`

export default class Storage {
  async getQuestions() {}
  async saveQuestion(id, data) {
    id = id || getQuestionId(data)
  }
  async deleteQuestion(id) {}
}
