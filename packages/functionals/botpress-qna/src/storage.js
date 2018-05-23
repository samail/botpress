import mkdirp from 'mkdirp'
import path from 'path'
import _ from 'lodash'
import Promise from 'bluebird'
import generate from 'nanoid/generate'

const safeId = (length = 10) => generate('1234567890abcdefghijklmnopqrsuvwxyz', length)

const slugify = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '_')

const getQuestionId = ({ questions }) =>
  `${safeId()}_${slugify(questions[0])
    .replace(/^_+/, '')
    .substring(0, 50)
    .replace(/_+$/, '')}`

export default class Storage {
  constructor({ bp, config }) {
    this.ghost = bp.ghostManager
    this.projectDir = bp.projectLocation
    this.qnaDir = config.qnaDir
  }

  async initializeGhost() {
    mkdirp.sync(path.resolve(this.projectDir, this.qnaDir))
    await this.ghost.addRootFolder(this.qnaDir, { filesGlob: '**/*.json' })
  }

  async saveQuestion(id, data) {
    id = id || getQuestionId(data)
    await this.ghost.upsertFile(this.qnaDir, `${id}.json`, JSON.stringify({ id, data }, null, 2))
    return id
  }

  async getQuestion(id) {
    let filename
    if (typeof id === 'string') {
      filename || `${id}.json`
    } else {
      // opts object
      filename = id.filename
    }
    const data = await this.ghost.readFile(this.qnaDir, filename)
    return JSON.parse(data)
  }

  async getQuestions() {
    const questions = await this.ghost.directoryListing(this.qnaDir, '.json')
    return Promise.map(questions, question => this.getQuestion({ filename: question }))
  }

  async deleteQuestion(id) {
    await this.ghost.deleteFile(this.qnaDir, `${id}.json`)
  }
}
