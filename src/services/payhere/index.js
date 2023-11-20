import serviceConnector from '@sliit-foss/service-connector';
import { PAYHERE } from '@/config';

export * from './util';

const tokenUrlPath = `/merchant/v1/oauth/token`;

const connector = serviceConnector({
  baseURL: PAYHERE.BASE_URL,
  service: 'Payhere',
  headerIntercepts: async ({ url }) => {
    if (url !== tokenUrlPath) {
      const accessToken = await getAccessToken();
      return {
        Authorization: `Bearer ${accessToken}`
      };
    }
  }
});

const getAccessToken = () => {
  return connector
    .post(
      tokenUrlPath,
      { grant_type: 'client_credentials' },
      {
        headers: {
          'Authorization': `Basic ${PAYHERE.AUTHORIZATION_CODE}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    .then((res) => res.data.access_token);
};

export const retrievePaymentDetails = (reference) => {
  return connector.get(`/merchant/v1/payment/search?order_id=${reference}`).then((res) => res.data);
};
