module.exports = {
  async up(db) {
    await db.collection('settings').updateOne(
      {},
      {
        $set: {
          round_breakpoint: new Date('2023-10-07T13:30:00.000Z')
        }
      }
    );
  },

  async down(db) {
    await db.collection('settings').updateOne(
      {},
      {
        $unset: {
          round_breakpoint: ''
        }
      }
    );
  }
};
