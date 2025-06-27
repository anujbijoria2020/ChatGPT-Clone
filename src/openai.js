export async function sendMsgToTogether(message) {
  const res = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer b4beee46a6b15f72f5ac4c42b3fbc91f8d746dd9195d973030dccf6546a860ee", // Replace this
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // Can be changed
      messages: [
        { role: "user", content: message }
      ],
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
}
