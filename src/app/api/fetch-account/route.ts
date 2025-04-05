import automationContext from "@/lib/automationContext";
import { NextRequest, NextResponse } from "next/server";

const accounts = [
  "0x123456789abcdef0123456789abcdef01234567",
  "0xabcdef0123456789abcdef0123456789abcdef01",
  "0x0123456789abcdef0123456789abcdef0123456",
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    console.log("Address", address as `0x${string}`);
    const response = await automationContext.fetchSubscriptionsByRegistryID(
      address as `0x${string}`,
      process.env.EXECUTOR_REGISTRY_ID as string
    );

    console.log(response);
    if (!address) {
      return NextResponse.json(
        { error: "Address parameter is required" },
        { status: 400 }
      );
    }
    const accountExists = accounts.includes(address.toLowerCase());

    return NextResponse.json({
      address,
      exists: accountExists,
    });
  } catch (error) {
    console.error("Error checking account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
