import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
{
nom: { type: String, required: true, trim: true },
prenom: { type: String, trim: true },
email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
telephone: { type: String, trim: true },
adresse: { type: String, trim: true },
entreprise: { type: String, trim: true },
},
{ timestamps: true }
);


clientSchema.index({ email: 1 }, { unique: true, sparse: true });


export const Client = mongoose.model("Client", clientSchema);