module.exports = {
  async up(db) {
    await db.collection('events').updateMany({}, { $rename: { capacity: 'seats' } });
  },

  async down(db) {
    await db.collection('events').updateMany({}, { $rename: { seats: 'capacity' } });
  }
};
