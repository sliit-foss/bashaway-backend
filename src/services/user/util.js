import { APPLICATION } from '@/constants';
import { sendMail } from '../email';

export const sendAdminPasswordEmail = (email, password) => {
  const replacements = {
    header: `Welcome To ${APPLICATION}!`,
    text: `Congratulations on being added as an admin to the ${APPLICATION} admin portal. To login to the system you
      can use the following password -`,
    highlight_text: password,
    action_link: `${process.env.ADMIN_FRONTEND_DOMAIN || 'https://admin.bashaway.sliitfoss.org'}/login`,
    action_text: 'Login',
    disclaimer_text: `You've received this email because you have been chosen as a member of ${APPLICATION} 2023.`
  };
  const subject = `${APPLICATION} - Admin Account Password`;
  return sendMail(email, 'call_to_action', replacements, subject);
};
