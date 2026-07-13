import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {Person} from "./person.model";
import {PersonService} from "../../core/services/person.service";
import {GisService} from "../../core/services/gis.service";
import {ApiService} from "@nexacore/api-common";
import {ApiEndpoints} from "../../core/api/api-endpoints";
import {LocationDropdownComponent} from "./location-dropdown.component";
import {TextboxComponent} from '@nexacore/shared';
import {SmartDropdownComponent} from '@nexacore/shared';
import {DatePickerComponent} from '@nexacore/shared';
import {FileUploadComponent} from '@nexacore/shared';


@Component({
    selector: 'app-person-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, HttpClientModule, LocationDropdownComponent, TextboxComponent, SmartDropdownComponent, DatePickerComponent, FileUploadComponent],
    templateUrl: './person-form.component.html',
    // styleUrls: ['./person-form.component.scss']
})
export class PersonFormComponent implements OnDestroy {
    @Input() personData?: Person;
    @Output() saved = new EventEmitter<void>();

    form!: FormGroup;
    photoPreview: string | ArrayBuffer | null = null;
    currentLocationLabel = '';
    permanentLocationLabel = '';
    private previewObjectUrl: string | null = null;

    // Dropdown options
    bloodGroups = [
        {label:'A+',value:'A+'},
        {label:'A-',value:'A-'},
        {label:'B+',value:'B+'},
        {label:'B-',value:'B-'},
        {label:'AB+',value:'AB+'},
        {label:'AB-',value:'AB-'},
        {label:'O+',value:'O+'},
        {label:'O-',value:'O'},
        ];
    relations = ['Father', 'Mother', 'Brother', 'Sister', 'Friend', 'Other'];
    educationLevels = ['SSC', 'HSC', 'Diploma', 'Bachelor', 'Master', 'PhD'];
    passingYears = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
    genderList = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ]
    // Location search
    currentLocationResults: any[] = [];
    permanentLocationResults: any[] = [];

    constructor(
        private fb: FormBuilder,
        private service: PersonService,
        private gisService: GisService,
        private apiService: ApiService,
    ) {
        this.form = this.fb.group({
            id: [],
            username: [''],
            mobileNumber: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            firstName: [''],
            lastName: [''],
            dateOfBirth: [''],
            gender: [''],
            nationalId: [''],
            bloodGroup: [''],
            photo: [''],

            fatherName: [''],
            fatherMobileNumber: [''],
            motherName: [''],
            motherMobileNumber: [''],
            emergencyContactPerson: [''],
            emergencyContactNumber: [''],
            emergencyContactPersonRelation: [''],

            educationLevel: [''],
            institutionName: [''],
            passingYear: [''],

            currentLocationId: [''],
            currentLocationType: [''],
            currentAddress: [''],
            sameAddress: [false],
            permanentLocationId: [''],
            permanentLocationType: [''],
            permanentAddress: ['']
        });
    }

    ngOnInit() {
        // Load existing data (edit)
        if (this.personData) {
            this.form.patchValue(this.personData);
            this.loadPhotoPreview();
            this.loadLocationLabel('current');
            this.loadLocationLabel('permanent');
        }

        // Watch checkbox "sameAddress"
        this.form.controls.sameAddress.valueChanges.subscribe((checked) => {
            if (checked) {
                this.form.patchValue({
                    permanentAddress: this.form.value.currentAddress,
                    permanentLocationId: this.form.value.currentLocationId,
                    permanentLocationType: this.form.value.currentLocationType,
                });
            } else {
                this.form.patchValue({
                    permanentAddress: '',
                    permanentLocationId: null,
                    permanentLocationType: '',
                });
            }
        });


        // Debounced search for current/permanent locations
        this.setupLocationSearch('currentLocationId', 'currentLocationResults');
        this.setupLocationSearch('permanentLocationId', 'permanentLocationResults');
    }
    // onLocationSelected(controlName: string, location: any) {
    //     this.form.patchValue({ [controlName]: location.id });
    // }

    onLocationSelected(controlName: string, location: any) {
        const patchValue: Record<string, any> = {
            [controlName]: location?.id || null,
        };

        if (controlName === 'currentLocationId') {
            patchValue.currentLocationType = location?.gisCode || '';
            this.currentLocationLabel = location?.detailLocation || '';
        }

        if (controlName === 'permanentLocationId') {
            patchValue.permanentLocationType = location?.gisCode || '';
            this.permanentLocationLabel = location?.detailLocation || '';
        }

        this.form.patchValue(patchValue);
    }


    private setupLocationSearch(controlName: string, resultKey: string) {
        // this.form.controls[controlName]?.valueChanges.pipe(
        //     debounceTime(400),
        //     switchMap((val) => {
        //         if (typeof val === 'string' && val.length > 1) {
        //             return this.gisService.searchLocation(val,0,10)
        //         }
        //         return of([]);
        //     })
        // ).subscribe((results:any) => (this[resultKey] = results));

        this.form.controls[controlName]?.valueChanges.pipe(
            debounceTime(400),
            switchMap((val) => {
                if (typeof val === 'string' && val.length > 1) {
                    return this.gisService.searchLocation(val, 0, 10);
                }
                return of([]);
            })
        ).subscribe((results: any) => {
            (this as any)[resultKey] = results.content;
        });
    }

    private loadLocationLabel(type: 'current' | 'permanent'): void {
        const idControlName = type === 'current' ? 'currentLocationId' : 'permanentLocationId';
        const typeControlName = type === 'current' ? 'currentLocationType' : 'permanentLocationType';
        const locationId = this.form.get(idControlName)?.value;
        const gisCode = this.form.get(typeControlName)?.value;

        if (!locationId || !gisCode) {
            return;
        }

        this.gisService.getLocationById(locationId, gisCode).subscribe({
            next: (location: any) => {
                const label = location?.detailLocation || '';
                if (type === 'current') {
                    this.currentLocationLabel = label;
                } else {
                    this.permanentLocationLabel = label;
                }
            },
            error: () => {
                if (type === 'current') {
                    this.currentLocationLabel = '';
                } else {
                    this.permanentLocationLabel = '';
                }
            }
        });
    }

    private loadPhotoPreview(): void {
        const personId = this.personData?.id;
        if (!personId) {
            this.photoPreview = null;
            return;
        }

        this.apiService.fetchImageUrl(ApiEndpoints.PERSON_PHOTO, { ownerId: personId }).subscribe({
            next: (imageUrl) => {
                this.revokePreviewUrl();
                this.previewObjectUrl = imageUrl;
                this.photoPreview = imageUrl;
            },
            error: () => {
                this.revokePreviewUrl();
                this.photoPreview = null;
            }
        });
    }

    selectLocation(type: 'current' | 'permanent', location: any) {
        if (type === 'current') {
            this.form.patchValue({ currentLocationId: location.id });
            this.currentLocationResults = [];
        } else {
            this.form.patchValue({ permanentLocationId: location.id });
            this.permanentLocationResults = [];
        }
    }

    submit() {
        const formData = new FormData();
        Object.entries(this.form.value).forEach(([key, val]) => {
            if (val !== null && val !== undefined && key !== 'sameAddress' && key !== 'photo')
                formData.append(key, val.toString());
        });

        const selectedFiles = this.form.value.photo as File[] | null;
        const selectedFile = selectedFiles?.[0];
        if (selectedFile) {
            formData.append('photo', selectedFile);
        }

        const request$ = this.personData?.id
            ? this.service.updatePerson(formData)
            : this.service.createPerson(formData);

        request$.subscribe({
            next: () => this.saved.emit(),
        });
    }

    ngOnDestroy(): void {
        this.revokePreviewUrl();
    }

    private revokePreviewUrl(): void {
        if (!this.previewObjectUrl) {
            return;
        }

        URL.revokeObjectURL(this.previewObjectUrl);
        this.previewObjectUrl = null;
    }
}
