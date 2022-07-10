import express from "express";
import mongoose from "mongoose";

import submission from "../models/submission"

export const insertSubmission = async (group, question, link) => {
    const newSubmission = new submission({ group, question, link });

    await newSubmission.save();
}