import axios from "axios";
import moment from "moment";

export const getAccessToken = async () => {
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}` 
  ).toString("base64");

  const res = await axios.get(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  return res.data.access_token;
};

export const stkPush = async ({
  phone,
  amount,
  accountReference,
  transactionDesc,
}: {
  phone: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}) => {
  const token = await getAccessToken();

  const timestamp = moment().format("YYYYMMDDHHmmss");
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;

  const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: shortcode,
    PhoneNumber: phone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc,
  };

  const res = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
