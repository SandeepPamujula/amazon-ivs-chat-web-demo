const AWS = require("aws-sdk");

const REGION = "ap-south-1";
const Ivs = new AWS.IVS({
  apiVersion: "2020-07-14",
  region: REGION, // Must be in one of the supported regions
});
// const putMetadata = async (body) => {
exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
    },
    body: "",
  };

  const input = {
    channelArn: body.channelArn,
    metadata: JSON.stringify(body.metadata),
  };
  let output = { "offline": true };
  try {
    output = await Ivs.putMetadata(input).promise();
    console.log("---- output")
    console.log(output);
    output = { "offline": false };
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    output = { "offline": true };
    // if (e.name === "ChannelNotBroadcasting") {
      
    // } else {
    //   throw new Error(e);
    // }
  }
  response.body = JSON.stringify(output);
  return response;
};

// const body = {
//     channelArn: "",
//     metadata : {
//         question: "National animal of india",
//         options: {
//             A: "Tiger",
//             B: "Lion",
//             C: "Elephant",
//             D: "Cow"
//         }

//     }
// }
// async function test() {

// await putMetadata(body)
// }
// test();
