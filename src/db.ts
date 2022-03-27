import { CardData } from "./models/models";
import DataStore from 'nedb'

console.log(window.api)

window.api.onResponse((card: CardData) => {
    console.log('db received request to save card.')
    window.api.saveCard(card)
})

// window.api.db_ready((db: any) => {
//     console.log("db-ready at db.ts")
//     console.log(db)
// })
