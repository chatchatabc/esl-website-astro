import type { Bindings } from "src/server";

export async function messageSend(
  params: { body: string; to: string },
  bindings: Bindings
) {
  const endpoint = "https://rest.nexmo.com/sms/json";

  let encoded = new URLSearchParams();
  encoded.append("from", "Vonage APIs");
  encoded.append("text", params.body);
  encoded.append("to", params.to);
  encoded.append("api_key", bindings.NEXMO_API_KEY);
  encoded.append("api_secret", bindings.NEXMO_API_SECRET);

  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encoded,
  };

  try {
    const response = await fetch(endpoint, request);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}
