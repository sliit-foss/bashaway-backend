import { getLeaderboardSettings } from '@/repository/settings';
import { getLeaderboardData } from '@/repository/user';
import { faker } from '@faker-js/faker';

export const getLeaderboardRankings = async () => {
  const { freezed, freeze_at: freezeAt, freeze_vanguard: freezeVanguard } = await getLeaderboardSettings();
  const records = await getLeaderboardData();
  if (freezed) {
    const freezeDate = new Date(freezeAt);
    const names = new Set();
    for (let i = 0; i < records.length; i++) {
      if (i >= freezeVanguard) {
        break;
      }
      if (new Date() > freezeDate) {
        let element = faker.science.chemicalElement();
        while (names.has(element.name)) {
          element = faker.science.chemicalElement();
          names.add(element.name);
        }
        records[i].score = '????';
        records[i].name = element.name;
        records[i].university = element.symbol.toUpperCase();
        records[i].email = `${element.name.toLowerCase()}@bashaway.io`;
      }
    }
  }
  return records;
};
