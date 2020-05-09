import request from "request";

export const BASE_URL = `https://planshare.io/backend`;

export const SOCKET_URL = "https://planshare.io/";

export const SOCKET_IO_PATH = "/socket";

type GetRequestParams = {
  [key: string]: string;
};

export const baseGetRequest = (
  path: string,
  params: GetRequestParams[],
  responseHandler: (data: any) => void,
  errorHandler: (error: any) => void,
  authKey?: string | null | undefined
) => {
  let url = `${BASE_URL}/${path}?`;
  for (let i = 0; i < params.length; i++) {
    if (i > 0) {
      url += "&";
    }
    const key = Object.keys(params[i])[0];
    const value = params[i][key];
    url += `${key}=${value}`;
  }

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authKey}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(responseHandler)
    .catch(errorHandler);
};

export const basePostRequest = (
  path: string,
  data: any,
  responseHandler: (data: any) => void,
  errorHandler: (error: any) => void,
  authKey?: string | null | undefined
) => {
  fetch(`${BASE_URL}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authKey}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(responseHandler)
    .catch(errorHandler);
};

const SLACK_URL =
  "https://hooks.slack.com/services/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";

export const slackPostRequest = (data: any) => {
  request.post(
    {
      url: SLACK_URL,
      body: JSON.stringify(data)
    },
    function(err: any, data: any) {
      console.log(data.body);
    }
  );
};
