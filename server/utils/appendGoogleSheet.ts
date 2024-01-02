import { sheets, auth } from '@googleapis/sheets';

const SERVICE_ACCOUNT_EMAIL = 'monitoring@planshare-io.iam.gserviceaccount.com';

const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCVwnaBqi/5DxJm\n+uCg4zQxewa8+xSdByI7QDBKNN3tdPgP29CjaBb0BQS8/hQsY275ljWJ+F5U5BUy\n5UXu3Ti1xXNfA4dMB2xxGh2Si+3NveSKpHHzzWTB+7B2136HJ2dOTlIgOa4bCH5o\nEKV04zdMrLMIihERRTW9ERkxrdWhOstyFk7LOiBVzLEl/RXj5iDKyQMq158HzzCM\n7pZtqTgv4uTlt3YnBFN8Bi7KoUZFn5ykj2EFKZmZvNF8nZbAuL/mnsN3Ktmh7Cs5\noabbFYsau81mwPC8oRXKk4Cq68Y4FM0O+UjyDPpIhlpmtK1oTbDC0r2wwIB09K11\naEql2renAgMBAAECggEAEt2skCkgYf/EEbUJFzuIF7On5aa7sgx0A4LSkoaWbpON\nrHHEltFGEveO4UAgyna8RDToCbmAKLGS+hZn+O9ldYCqSA3pvWox/w2LLCr0ijah\n09VjhZMaXlWWpWIAToZoPTUgo26gwEcRpYpzTYZSMRaQd0LtY3+UhXzh76A2iVjt\nYSyFYvUGde4WhmshFT7vr94lkJdAUpVZdX9a1aC9NM+v4qZi3+6HkZoK9KbBaNOy\nUFiXK7OBPFYO1L5w2tzMiDc5+1QKM0NOJ9kNbsv8aHGkQdVAu2xzoW7mqplxrAHv\n89+g/B+fsZhb4jrp/xpUVRQpje1oOvzia/Y6AgDEAQKBgQDOeRZoClYTZfRaqhi3\nf5I3feJjDkuk5UqT7lxDdQE7pzqfLK6oF3IW+qe9qbYt0FSkpU3cuZGS3NbCTLtF\nexBRovQd13uAc/33KhVoWXifL2kMZcLt9w9ncwN/HriNJBQ/Zl5KM/+/ObfI+aGQ\njMt1Dge6su/C/hxk1PlcvSgV+QKBgQC5rsUnwwxw0HK+CL1wPaEnWl0H1zAqczXZ\nzW4YxTJRMuyXgsMtHuhUULLjxhMX+ZmBy1Im5BGr874F6//pSzAjsLKETeLGGaqv\nvvPFNWn4L1pMTpa8zBsi/yyHs+L3a7RGiF7QPQpiNr5GLtku50gUh+DiLrc/MDyU\nwWfMadoinwKBgQCzzd8lW1r6KZ9SFS7RHddHW+j6OkjFoKgBi2HtnMcmG8uBMngn\nCcPhHwdUs6Zi3znW592WikOrkYW0Tv4G09SyQyYzlqOGiXxw8cUSylewyKjCkxvd\n/3j6rb4txaMRxombbJpQJFhjPvA9pKZ+Kx5DIaS5gXoqZQB1DsLZcCCogQKBgQCd\nGoxhmhw6j4Ol2gs+nkZt33z7F0z/fb9AaxoOBzsNjMK1ZsPwt0fnnufc5EhfbqY9\nNWRq12lETdSneghqwV0XtXc1jhijeC/8xtnGL+1bOeVyzsOnNiJ3t+NbZg5RPWWo\nj9V450yT0LGo/BZyIunPxS+278PHyO5ZBlLml2EjDQKBgFMHzz1pLtnbYTK/fW93\nMuox22UmIUIPBkWyZ/G38nj85ZEXSY7le8NIWE81DpW4AW9A1BKC1f1p3KBFn/9A\nRcfSonQT8FJz4SVLo23g6/Ld1TQmUeP72/Plp0G4CTjM08yPdifjP8MNBnBdd9hE\n7X89JWnUkjiGxvWXkWp/YIzo\n-----END PRIVATE KEY-----\n";

const SPREADSHEET_ID = '1enf6o8VMWOhtAhECjFzby_T-JoyLKwBopMVGHHCFSaE';

const googleAuth = new auth.JWT({
  email: SERVICE_ACCOUNT_EMAIL,
  key: PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const getFormattedDateForSheets = () => {
  const currentDate = new Date();

  // Format the date as 'yyyy-MM-dd HH:mm:ss'
  const formattedDate = currentDate.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Los_Angeles',
  });

  return formattedDate;
}

const appendToGoogleSheet = (values: Array<string>) => {
	const googleSheets = sheets({ version: 'v4', auth: googleAuth });

	googleSheets.spreadsheets.values.append(
		{
			spreadsheetId: SPREADSHEET_ID,
			range: 'Sheet1', // Sheet name
			valueInputOption: 'USER_ENTERED',
			requestBody: { values: [values] },
		},
		(err, response) => {
			if (err) {
				console.error(`Error appending row: ${err}`);
				return;
			}
	
			console.log(`Row appended successfully: ${response && response.data && response.data.updates && response.data.updates.updatedRange}`);
		}
	);
};

export const logToGoogleSheet = (hook: string, title: string, supportingText: string) => {
	const supporting = supportingText.split(/\n/).filter(text => text !== '```');
	appendToGoogleSheet([getFormattedDateForSheets(), hook, title, ...supporting]);
};
