module.exports = {
  async up(db) {
    await db.collection('users').updateMany({}, { $unset: { score: '' } });
  },

  async down(db) {
    await db.collection('users').updateMany({ role: 'ATTENDEE' }, { $set: { score: 0 } });
  }
};
