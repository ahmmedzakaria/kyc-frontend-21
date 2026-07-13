import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import { PersonService } from '../../../core/services/person.service';
import {Observable, of} from "rxjs"
import {Person} from "../person.model";
import {Router, RouterLink} from "@angular/router";
import {ApiService} from "@nexacore/api-common";
import {ApiEndpoints} from "../../../core/api/api-endpoints";
import { ImagePreviewComponent } from '@nexacore/shared';

@Component({
    selector: 'app-person-list',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, ImagePreviewComponent],
    templateUrl: './person-list.component.html',
    // styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent implements OnInit, OnDestroy {
    persons: any[] = [];
    totalElements = 0;
    totalPages = 0;
    currentPage = 0;
    pageSize = 10;
    currentSearchText = '';
    private photoObjectUrls: string[] = [];

    constructor(
        private service: PersonService,
        private fb: FormBuilder,
        private router: Router,
        private apiService: ApiService
    ) {}
    searchForm!: FormGroup;



    ngOnInit() {
        this.searchForm = this.fb.group({
            searchText: ['']
        })
        this.loadData();

        // Reactive search with debounce
        const searchControl = this.searchForm.get('searchText');

        if (!searchControl) return;

        searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap((text: string | null): Observable<Person[] | null> => {
                    const normalizedText = (text || '').trim();

                    if (!normalizedText) {
                        this.currentSearchText = '';
                        return this.service.searchPersons('', 0, this.pageSize);
                    }

                    if (normalizedText.length <= 2) {
                        this.currentSearchText = '';
                        return of(null);
                    }

                    this.currentSearchText = normalizedText;
                    return this.service.searchPersons(normalizedText, 0, this.pageSize);
                })
            )
            .subscribe({
                next: (res) => {
                    if (!res) {
                        return;
                    }
                    this.currentPage = 0;
                    this.populateData(res);
                },
                error: (err) => console.error('Search error:', err),
            });
    }

    ngOnDestroy(): void {
        this.revokePhotoUrls();
    }

    loadData(page: number = 0) {
        const searchText = (this.searchForm?.value?.searchText || '').trim();
        const effectiveSearchText = searchText.length > 2 ? searchText : '';
        this.currentSearchText = effectiveSearchText;

        this.service.searchPersons(effectiveSearchText, page, this.pageSize)
            .subscribe({
                next: (res) => this.populateData(res),
            });
    }

    populateData(data: any) {
        this.revokePhotoUrls();
        this.persons = (data?.content || []).map((person: any) => ({
            ...person,
            photoUrl: 'assets/default-avatar.svg',
        }));
        this.totalElements = data?.totalElements || 0;
        this.totalPages = data?.totalPages || 0;
        this.currentPage = data?.number || 0;

        this.persons.forEach((person: any) => {
            if (!person.id) {
                return;
            }

            this.apiService.fetchImageUrl(ApiEndpoints.PERSON_PHOTO, { ownerId: person.id }).subscribe({
                next: (imageUrl) => {
                    this.photoObjectUrls.push(imageUrl);
                    person.photoUrl = imageUrl;
                },
                error: () => {
                    person.photoUrl = 'assets/default-avatar.svg';
                }
            });
        });
    }

    edit(person: any) {
        this.router.navigate(['/person', person.id, 'edit'], { state: { person } });
    }

    preview(person: any) {
        this.router.navigate(['/person', person.id, 'preview'], { state: { person } });
    }

    delete(person: any) {
        if (confirm(`Delete ${person.firstName || person.username}?`)) {
            this.service.deletePerson(person.id).subscribe(() => this.loadData(this.currentPage));
        }
    }

    goToPage(page: number) {
        if (page >= 0 && page < this.totalPages) {
            this.loadData(page);
        }
    }

    private revokePhotoUrls(): void {
        this.photoObjectUrls.forEach(url => URL.revokeObjectURL(url));
        this.photoObjectUrls = [];
    }

    highlightText(value: string | undefined | null): string {
        const text = value || '-';
        if (!this.currentSearchText) {
            return text;
        }

        const escapedSearchText = this.escapeRegex(this.currentSearchText);
        return text.replace(
            new RegExp(`(${escapedSearchText})`, 'gi'),
            '<mark style="background-color: #f4c542; color: #1f2937; padding: 0 !important; border-radius: 0.15rem;">$1</mark>'
        );
    }

    private escapeRegex(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
