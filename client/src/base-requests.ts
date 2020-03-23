const BASE_URL = `http://138.197.220.137/backend`;
// const BASE_URL = `http://localhost:36322`;

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
