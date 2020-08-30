import {Component, OnInit, Inject} from "@angular/core";
import {ActivatedRoute} from '@angular/router';

import {ArtistService} from "../services/ArtistService";
import {MasterReleaseService} from "../services/MasterReleaseService";
import {ReleaseService} from "../services/ReleaseService";
import {IReleaseDto} from "../services/interfaces/IReleaseDto";
import {CommonFormatters} from "./lib/CommonFormatters";

@Component({
    template: require("./templates/master-release-detail-component.html"),
    styles: [require("./styles/master-release-detail-component.scss")]
})
export class MasterReleaseDetailComponent implements OnInit {
    public loading: boolean = true;
    public error: boolean = false;
    
    public artistName: string;
    public masterReleaseTitle: string;
    public formattedReleaseList: FormattedRelease[] = [];
    public artistId: number;
    public masterReleaseId: number;
 
    public constructor(
        @Inject(ActivatedRoute) private route: ActivatedRoute,
        @Inject(ArtistService) private artistService: ArtistService,
        @Inject(MasterReleaseService) private masterReleaseService: MasterReleaseService,
        @Inject(ReleaseService) private releaseService: ReleaseService
    ) {}
    
    public ngOnInit(): void {
        this.route.params.subscribe(params => {
            const masterReleaseId: number = params.masterReleaseId;
            const artistId: number = params.artistId;
            
            Promise.all([
                this.artistService.getArtist(artistId),
                this.masterReleaseService.getMasterRelease(masterReleaseId),
                this.releaseService.getReleasesForMasterRelease(masterReleaseId)
            ]).then(([artistDetailDto, masterReleaseDetailDto, releasesDto]) => {
                this.artistName = artistDetailDto.name;
                this.masterReleaseTitle = masterReleaseDetailDto.title;
                
                this.artistId = artistDetailDto.artistId;
                this.masterReleaseId = masterReleaseDetailDto.masterReleaseId;
                
                this.formattedReleaseList = MasterReleaseDetailComponent.getFormattedReleaseList(releasesDto);
                
                this.loading = false;
            }).catch(() => {
                this.error = true;
            });
        });
    }
    
    private static getFormattedReleaseList(releases: IReleaseDto[]): FormattedRelease[] {
        return releases.map((release: IReleaseDto) => {
            const formatList: string = CommonFormatters.getFormattedFormatList(release);
            
            return {
                releaseId: release.releaseId,
                imageUrl: release.imageUrl,
                title: `${formatList}, ${release.catalogNumber}`
            };
        });
    }
}

interface FormattedRelease {
    releaseId: number;
    imageUrl: string;
    title: string;
}
