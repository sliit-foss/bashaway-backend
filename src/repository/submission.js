import express from "express";
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

import submission from "../models/submission"

export const insertSubmission = async (user, question, link) => {
    const newSubmission = new submission({ user, question, link });

    await newSubmission.save();
}

export const getAllSubmissions = async (filters, pageNum, pageSize) => {
    const options = {
        page: pageNum,
        limit: pageSize,
        collation: {
            locale: 'en',
        },
    };

    var result = await submission.paginate(filters, options, function (error, result) {
        if(error === null) {
            return result
        }
        else {
            console.log(error);
            throw "An error occurred when retrieving submissions"
        }   
    });
    return result
}