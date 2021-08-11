import React from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { db } from "../firebase";
import {SPREADSHEET_ID} from "../evir"
const Sheets = () => {
  // Config variables
  
  //   const SHEET_ID = "Sheet2";
  const CLIENT_EMAIL = "forsheet@interasiastock.iam.gserviceaccount.com";
  const PRIVATE_KEY =
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCQIHmUGgsCRpd8\nfogTI+6uGuK/6c3Vr8qf8IdUQ710zRzW9YpDqIkeo/0A6UEF9hd1R9SjO315YloI\naE//X4XwF4fVDsPPNe2QIsdYCkpc7FXo6kVVAK+gTtsFPWV0BZx7/rmzl3KvRXxZ\n5SLtFFKP4GePrvwXpB88BgJEKDY6yE05AcbGxVUqZ/AQV1+BLsZpFS8wN2P+cDBu\nvTluZlfv6zHamzL0Q25y7qb/Yc8MZJ9nicXnPZgrrZYSdI/0AGwta9E/3i63Bv01\nFoiW5y0IqRZgVC3rEI4nrC+3JrjrwhLAZ5mikyUcJlDy+WNo/3hJvuM59FZNBivF\nneb83CP5AgMBAAECggEAHcESkGxy9uCPcBRoL7lkkj17L98LDzEoPe4oZhFJCNa6\nfDc7ON4PlsuIlRpSgfJM4/m1EJDcxcUz7JXqZAB6tHcLJAVVD89kkLPZXxfaw8XH\ns5q/vv1yBICbD0EeU35AEMok2MpskvofoqhfFj4ykEDl6GAZ66CGkTv1VlBN58L4\nca6ntBn36ki1gZtDN+pQW984PJd6+DhloEdtqQW4So12jmcG+axxz5j0ZRZ7act7\n672XO9TveIYDGEmGe2AP/3ijuvpDJV/1LbmzMFYrwaXYdWa2tl0A1AwfR6xtqfP2\ne3/iXesS2DerczkS840ZFGhR1AYuFZvevvWvChN7TQKBgQDGhueyGetPoKzPgS3O\nIHdo3Lu8prgPXk/Dd3wVUJxi9T+j8GyLZEel1rqOc3dM6XXK5vGitvCyXq+QH7wC\nvtr+0dq6wRfdtfhRHLJvB5uObttYRoo6LLlLszXjnp6mRzqQzNwAKTYNC8No7jwo\n/If2iY/cGtGOKQjV1eoBGOguXQKBgQC52efWZoSexGE7QrhYqaSYVnvaipmk55XZ\nZUL8r3TfHX/W5YpMGkpAG0wfDf4cWo3OpYwb1teYImwP9hYsdKGFHNmAHveMFoHg\nytIjWc7AaWuKCMGoYO/KLRxmnisid8TH161DUeBHlYB9xKcC6AWR6MzTo8ru24Rs\nDcUbXwfaTQKBgHoRr1uSll7C1B9PNcP9sI6Y0xLfjGNewTrWOES+6TnrxLLf/U4E\nXg25p8I5e0yebGBTepZrWDrE/7xl1uv1QKDYll6opi0cW9A8Dfc5PUvqHBL+ZLX6\nlADY87S+7pwdRgSNAmVS8bo51nCps/IbvNo5oWxcTSfVUWpyes0r7G+9AoGAKrI0\n4LyMmyziaYrabwQKHDVCHuLYiVnqwxbQXNyyLM/KHsR9ER65ECE1S60bQ8hJ6798\ngKjKvtipmsEeNvhUYxBNp3F1zWkeTVZLEHQBW5LcccmxM82RSRE0BR8xKan6Oy8B\nTwXwUIG4EyyqcbB8Fxk0dSqb5GPp+Cjxr2gVlcECgYEAxZWGVJUzFwCYH70W1wWh\njUbU50Od6s6oUqzs00Ko3cZyrG48DQ8eU+uU14PetzEhcciOouz0pR/2fZ+JYEtT\nZrC4/uX99BQyYXTM8+1FLsKSQaOoxCWbM3S98dap40h8lH4+FIiDY7+b4UIMH4gk\nw9tIuN0h53w0KJq+bTeUNy8=\n-----END PRIVATE KEY-----\n";

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

  const saveShippingFee = async z => {
    await db.collection("shippingFee").doc("dhl").set({
      z,
    });
  };

  //  dhl 존
  let zones = [];
  const readSheets = async () => {
    try {
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
      // loads document properties and worksheets
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[4];

      // 행으로 가져오기
      const rows = await sheet.getRows();
      for (let i = 1; i < 10; i++) {
        let countries = rows
          .slice(0, 13)
          .map(row => row[`zone${i}`])
          .filter(Boolean);
        let fees = rows
          .slice(13)
          .map(row => row[`zone${i}`])
          .filter(Boolean);
        zones.push({ [`zone${i}`]: { country: countries, fee: fees } });
      }
      saveShippingFee(zones);
    } catch (e) {
      console.error("Error: ", e);
    }
  };
  return (
    <>
      <div onClick={readSheets}> dhl 배송료 수집하기</div>
    </>
  );
};

export default Sheets;
