import {ArtistService} from "../services/ArtistService";
import {MasterReleaseService} from "../services/MasterReleaseService";
import {ReleaseService} from "../services/ReleaseService";
import {Inject, Injectable} from "@angular/core";
import {Router} from '@angular/router';

export interface BreadCrumb {
    route: string,
    text: string
}

interface BreadCrumbRoute {
    pathPattern: RegExp;
    parentResource: (matchingGroups: string[]) => string;
    breadCrumbText: (matchingGroups: string[]) => Promise<string>;
}

@Injectable()
export class BreadCrumbService {
    public breadCrumbRoutes: BreadCrumbRoute[] = [
        {
            pathPattern: /\/hierarchical-view\/artists$/,
            parentResource: function (matchingGroups: string[]) {
                return null;
            },
            breadCrumbText: function (matchingGroups: string[]): Promise<string> {
                return Promise.resolve("Artists");
            }
        },
        {
            pathPattern: /\/hierarchical-view\/artist\/(\d*)$/,
            parentResource: function (matchingGroups: string[]) {
                return "/hierarchical-view/artists";
            },
            breadCrumbText: function (matchingGroups: string[]): Promise<string> {
                return this.artistService.getArtist(matchingGroups[1]).then((artist) => {
                    return artist.name;
                });
            }
        },
        {
            pathPattern: /\/hierarchical-view\/artist\/(\d*)\/master-release\/(\d*)$/,
            parentResource: function (matchingGroups: string[]) {
                return `/hierarchical-view/artist/${matchingGroups[1]}`;
            },
            breadCrumbText: function (matchingGroups: string[]): Promise<string> {
                return this.masterReleaseService.getMasterRelease(matchingGroups[2]).then((masterRelease) => {
                    return masterRelease.title;
                });
            }
        },
        {
            pathPattern: /\/hierarchical-view\/artist\/(\d*)\/master-release\/(\d*)\/release\/(\d*)$/,
            parentResource: function (matchingGroups: string[]) {
                return `/hierarchical-view/artist/${matchingGroups[1]}/master-release/${matchingGroups[2]}`;
            },
            breadCrumbText: function (matchingGroups: string[]): Promise<string> {
                return this.releaseService.getRelease(matchingGroups[3]).then((release) => {
                    return `${release.recordLabelName}, ${release.catalogNumber}`;
                });
            }
        },
        {
            pathPattern: /\/flat-view\/all-releases$/,
            parentResource: function (matchingGroups: string[]) {
                return null;
            },
            breadCrumbText: function(matchingGroups: string[]): Promise<string> {
                return Promise.resolve("All Releases");
            }
        },
        {
            pathPattern: /\/flat-view\/artist\/(\d*)\/master-release\/(\d*)\/release\/(\d*)$/,
            parentResource: function (matchingGroups: string[]) {
                return `/flat-view/all-releases`;
            },
            breadCrumbText: function (matchingGroups: string[]): Promise<string> {
                return this.releaseService.getRelease(matchingGroups[3]).then((release) => {
                    return `${release.recordLabelName}, ${release.catalogNumber}`;
                });
            }
        },
    ];

    public constructor(
        @Inject(ReleaseService) private releaseService: ReleaseService,
        @Inject(MasterReleaseService) private masterReleaseService: MasterReleaseService,
        @Inject(ArtistService) private artistService: ArtistService
    ) {}
    
    public getBreadCrumbs(router: Router): Promise<BreadCrumb[]> {
        let currentPath: string = router.routerState.snapshot.url;
        let breadCrumbPromises: Promise<BreadCrumb>[] = [];     
        let breadCrumbRoute: BreadCrumbRoute = this.getMatchingBreadCrumbRoute(currentPath);
        
        while (breadCrumbRoute !== undefined) {
            let matchingGroups: string[] = breadCrumbRoute.pathPattern.exec(currentPath);
            let breadCrumbPath: string = currentPath;
    
            breadCrumbPromises.unshift(
                breadCrumbRoute.breadCrumbText.call(this, matchingGroups).then((breadCrumbText) =>
                    ({route: breadCrumbPath, text: breadCrumbText})
                )
            );
            
            currentPath = breadCrumbRoute.parentResource(matchingGroups);
            breadCrumbRoute = this.getMatchingBreadCrumbRoute(currentPath);
        }
                
        return Promise.all(breadCrumbPromises);
    }
    
    public getMatchingBreadCrumbRoute(path: string): any {
        return this.breadCrumbRoutes.find((route: BreadCrumbRoute): boolean => {
            return route.pathPattern.test(path);
        });
    }
}
