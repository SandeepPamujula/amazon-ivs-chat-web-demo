
const mongoose = require("mongoose");
const uri =  "";
const connectDB = async () => {
    const conn = mongoose.connect(uri, {
      // and tell the MongoDB driver to not wait more than 5 seconds
      // before erroring out if it isn't connected
      serverSelectionTimeoutMS: 5000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("-- conn");
    // console.log(conn)
    // mongoose.set("debug", (collectionName, method, query, doc) => {
    //   console.log(
    //     `--> ${collectionName}.${method}`,
    //     JSON.stringify(query),
    //     doc
    //   );
    // });
   const db = { conn };
    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    // await conn.asPromise();
    // conn.model('Test', new mongoose.Schema({ name: String }));
    const eventsSchema = new mongoose.Schema(
      {
        //Define your Schema her e
        broadcastStreamUrl: String,
        secret: String,
        playbackUrl: String,
        eventDateTime: Number,
        duration: Number,
        author: String,
        eventName: String,
        chatRoomId: String,
        chatRegion: String,
      },
      {
        capped: { size: 1024 },
        bufferCommands: false,
        autoCreate: false, // disable `autoCreate` since `bufferCommands` is false
      }
    );
  
    console.log("--- eventsSchema");
  
    db.events = mongoose.model("events", eventsSchema);
    await db.events.createCollection();
    return db;
  } 

module.exports = {connectDB}