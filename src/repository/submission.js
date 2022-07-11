import express from "express";
import mongoose from "mongoose";

import submission from "../models/submission"

export const insertSubmission = async (user, question, link) => {
    const newSubmission = new submission({ user, question, link });

    await newSubmission.save();
}