import { FRONTEND_DOMAIN } from '@/config';
import { APPLICATION } from '@/constants';
import { sendMail } from '../email';

export const sendCouponEmail = async (email, name, couponCode, discountPercentage, event) => {
  const replacements = {
    header: `Hello ${name}!`,
    text: `You've won a ${discountPercentage}% discount coupon for ${event.name}!. Please use the following coupon code to claim your discount: ${couponCode}`,
    action_link: `${FRONTEND_DOMAIN}/events/${event._id}/checkout`,
    action_text: 'Purchase Ticket',
    disclaimer_text: `You've received this email because you have solved a challenge within the ${APPLICATION} platform.`
  };
  const subject = `${APPLICATION} - You've won a ${discountPercentage}% discount coupon!`;
  await sendMail(email, 'call_to_action', replacements, subject);
  return true;
};
