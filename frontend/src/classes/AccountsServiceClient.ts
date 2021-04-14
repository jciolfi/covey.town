import assert from 'assert';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export type JoinedTown = {
  townID: string,
  locationX: number,
  locationY: number,
};

/**
 * Payload sent by client to save a user in Covey.Town
 */
export interface SaveUserRequest {
  userID: string;
  email?: string;
  username?: string;
  useAudio?: boolean;
  useVideo?: boolean;
  towns?: JoinedTown[];
}

/**
 * Payload sent by client to request information for a user's email
 */
export interface GetUserRequest {
  userID: string;
}


/**
 * export type UserInfo = {
  userID: string,
  email: string,
  username: string,
  useAudio: boolean,
  useVideo: boolean,
  towns: JoinedTownInfo[],
};
 */

/**
 * Response from the server for a get user request
 */
export interface GetUserResponse {
  userID: string;
  email: string;
  username: string;
  useAudio: boolean;
  useVideo: boolean;
  towns: JoinedTown[];
}

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
  isOK: boolean;
  message?: string;
  response?: T;
}

export default class AccountsServiceClient {
  private _axios: AxiosInstance;

  /**
   * Construct a new Towns Service API client. Specify a serviceURL for testing, or otherwise
   * defaults to the URL at the environmental variable REACT_APP_ROOMS_SERVICE_URL
   * @param serviceURL
   */
  constructor(serviceURL?: string) {
    const baseURL = serviceURL || process.env.REACT_APP_TOWNS_SERVICE_URL;
    assert(baseURL);
    this._axios = axios.create({ baseURL });
  }

  static unwrapOrThrowError<T>(
    response: AxiosResponse<ResponseEnvelope<T>>,
    ignoreResponse = false,
  ): T {
    if (response.data.isOK) {
      if (ignoreResponse) {
        return {} as T;
      }
      assert(response.data.response);
      return response.data.response;
    }
    throw new Error(`Error processing request: ${response.data.message}`);
  }

  async saveUser(requestData: SaveUserRequest): Promise<boolean> {
    const responseWrapper = await this._axios.post<ResponseEnvelope<boolean>>(
      '/user',
      requestData,
    );
    return AccountsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async getUser(requestData: GetUserRequest): Promise<GetUserResponse> {
    const responseWrapper = await this._axios.get<ResponseEnvelope<GetUserResponse>>(
      `/user/${requestData.userID}`,
    );
    return AccountsServiceClient.unwrapOrThrowError(responseWrapper, true);
  }
}
