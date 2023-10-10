import { getAnalyticFilters } from '@/helpers';
import { getSettingsDoc } from '@/repository/settings';
import { getLeaderboardData } from '@/repository/user';
import { faker } from '@faker-js/faker';

export const getLeaderboardRankings = async (round, ghostLegion) => {
  const {
    leaderboard: { freezed, freeze_at: freezeAt, freeze_vanguard: freezeVanguard } = {},
    round_breakpoint: roundBreakpoint
  } = await getSettingsDoc();
  const { teamFilters, submissionFilters } = getAnalyticFilters(round, ghostLegion, roundBreakpoint);
  const records = await getLeaderboardData(teamFilters, submissionFilters);
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
