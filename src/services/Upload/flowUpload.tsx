import * as React from "react";
import * as Flow from "@flowjs/flow.js";
import {UploadState , UPLOAD_STATUS} from "./index";
import {IFlow} from "flowjs";
import {BASE_PATH} from "../../api/api";
import AAA from "../AAA";

interface IFlowFile {
    flowObj: IFlow;
    file: File;
    name: string;
    relativePath?: string;
    size?: number;
    uniqueIdentifier?: string;
    averageSpeed?: number;
    currentSpeed?: number;
    chunks?: any[];
    paused?: boolean;
    error?: boolean;
}
interface IFlowOptions {
    target?: string;
    singleFile?: boolean;
    chunkSize?: number;
    forceChunkSize?: boolean;
    simultaneousUploads?: number;
    fileParameterName?: string;
    query?: Object;
    headers?: Object;
    withCredentials?: boolean;
    method?: string;
    testMethod?: string | boolean;
    uploadMethod?: string;
    allowDuplicateUploads?: boolean;
    prioritizeFirstAndLastChunk?: boolean;
    testChunks?: boolean;
    preprocess?: Function;
    initFileFn?: Function;
    generateUniqueIdentifier?: Function;
    maxChunkRetries?: number;
    chunkRetryInterval?: number;
    progressCallbacksInterval?: number;
    speedSmoothingFactor?: number;
    successStatuses?: string[];
    permanentErrors?: string[];
}

export default class FlowUpload {
    private file;
    private fileName;
    private module;
    private flowFile: any;
    private flowOption: IFlowOptions;
    /**
     * @constructor set file and module
     * @param {string} module
     * @param {file} file
     * @param {string} fileName
     */
    constructor(module: string, file: any, fileName?: string) {
        this.file = file;
        this.module = module;
        this.fileName = fileName || null;
        this.flowOption = {target: `${BASE_PATH}/upload/video` , headers: {token: AAA.getInstance().getToken() }, chunkSize: 250000, testMethod: false },
        this.flowFile = new Flow(this.flowOption);
        console.log(this);
        this.flowFile.addFile(file);
        this.flowFile.files[0].name = "file.mp4";
    }
    /**
     * @func upload
     * @desc upload file and set listeners and headers
     *
     * @param {(state: UploadState) => void} progressCallback
     * @returns {Promise<UploadState>}
     */
    public upload(progressCallback?: (state: UploadState) => void): Promise<UploadState> {
        return new Promise((resolve, reject) => {
            this.flowFile.on("fileSuccess", function (file, message) {
                resolve({
                    progress: 100,
                    status: UPLOAD_STATUS.FINISHED
                });
                console.log("message", message);
            });
            this.flowFile.on("fileError", function () {
                reject({
                    progress: 0,
                    status: UPLOAD_STATUS.FAILED
                });
            });
            this.flowFile.on("progress",  () => {
               if (progressCallback) {
                   progressCallback({
                       progress: this.flowFile.progress() * 100,
                       status: UPLOAD_STATUS.UPLOADING
                   });
               }
            });
            console.log(this);
            this.flowFile.upload();
        });
    }

    /**
     * @func abort
     * @desc cancel on progress upload
     */
    public abort() {
        this.flowFile.cancel();
    }
}
