import "./global-styles.scss";

import "./images/loading.gif";

import {NgModule} from "@angular/core";
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {MainComponent} from "./components/MainComponent";
import {ArtistsComponent} from "./components/ArtistsComponent";
import {HierarchicalViewComponent} from "./components/HierarchicalViewComponent";
import {ArtistDetailComponent} from "./components/ArtistDetailComponent";
import {MasterReleaseDetailComponent} from "./components/MasterReleaseDetailComponent";
import {ReleaseDetailComponent} from "./components/ReleaseDetailComponent";
import {ErrorComponent} from "./components/ErrorComponent";
import {FlatViewComponent} from "./components/FlatViewComponent";
import {AllReleasesComponent} from "./components/AllReleasesComponent";

import {ArtistService} from "./services/ArtistService";
import {MasterReleaseService} from "./services/MasterReleaseService";
import {ReleaseService} from "./services/ReleaseService";
import {BreadCrumbService} from "./services/BreadCrumbService";
import {Config} from "./services/Config";

const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "hierarchical-view",
        pathMatch: "full"
    },
    {
        path: "hierarchical-view",
        component: HierarchicalViewComponent,
        children: [
            {
                path: "",
                redirectTo: "artists",
                pathMatch: "full"
            },
            {
                path: "artists",
                component: ArtistsComponent,
            },
            {
                path: "artist/:artistId",
                component: ArtistDetailComponent
            },
            {
                path: "artist/:artistId/master-release/:masterReleaseId",
                component: MasterReleaseDetailComponent
            },
            {
                path: "artist/:artistId/master-release/:masterReleaseId/release/:releaseId",
                component: ReleaseDetailComponent
            }
        ]
    },
    {
        path: "flat-view",
        component: FlatViewComponent,
        children: [
            {
                path: "",
                redirectTo: "all-releases",
                pathMatch: "full"
            },
            {
                path: "all-releases",
                component: AllReleasesComponent
            },
            {
                path: "artist/:artistId/master-release/:masterReleaseId/release/:releaseId",
                component: ReleaseDetailComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {useHash: true}),
        FormsModule
    ],
    declarations: [
        MainComponent,
        ArtistsComponent,
        HierarchicalViewComponent,
        ArtistDetailComponent,
        MasterReleaseDetailComponent,
        ReleaseDetailComponent,
        ErrorComponent,
        FlatViewComponent,
        AllReleasesComponent
    ],
    bootstrap: [
        MainComponent
    ],
    providers: [
        ArtistService,
        MasterReleaseService,
        ReleaseService,
        BreadCrumbService,
        Config
    ]
})
class AppModule {}

window.onload = () => {
    platformBrowserDynamic().bootstrapModule(AppModule);
}
