module.exports = {
  async up(db) {
    await db.collection('settings').updateOne(
      {},
      {
        $set: {
          leaderboard: {
            freezed: false,
            freeze_at: new Date('2023-10-07T12:00:00.000Z'),
            freeze_vanguard: 3
          }
        }
      }
    );
  },

  async down(db) {
    await db.collection('settings').updateOne(
      {},
      {
        $unset: {
          leaderboard: ''
        }
      }
    );
  }
};
