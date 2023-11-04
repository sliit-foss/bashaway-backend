module.exports = {
  async up(db) {
    await db.collection('settings').deleteMany({});
    await db.collection('settings').insertOne({
      leaderboard: {
        freezed: false,
        freeze_at: new Date('2023-10-07T12:00:00.000Z'),
        freeze_vanguard: 3
      },
      created_at: new Date(),
      updated_at: new Date(),
      __v: 0
    });
  },

  async down(db) {
    await db.collection('settings').deleteMany({});
  }
};
