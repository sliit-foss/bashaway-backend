import mongoose from 'mongoose';

export const transaction = async (queries) => {
  let result;
  let success = true;
  const session = await mongoose.connection.startSession();
  try {
    session.startTransaction();
    result = await Promise.all(
      queries.map((query) => {
        query = query.session(session);
        return query;
      })
    );
    await session.commitTransaction();
  } catch (error) {
    success = false;
    await session.abortTransaction();
  }
  await session.endSession();
  return [result, success];
};
