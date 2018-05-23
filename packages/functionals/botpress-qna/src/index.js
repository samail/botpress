import Promise from 'bluebird'

import Storage from './storage'
import { processEvent } from './middleware'

let storage

module.exports = {
  config: {
    qnaDir: { type: 'string', required: true, default: './qna', env: 'QNA_DIR' }
  },
  async init(bp, configurator) {
    const config = await configurator.loadAll()
    storage = new Storage({ bp, config })
    await storage.initializeGhost()

    bp.middlewares.register({
      name: 'qna.incoming',
      module: 'botpress-qna',
      type: 'incoming',
      handler: async (event, next) => {
        await processEvent(event)
        next()
      },
      order: 20, // must be after the NLU middleware
      description: 'Listen for predefined questions and send canned responses.'
    })
  },
  ready(bp) {
    const router = bp.getRouter('botpress-qna')

    router.get('/', async (req, res) => {
      try {
        res.send(await storage.getQuestions())
      } catch (e) {
        console.error('QnA Error', e, e.stack)
        res.status(500).send(e.message || 'Error')
      }
    })

    router.post('/', async (req, res) => {
      try {
        const id = await storage.saveQuestion(null, req.body)
        res.send(id)
      } catch (e) {
        console.error('QnA Error', e, e.stack)
        res.status(500).send(e.message || 'Error')
      }
    })

    router.put('/:question', async (req, res) => {
      try {
        await storage.saveQuestion(req.params.question, req.body)
        res.end()
      } catch (e) {
        console.error('QnA Error', e, e.stack)
        res.status(500).send(e.message || 'Error')
      }
    })

    router.delete('/:question', async (req, res) => {
      try {
        await storage.deleteQuestion(req.params.question)
        res.end()
      } catch (e) {
        console.error('QnA Error', e, e.stack)
        res.status(500).send(e.message || 'Error')
      }
    })
  }
}
