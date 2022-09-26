import { contextBridge, ipcRenderer } from "electron";
import { CardData } from "./models/models";
import DataStore from 'nedb'

let cards_queue: CardData[] = []

type queryData = {
    kanji?: object,
    tags?: object,
    priority?: number
}

const db = new DataStore({filename: './src/data/db'})

db.loadDatabase((error) => {
    if (error) {
        console.error(`Could not load database ${error}`)
    } else {
        console.log("Loaded database")
    }
})

ipcRenderer.on('add-card', (event, card: CardData) => {
    console.log('db received request to save card.')
    db.insert(card, (error, doc) => {
        if (error) {
            console.error(`Error inserting card: ${error}`)
        } else {
            console.log(`Inserted: ${JSON.stringify(doc, null, 2)}`)
        }
    })
})

ipcRenderer.on('get-cards', (event) => {
    console.log("Received get-cards message")
    db.find({}, (error: any, docs: CardData[]) => {
        if(error) {
            console.error(error)
        } else {
            ipcRenderer.send('deliver-cards', docs)
        }
    })
})

contextBridge.exposeInMainWorld(
    'api',
    {
        getCards: () => {
            return new Promise((resolve, reject) => {
                db.find({}).exec((error, result) => {
                    if (error !== null) reject(error)
                    else resolve(result) 
                })
            })
        },
        insertCard: (card: CardData) => {
            db.insert(card, (err, doc) => {
                if (err) {
                    console.error(`Error inserting card: ${err}`)
                    return
                }

                console.log(`Inserted: ${JSON.stringify(doc, null, 2)}`)
            })
        },
        updatePriority: (id: string, prio: number) => {
            db.update({ _id: id }, { $set: { priority: prio } })
        },
        updateLastSeen: (id: string, new_date: Date) => {
            db.update({ _id: id}, { $set: { last_seen: new_date}}, {returnUpdatedDocs: true}, (err, numUpdated, docs) => {
                console.log(JSON.stringify(docs, null, 2))
            })
        },
        searchCards: (keyword: string, category: string, priority: number) => {
            return new Promise((resolve, reject) => {
                const query: queryData = {}
                if( keyword !== '') {
                    const regex = new RegExp(`${keyword}`)
                    query.kanji = regex
                }
                if (category !== 'None') query.tags = {$elemMatch: category}
                if (priority !== 0) query.priority = priority
                
                db.find(query).exec((err, result) => {
                    if (err !== null) reject(err)
                    else resolve(result)
                })
            })
        }
    },
)





