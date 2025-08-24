import mongoose from "mongoose";


const eventSchema = new mongoose.Schema(
{
titre: { type: String, required: true, trim: true },
description: { type: String, trim: true },
lieu: { type: String, trim: true },
dateDebut: { type: Date, required: true },
dateFin: { type: Date },
participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
},
{ timestamps: true }
);


// Index
eventSchema.index({ dateDebut: 1 });


const Event = mongoose.model("Event", eventSchema);


export default Event;