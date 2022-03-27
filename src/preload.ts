import { contextBridge, ipcRenderer } from "electron";
import { CardData } from "./models/models";
import DataStore from 'nedb'

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
        sendCard: (channel: string, data: CardData) => {
            ipcRenderer.send(channel, data)
        },
        onResponse: (fn: any) => {
            ipcRenderer.on('add-card', (event, ...args) => fn(...args))
        },
        saveCard: (card_data: CardData) => {
            db.insert(card_data, (error, doc) => {
                if (error) {
                    console.error(`Error inserting card: ${error}`)
                } else {
                    console.log(`Inserted: ${JSON.stringify(doc, null, 2)}`)
                }
            })
        }
    },
)



