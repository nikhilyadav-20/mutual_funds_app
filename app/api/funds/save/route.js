import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import SavedFund from "@/models/SavedFund"

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    const { schemeCode, schemeName, fundHouse } = await request.json()

    if (!schemeCode || !schemeName) {
      return NextResponse.json({ message: "Scheme code and name are required" }, { status: 400 })
    }

    await connectDB()

    // Check if fund is already saved
    const existingSavedFund = await SavedFund.findOne({
      userId: decoded.userId,
      schemeCode,
    })

    if (existingSavedFund) {
      return NextResponse.json({ message: "Fund already saved" }, { status: 400 })
    }

    // Save the fund
    const savedFund = await SavedFund.create({
      userId: decoded.userId,
      schemeCode,
      schemeName,
      fundHouse,
    })

    return NextResponse.json({
      message: "Fund saved successfully",
      savedFund,
    })
  } catch (error) {
    console.error("Save fund error:", error)
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
