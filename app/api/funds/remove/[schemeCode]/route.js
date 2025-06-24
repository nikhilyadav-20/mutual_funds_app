import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import SavedFund from "@/models/SavedFund"

export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    const { schemeCode } = params

    await connectDB()

    const deletedFund = await SavedFund.findOneAndDelete({
      userId: decoded.userId,
      schemeCode,
    })

    if (!deletedFund) {
      return NextResponse.json({ message: "Saved fund not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Fund removed successfully",
    })
  } catch (error) {
    console.error("Remove fund error:", error)
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
