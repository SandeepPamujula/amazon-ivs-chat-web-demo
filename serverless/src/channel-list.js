const { connectDB } = require("./common-channel");
let db = null;

const response = {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
  },
  body: "",
};

exports.list = async (event, context) => {
  const query = event.queryStringParameters;
  console.log("-- event");
  console.info(event);
  console.log("-- query");
  console.info(query);
  let project = {
    playbackUrl: true,
    eventDateTime: true,
    duration: true,
    author: true,
    eventName: true,
    chatRoomId: true,
    chatRegion: true,
    channelName: true,
    channelArn: true,
    _id: false,
  };
  if (query.provider == "true") {
    const providerFields = { broadcastStreamUrl: true, secret: true };
    project = { ...project, ...providerFields };
  }
  context.callbackWaitsForEmptyEventLoop = false;
  if (db == null) {
    db = await connectDB();
  }
  const result = await db.events.find({}, project);
  // response.body = JSON.stringify(result);
  const body = { events: result };
  console.log(result);
  response.body = JSON.stringify(body);

  return response;
};
