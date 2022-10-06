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
        db.find({}, (err: Error, results: CardData[]) => {
            for (const card of results) {
                let days_since = daysBetween(card.last_seen, new Date())

                // Taper off really large numbers
                // 100 days since last seen = 10
                let last_seen_factor = Math.sqrt(days_since)
                // normalizes priority -> Domain: 0 <= x <= 5 | Range: 1 <= x <= 2
                let priority_factor = (card.priority / 6) + 1
                // increase recall_idx based on days not seen
                // increased exponentially by priority
                let recall_idx = Math.pow(last_seen_factor, priority_factor)

                db.update({_id: card._id}, {$set: {recall_idx: recall_idx}})
            }
        })

        console.log("Database loaded.")
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
        // updatePriority: (id: string, prio: number) => {
        //     db.update({ _id: id }, { $set: { priority: prio } })
        // },
        updateLastSeen: (id: string, new_date: Date, prio: number) => {
            db.findOne({_id: id}, (err, result) => {
                if (err) console.error(err)
                // prio_diff range = -5 >= x >= 5
                let prio_diff = -(result.priority - prio)
                // (prio_diff + 10) Range: 5 <= x <= 15
                // normalized_prio_factor Range: 0.5 <= x <= 1.5
                let normalized_prio_factor = (prio_diff + 10) / 10
                // worst case, recall_idx increases by 50%, best case it's halved
                let recall_idx = result.recall_idx * normalized_prio_factor

                console.log(`Days since last seen: ${result.last_seen / 1000 / 60 /60 / 24}`)
                console.log(`Prio: ${prio}.\nPrio_diff: ${prio_diff}.\nNormalized_prio_factor: ${normalized_prio_factor}.\nRecall_idx: ${recall_idx}`)
                db.update({ _id: id}, { $set: { last_seen: new_date, recall_idx: recall_idx, priority: prio} }, {returnUpdatedDocs: true}, (err, numUpdated, docs) => {
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

function daysBetween(startDate: Date, endDate: Date) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24
    return (treatAsUTC(endDate).getTime() - treatAsUTC(startDate).getTime()) / millisecondsPerDay
}

// Helper function to handle daylight saving time transitions
function treatAsUTC(date: Date) {
    const result = new Date(date)
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset())    
    return result
}




