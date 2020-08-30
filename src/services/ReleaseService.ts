import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {IReleaseDetailDto} from "./interfaces/IReleaseDetailDto";
import {Config} from "./Config";

import * as sprintf from "sprintf";

@Injectable()
export class ReleaseService {
    private static readonly ALL_RELEASES_ENDPOINT = "/record-collection-service/releases";
    private static readonly RELEASES_BY_MASTER_RELEASE_ENDPOINT = "/record-collection-service/master-releases/%s/releases";
    private static readonly RELEASE_DETAIL_ENDPOINT = "/record-collection-service/releases/%s"
    
    private serviceHost: String;
        
    public constructor(
        @Inject(Config) private config: Config,
        @Inject(HttpClient) private httpClient: HttpClient
    ) {
        this.serviceHost = this.config.getServiceHost();
    }
    
    public getAllReleases(): Promise<any> {
        const endpoint = sprintf.sprintf(this.serviceHost + ReleaseService.ALL_RELEASES_ENDPOINT);
        
        return new Promise<any>((resolve, reject) => {
            this.httpClient.get(endpoint).subscribe((data: any) => {
                resolve(data);
            }, (error) => {
                reject();
            })
        })
    }
    
    public getReleasesForMasterRelease(masterReleaseId: number): Promise<any> {
        const endpoint = sprintf.sprintf(this.serviceHost + ReleaseService.RELEASES_BY_MASTER_RELEASE_ENDPOINT, masterReleaseId);
        
        return new Promise<any>((resolve, reject) => {
            this.httpClient.get(endpoint).subscribe((data: any) => {
                resolve(data);
            }, (error) => {
                reject();
            });
        });
    }
    
    public getRelease(releaseId: number): Promise<IReleaseDetailDto> {
        const endpoint = sprintf.sprintf(this.serviceHost + ReleaseService.RELEASE_DETAIL_ENDPOINT, releaseId);
        
        return new Promise<IReleaseDetailDto>((resolve, reject) => {
            this.httpClient.get(endpoint).subscribe((data: IReleaseDetailDto) => {                
                resolve(data);
            }, (error) => {
                reject();
            });
        });
    }
}
