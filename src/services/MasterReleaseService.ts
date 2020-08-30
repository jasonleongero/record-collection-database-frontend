import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import * as sprintf from "sprintf";

import {IMasterReleaseDetailDto} from "./interfaces/IMasterReleaseDetailDto";
import {Config} from "./Config";

@Injectable()
export class MasterReleaseService {
    private static readonly MASTER_RELEASES_ENDPOINT = "/record-collection-service/artists/%s/master-releases";
    private static readonly MASTER_RELEASE_DETAIL_ENDPOINT = "/record-collection-service/master-releases/%s"
    
    private serviceHost: String;
        
    public constructor(
        @Inject(Config) private config: Config,
        @Inject(HttpClient) private httpClient: HttpClient
    ) {
        this.serviceHost = this.config.getServiceHost();
    }
    
    public getMasterReleases(artistId: number): Promise<any> {
        const endpoint = sprintf.sprintf(this.serviceHost + MasterReleaseService.MASTER_RELEASES_ENDPOINT, artistId);
        
        return new Promise<any>((resolve, reject) => {
            this.httpClient.get(endpoint).subscribe((data: any) => {
                resolve(data);
            }, (error) => {
                reject();
            });
        });
    }
    
    public getMasterRelease(masterReleaseId: number): Promise<IMasterReleaseDetailDto> {
        const endpoint = sprintf.sprintf(this.serviceHost + MasterReleaseService.MASTER_RELEASE_DETAIL_ENDPOINT, masterReleaseId);
        
        return new Promise<any>((resolve, reject) => {
            this.httpClient.get(endpoint).subscribe((data: any) => {
                resolve(data);
            }, (error) => {
                reject();
            });
        });
    }
}
