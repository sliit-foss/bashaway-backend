module.exports = {
  async up(db) {
    await db.collection('users').updateMany({}, { $unset: { score: '' } });
  },

  async down(db) {
    await db.collection('users').updateMany({ role: 'GROUP' }, { $set: { score: 0 } });
  }
};
