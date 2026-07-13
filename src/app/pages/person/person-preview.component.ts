import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Person } from './person.model';
import { ApiService } from '@nexacore/api-common';
import { ApiEndpoints } from '../../core/api/api-endpoints';
import { GisService } from '../../core/services/gis.service';
import { ImagePreviewComponent } from '@nexacore/shared';

@Component({
    selector: 'app-person-preview',
    standalone: true,
    imports: [CommonModule, RouterLink, ImagePreviewComponent],
    templateUrl: './person-preview.component.html',
})
export class PersonPreviewComponent implements OnInit, OnDestroy {
    person?: Person;
    photoUrl = 'assets/default-avatar.svg';
    currentLocationLabel = '-';
    permanentLocationLabel = '-';
    private objectUrl?: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apiService: ApiService,
        private gisService: GisService
    ) {}

    ngOnInit(): void {
        const routeId = this.route.snapshot.paramMap.get('id');
        const person = history.state?.person as Person | undefined;

        if (!routeId || !person?.id || person.id.toString() !== routeId) {
            this.router.navigate(['/person']);
            return;
        }

        this.person = person;
        this.loadPhoto(person.id);
        this.loadLocationLabels(person);
    }

    ngOnDestroy(): void {
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
        }
    }

    private loadPhoto(personId: number): void {
        this.apiService.fetchImageUrl(ApiEndpoints.PERSON_PHOTO, { ownerId: personId }).subscribe({
            next: (imageUrl) => {
                if (this.objectUrl) {
                    URL.revokeObjectURL(this.objectUrl);
                }
                this.objectUrl = imageUrl;
                this.photoUrl = this.objectUrl;
            },
            error: () => {
                this.photoUrl = 'assets/default-avatar.svg';
            }
        });
    }

    private loadLocationLabels(person: Person): void {
        this.loadLocationLabel(person.currentLocationId, person.currentLocationType, 'current');
        this.loadLocationLabel(person.permanentLocationId, person.permanentLocationType, 'permanent');
    }

    private loadLocationLabel(
        locationId: string | undefined,
        gisCode: string | undefined,
        type: 'current' | 'permanent'
    ): void {
        if (!locationId || !gisCode) {
            return;
        }

        this.gisService.getLocationById(locationId, gisCode).subscribe({
            next: (location: any) => {
                const label = location?.detailLocation || '-';
                if (type === 'current') {
                    this.currentLocationLabel = label;
                } else {
                    this.permanentLocationLabel = label;
                }
            },
            error: () => {
                if (type === 'current') {
                    this.currentLocationLabel = '-';
                } else {
                    this.permanentLocationLabel = '-';
                }
            }
        });
    }
}
