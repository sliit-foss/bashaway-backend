import { APPLICATION } from '@/constants';
import { isFromAdmin } from '@/utils';
import { sendMail } from '../email';

export const sendVerificationMail = async (email, verification_code) => {
  const replacements = {
    header: `Welcome To ${APPLICATION}!`,
    text: `We are excited to have you here. To get started, you need to confirm your account. Just press the
    button below.`,
    action_link: `${process.env.APP_DOMAIN}/api/auth/verify/${verification_code}`,
    action_text: 'Confirm',
    disclaimer_text: `You've received this email because you have opted to participate in ${APPLICATION} 2023.`
  };
  const subject = `${APPLICATION} - Account Verification`;
  await sendMail(email, 'call_to_action', replacements, subject);
  return true;
};

export const sendResetPasswordEmail = async (email, verification_code) => {
  const replacements = {
    header: 'Hello!',
    text: `We’ve received your request to change your password. Use the link below to set up a new password for
    your account. This link is only usable once! If you need to, you can reinitiate the process
    at the login page.`,
    action_link: `${
      isFromAdmin() ? process.env.ADMIN_FRONTEND_DOMAIN : process.env.FRONTEND_DOMAIN
    }/reset-password/${verification_code}`,
    action_text: 'Reset Password',
    disclaimer_text: `You've received this email because you have opted to participate in ${APPLICATION} 2023.`
  };
  const subject = `${APPLICATION} - Reset Account Password`;
  await sendMail(email, 'call_to_action', replacements, subject);
  return true;
};
