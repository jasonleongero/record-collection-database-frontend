import {Component, OnInit, Inject} from "@angular/core";
import {ActivatedRoute} from '@angular/router';

import {IArtistDetailDto} from "../services/interfaces/IArtistDetailDto";
import {IMasterReleaseDto} from "../services/interfaces/IMasterReleaseDto";
import {ArtistService} from "../services/ArtistService";
import {MasterReleaseService} from "../services/MasterReleaseService";

@Component({
    template: require("./templates/artist-detail-component.html"),
    styles: [require("./styles/artist-detail-component.scss")]
})
export class ArtistDetailComponent implements OnInit {
    public loading: boolean = true;
    public error: boolean = false;
    
    public artistData: IArtistDetailDto = {} as any;
    public masterReleases: IMasterReleaseDto[] = [];
    
    public constructor(
        @Inject(ActivatedRoute) private route: ActivatedRoute,
        @Inject(ArtistService) private artistService: ArtistService,
        @Inject(MasterReleaseService) private masterReleaseService: MasterReleaseService
    ) {}
    
    public ngOnInit(): void {
        this.route.params.subscribe(params => {
            const artistId: number = params.artistId;
            
            Promise.all([
                this.artistService.getArtist(artistId),
                this.masterReleaseService.getMasterReleases(artistId)
            ]).then(([artistDetailDto, masterReleases]) => {
                this.artistData = artistDetailDto;
                this.masterReleases = masterReleases;
                
                this.loading = false;
            }).catch(() => {
                this.error = true;
            });
        });
    }
}
