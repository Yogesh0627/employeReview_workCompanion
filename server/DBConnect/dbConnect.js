import mongoose from "mongoose";

async function databaseConnect(){

    try {
        const response = await mongoose.connect(`mongodb+srv://Yogesh:Yogesh%40mongo1@cluster0.vnzn2j6.mongodb.net/workCompanion`)
        console.log(`\n MongoDb connected !! DB host :${response.connection.host}`)
    } catch (error) {
        console.log("MongoDb connection Error",error)
        process.exit(1)     
    }
}

export default databaseConnect