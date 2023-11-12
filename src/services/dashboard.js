import { getTicketStats } from '@/repository/ticket';
import { getAllUserGroups } from '@/repository/user';

export const getRegistrations = async () => {
  const userGroups = await getAllUserGroups();
  return {
    domain_counts: userGroups,
    total_registrations: userGroups.reduce((acc, curr) => acc + curr.count, 0)
  };
};

export const getTicketInfo = (eventId) => getTicketStats(eventId);
