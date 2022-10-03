import { contextBridge, ipcRenderer } from "electron";
import { CardData } from "./models/models";
import DataStore from 'nedb'

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

contextBridge.exposeInMainWorld(
    'api',
    {
        getCards: () => {
            return new Promise((resolve, reject) => {
                db.find({}).sort({ recall_idx: -1}).exec((error, result) => {
                    if (error !== null) reject(error)
                    else resolve(result) 
                })
            })
        },
        insertCard: (card: CardData) => {
            db.insert({...card, recall_idx: Number.MAX_VALUE}, (err, doc) => {
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
            db.findOne({_id: id}, (err, result) => {
                if (err) console.error(err)
                // Days since card has been seen <- 1000 * 60 * 60 * 24
                let date_diff = (new_date.getTime() - result.last_seen.getTime()) / 86400000
                
                let recall_idx = date_diff * Math.log10(result.priority + 1)
                // Due to how big this numbers can get, counter measure to avoid Number.infinity
                recall_idx = recall_idx > Number.MAX_VALUE ? Number.MAX_VALUE : recall_idx
                db.update({ _id: id}, { $set: { last_seen: new_date, recall_idx: recall_idx} }, {returnUpdatedDocs: true}, (err, numUpdated, docs) => {
                    console.log(JSON.stringify(docs, null, 2))
                })
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





