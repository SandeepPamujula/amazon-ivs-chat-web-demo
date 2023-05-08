const AWS = require("aws-sdk");

const REGION = "ap-south-1";
const ivs = new AWS.IVS({
  apiVersion: "2020-07-14",
  region: REGION, // Must be in one of the supported regions
});
const IVSChat = new AWS.Ivschat({
  apiVersion: "2020-07-14",
  region: REGION
});

const {connectDB} = require("./common-channel");
let db = null;

const response = {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST"
  },
  body: ""
};

exports.handler = async (event, context) => {
// const handler = async function (event, context) {
  console.log("--- handler");
  // console.info(body);

  // Make sure to add this so you can re-use `conn` between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  context.callbackWaitsForEmptyEventLoop = false;

  // Because `conn` is in the global scope, Lambda may retain it between
  // function calls thanks to `callbackWaitsForEmptyEventLoop`.
  // This means your Lambda function doesn't have to go through the
  // potentially expensive process of connecting to MongoDB every time.
  if (db == null) {
    db = await connectDB();
  }
  const body = JSON.parse(event.body);
  const name = body.name.replace(/ /g, "-");
  console.log("-- >name :: ", name)
  body.name = name;
  const result = await createChannel(body);
  
  const chatResp = await createChatRoom(name);
  const doc = await db.events.create({
    broadcastStreamUrl: `rtmps://${result.channel.ingestEndpoint}:443/app/`,
    secret: `${result.streamKey.value}`,
    playbackUrl: `${result.channel.playbackUrl}`,
    eventDateTime: body.eventTime,
    duration: body.duration,
    author: body.author,
    eventName: body.name,
    channelName: `${result.channel.name}`,
    channelArn: `${result.channel.arn}`,
    chatRoomId: chatResp.arn,
    //"arn:aws:ivschat:ap-south-1:198839483732:room/9aLQxLWRJiMr",
    // chatToken: 'dfasdadf',
     chatRegion: REGION
  });
  // console.log(doc);
  const list = await db.events.find();
  console.log(list);
  // const list = await db.events.find({broadcastStreamUrl: /live/i}).exec();
  response.body = JSON.stringify(doc);
  return response;
};

// async function test() {
//   console.log("--- test");
//   await handler({body: {
//     latencyMode: "NORMAL",
//     name: "ivs-channel-2",
//     tags:  {},
//     type: "BASIC",
//   }}, {});
// }
// test();
const createChatRoom = async (eventName) => {
  const params = {
    // loggingConfigurationIdentifiers: [
    //   'STRING_VALUE',
    //   /* more items */
    // ],
    // maximumMessageLength: 'NUMBER_VALUE',
    // maximumMessageRatePerSecond: 'NUMBER_VALUE',
    // messageReviewHandler: {
    //   fallbackResult: ALLOW | DENY,
    //   uri: 'STRING_VALUE'
    // },
    name: `chat-${eventName}`,
    tags: {
      'eventName': `${eventName}`,
    }
  }
  try {
    const chatResp = await IVSChat.createRoom(params).promise();
    console.info("_createChatRoom > chatResp:", chatResp);
    return chatResp;
  } catch (err) {
    console.info("_createChatRoom > err:", err, err.stack);
    throw new Error(err);
  }

}
const createChannel = async (payload) => {
  const params = {
    latencyMode: payload.latencyMode || "NORMAL",
    name: payload.name,
    tags: payload.tags || {},
    type: payload.type || "BASIC",
  };

  console.log("_createChannel > params:", JSON.stringify(params, null, 2));

  try {
    const result = await ivs.createChannel(params).promise();
    console.info("_createChannel > result:", result);
    return result;
  } catch (err) {
    console.info("_createChannel > err:", err, err.stack);
    throw new Error(err);
  }
};
