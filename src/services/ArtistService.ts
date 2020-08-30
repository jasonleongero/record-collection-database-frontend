import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import * as sprintf from "sprintf";

import {IArtistDetailDto} from "./interfaces/IArtistDetailDto";
import {Config} from "./Config";

@Injectable()
export class ArtistService {
    private static readonly ARTISTS_ENDPOINT = "/record-collection-service/artists";
    private static readonly ARTIST_DETAIL_ENDPOINT = "/record-collection-service/artists/%s"
    
    private serviceHost: String;
        
    public constructor(
        @Inject(Config) private config: Config,
        @Inject(HttpClient) private httpClient: HttpClient
    ) {
        this.serviceHost = this.config.getServiceHost();
    }
    
    public getArtists(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.httpClient.get(this.serviceHost + ArtistService.ARTISTS_ENDPOINT).subscribe((data: any) => {
                resolve(data);
            }, (error) => {
                reject();
            });
        });
    }
    
    public getArtist(artistId: number): Promise<IArtistDetailDto> {
        const endpoint = sprintf.sprintf(this.serviceHost + ArtistService.ARTIST_DETAIL_ENDPOINT, artistId);
        
        return new Promise<any>((resolve, reject) => {
            this.httpClient.get(endpoint).subscribe((data: any) => {
                resolve(data);
            }, (error) => {
                reject();
            });
        });
    }
}
