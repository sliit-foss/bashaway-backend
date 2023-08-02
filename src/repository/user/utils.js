export const computeScore = [
  {
    $lookup: {
      from: 'submissions',
      localField: '_id',
      foreignField: 'user',
      as: 'submissions',
      pipeline: [
        {
          $group: {
            _id: '$question',
            score: {
              $max: { $ifNull: ['$score', 0] }
            }
          }
        }
      ]
    }
  },
  {
    $addFields: {
      score: { $sum: '$submissions.score' }
    }
  },
  {
    $unset: ['submissions']
  }
];
