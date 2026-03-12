import express from "express";

const app = express();
app.use(express.json());

const DATASET_ID = process.env.META_DATASET_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

app.post("/send-event", async (req, res) => {

  const call = req.body;

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "phone_call",
        event_id: call.call_id,
        user_data: {
          fbc: call.fbc,
          fbp: call.fbp,
          client_ip_address: call.ip,
          client_user_agent: call.user_agent
        },
        custom_data: {
          currency: "USD",
          value: call.value
        }
      }
    ]
  };

  const url =
    `https://graph.facebook.com/v19.0/${DATASET_ID}/events?access_token=${ACCESS_TOKEN}`;

  const response = await fetch(url,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(payload)
  });

  const result = await response.json();
  res.json(result);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});