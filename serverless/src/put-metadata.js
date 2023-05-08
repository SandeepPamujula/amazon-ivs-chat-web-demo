const AWS = require("aws-sdk");

const REGION = "ap-south-1";
const Ivs = new AWS.IVS({
  apiVersion: "2020-07-14",
  region: REGION, // Must be in one of the supported regions
});
// const putMetadata = async (body) => {
exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);

  const input = {
    channelArn: body.channelArn,
    metadata: JSON.stringify(body.metadata),
  };
  let output;
  try {
    output = await Ivs.putMetadata(input).promise();
  } catch (e) {
    console.error(e);
    if (e.name === "ChannelNotBroadcasting") {
      output = { offline: true };
    } else {
      throw new Error(e);
    }
  }
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
    },
    body: output,
  };
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
