/**
 * @file Upload service
 * @author Ehsan Hosseini
 * @desc Upload service provide's a upload file functionality (upload, progress and abort).
 *
 * @example:
 * const uploader = new Upload(fileObject);
 * uploader.upload((uploadState)=>{console.log(uploadState.progress)});
 * uploader.abort();
 */

import {BASE_PATH} from "../../api/api";
import AAA from "../AAA/index";

/**
 * Upload modules
 * @type {{AVATAR: string}}
 */
export const UPLOAD_MODULES = {
  AVATAR: "avatar",
};

/**
 * Upload status
 */
export enum UPLOAD_STATUS {
  PENDING,
  UPLOADING,
  FINISHED,
  FAILED,
}

/**
 * @interface UploadState
 * @desc status of upload process
 */
export interface UploadState {
  status: UPLOAD_STATUS;
  progress: number;
  url?: string;
}

/**
 * @class Upload
 */
export default class Upload {
  private request: any;
  private file;
  private module;

  /**
   * @constructor set file and module
   * @param {string} module
   * @param {file} file
   */
  constructor(module: string, file: any) {
    this.file = file;
    this.module = module;

  }

  /**
   * @func upload
   * @desc upload file and set listeners and headers
   *
   * @param {(state: UploadState) => void} progressCallback
   * @returns {Promise<UploadState>}
   */
  public upload(progressCallback: (state: UploadState) => void): Promise<UploadState> {

    return new Promise((resolve, reject) => {

      // Create form data object
      let formData = new FormData();
      formData.append("file", this.file);

      // create request object
      let request = new XMLHttpRequest();

      // set on ready callback
      request.onreadystatechange = function () {

        // check request has been finished
        if (request.readyState === 4) {
          let resp: UploadState;

          // try to parse response and handle resolve or reject promise
          try {
            const res = JSON.parse(request.response);
            resp = {
              status: res.error ? UPLOAD_STATUS.FAILED : UPLOAD_STATUS.FINISHED,
              progress: res.error ? 0 : 100,

            };
          } catch (e) {
            resp = {
              status: UPLOAD_STATUS.FAILED,
              progress: 0,
            };
          }

          if (resp.status === UPLOAD_STATUS.FAILED) {
            reject(resp);
          } else {
            resolve(resp);
          }

        }
      };

      // add progress listener to call on progress change status
      request.upload.addEventListener("progress", (e) => {
        const progress = Math.round((e.loaded / e.total) * 100);
        progressCallback({
          status: progress === 100 ? UPLOAD_STATUS.FINISHED : UPLOAD_STATUS.UPLOADING,
          progress: progress,
          url: ""
        });
      }, false);

      // open and send request
      request.open("post", `${BASE_PATH}/upload/${this.module}`);
      request.setRequestHeader("token", AAA.getInstance().getToken());
      request.send(formData);

      // call callback with pending state
      if (progressCallback) {
        progressCallback({
          status: UPLOAD_STATUS.PENDING,
          progress: 0,
        });
      }

      this.request = request;
    });
  }

  /**
   * @func abort
   * @desc cancel on progress upload
   */
  public abort() {
    this.request.abort();
  }

}
