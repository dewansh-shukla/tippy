import automationContext from "@/lib/automationContext";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    console.log("Address", address as `0x${string}`);
    const response = await automationContext.fetchSubscriptionsByRegistryID(
      address as `0x${string}`,
      process.env.EXECUTOR_REGISTRY_ID as string
    );
    const account = response;
    
    return NextResponse.json({
      account: account,
    });
  } catch (error) {
    console.error("Error checking account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
