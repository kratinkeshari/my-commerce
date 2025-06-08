// /app/api/chatbot/route.js
import dbConnect from "./config/database";
import Chatbotschema from "./models/chatbotschema";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const { name, email, phone, query } = body;

    if (!name || !email || !phone || !query) {
      return new Response(JSON.stringify({ message: "Missing fields" }), {
        status: 400,
      });
    }

    const chatbotEntry = new Chatbotschema({
      name,
      email,
      PhoneNumber: phone,
      querystring: query,
    });

    await chatbotEntry.save();

    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error saving chatbot data:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}