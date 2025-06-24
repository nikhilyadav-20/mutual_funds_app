import mongoose from "mongoose"

const SavedFundSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schemeCode: {
      type: String,
      required: true,
    },
    schemeName: {
      type: String,
      required: true,
    },
    fundHouse: {
      type: String,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Create compound index to prevent duplicate saves
SavedFundSchema.index({ userId: 1, schemeCode: 1 }, { unique: true })

export default mongoose.models.SavedFund || mongoose.model("SavedFund", SavedFundSchema)
