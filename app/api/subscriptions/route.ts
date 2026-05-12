import { NextResponse } from "next/server";
import axios from "axios";

const AZURE_URL =
  "https://app-selfserviceportalbackend-dev.azurewebsites.net/api/subscriptions";

export async function GET() {
  try {
    const response = await axios.get(AZURE_URL, {
      params: {
        customerId: "6EE8E49E-C9BE-4AA0-88F3-5C7B635328F6",
        system: "Classic",
      },
      headers: { accept: "*/*" },
    });
    return NextResponse.json(response.data);
  } catch (err) {
    console.error("Fel vid anrop till Azure:", err);
    return NextResponse.json(
      { error: "Kunde inte hämta subscriptions" },
      { status: 500 },
    );
  }
}
