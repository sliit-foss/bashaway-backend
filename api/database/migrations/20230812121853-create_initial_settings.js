module.exports = {
  async up(db) {
    await db.collection('settings').deleteMany({});
    await db.collection('settings').insertOne({
      submission_deadline: new Date('2023-09-21T12:00:00.000Z'),
      registration_deadline: new Date('2023-09-14T12:00:00.000Z'),
      created_at: new Date(),
      updated_at: new Date(),
      __v: 0
    });
  },

  async down(db) {
    await db.collection('settings').deleteMany({});
  }
};
