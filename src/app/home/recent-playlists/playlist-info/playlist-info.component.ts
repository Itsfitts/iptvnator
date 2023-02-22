/* eslint-disable @typescript-eslint/unbound-method */
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
    FormControl,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Playlist } from '../../../../../shared/playlist.interface';
import { DataService } from '../../../services/data.service';
import { PlaylistMeta } from '../../../shared/playlist-meta.type';
import * as PlaylistActions from '../../../state/actions';

@Component({
    selector: 'app-playlist-info',
    templateUrl: './playlist-info.component.html',
    providers: [DatePipe],
    imports: [
        TranslateModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
    ],
    standalone: true,
})
export class PlaylistInfoComponent {
    /** Flag that returns true if application runs in electron-based environment */
    isElectron = this.electronService.isElectron;

    /** Playlist object */
    playlist: Playlist;

    /** Form group with playlist details */
    playlistDetails: UntypedFormGroup;

    /**
     * Creates an instance of the component and injects the selected playlist from the parent component
     * @param datePipe
     * @param formBuilder
     * @param electronService
     * @param playlist playlist object to show
     */
    constructor(
        private datePipe: DatePipe,
        private formBuilder: UntypedFormBuilder,
        private electronService: DataService,
        @Inject(MAT_DIALOG_DATA) playlist: Playlist,
        private store: Store
    ) {
        this.playlist = playlist;
    }

    /**
     * Create the form and set initial data on component init
     */
    ngOnInit(): void {
        this.playlistDetails = this.formBuilder.group({
            _id: this.playlist._id,
            title: new FormControl(this.playlist.title, Validators.required),
            userAgent: this.playlist.userAgent || '',
            filename: new FormControl({
                value: this.playlist.filename || '',
                disabled: true,
            }),
            count: new FormControl({
                value: this.playlist.count,
                disabled: true,
            }),
            importDate: new FormControl({
                value: this.datePipe.transform(this.playlist.importDate),
                disabled: true,
            }),
            url: new FormControl({
                value: this.playlist.url,
                disabled: true,
            }),
            filePath: new FormControl({
                value: this.playlist.filePath,
                disabled: true,
            }),
            autoRefresh: new FormControl(this.playlist.autoRefresh),
        });
    }

    /**
     * Saves updated playlist information
     * @param data updated form data
     */
    saveChanges(playlist: PlaylistMeta): void {
        this.store.dispatch(PlaylistActions.updatePlaylistMeta({ playlist }));
    }
}
