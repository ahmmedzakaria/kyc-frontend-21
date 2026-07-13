import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import {GisService} from "../../core/services/gis.service";

interface LocationItem {
    id: string;
    gisCode: string;
    detailLocation: string;
}

@Component({
    selector: 'app-location-dropdown',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './location-dropdown.component.html',
    styleUrls: ['./location-dropdown.component.scss']
})
export class LocationDropdownComponent {
    @Input() placeholder = 'Search location...';
    @Input() selectedLabel = '';
    @Output() locationSelected = new EventEmitter<LocationItem | null>();

    @ViewChild('dropdownList') dropdownList!: ElementRef<HTMLDivElement>;

    searchTerm = '';
    locations: LocationItem[] = [];
    isLoading = false;
    isDropdownOpen = false;
    selectedLocation: LocationItem | null = null;
    highlightedIndex = -1;
    page = 0;
    totalPages = 0;

    private search$ = new Subject<string>();

    constructor(private gisService: GisService) {
        this.setupSearch();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('selectedLabel' in changes && !this.selectedLocation) {
            this.searchTerm = this.selectedLabel || '';
        }
    }

    private setupSearch() {
        this.search$.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            tap(() => {
                this.page = 0;
                this.locations = [];
                this.isLoading = true;
            }),
            switchMap(term => {
                if (!term.trim()) return of({ content: [], totalPages: 0 });
                return this.gisService.searchLocation(term, this.page, 10);
            }),
            tap(() => (this.isLoading = false))
        ).subscribe({
            next: (res) => {
                this.locations = res?.content ?? [];
                this.totalPages = res?.totalPages ?? 0;
                this.isDropdownOpen = true;
                this.highlightedIndex = -1;
            },
            error: () => (this.isLoading = false)
        });
    }

    onSearch(term: string): void {
        this.searchTerm = term;
        this.search$.next(term);
    }

    onScroll(e: Event): void {
        const el = e.target as HTMLElement;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;

        if (atBottom && !this.isLoading && this.page + 1 < this.totalPages) {
            this.page++;
            this.isLoading = true;
            this.gisService.searchLocation(this.searchTerm, this.page, 10).subscribe({
                next: (res) => {
                    this.locations.push(...(res?.content ?? []));
                    this.isLoading = false;
                },
                error: () => (this.isLoading = false)
            });
        }
    }

    selectLocation(location: LocationItem): void {
        this.selectedLocation = location;
        this.searchTerm = location.detailLocation;
        this.isDropdownOpen = false;
        this.highlightedIndex = -1;
        this.locationSelected.emit(location);
    }

    clearSelection(): void {
        this.selectedLocation = null;
        this.searchTerm = '';
        this.locations = [];
        this.isDropdownOpen = false;
        this.locationSelected.emit(null);
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (!this.isDropdownOpen || !this.locations.length) return;

        if (event.key === 'ArrowDown') {
            this.highlightedIndex = (this.highlightedIndex + 1) % this.locations.length;
            this.scrollToHighlighted();
            event.preventDefault();
        } else if (event.key === 'ArrowUp') {
            this.highlightedIndex = (this.highlightedIndex - 1 + this.locations.length) % this.locations.length;
            this.scrollToHighlighted();
            event.preventDefault();
        } else if (event.key === 'Enter' && this.highlightedIndex >= 0) {
            this.selectLocation(this.locations[this.highlightedIndex]);
            event.preventDefault();
        }
    }

    private scrollToHighlighted(): void {
        const listEl = this.dropdownList?.nativeElement;
        if (!listEl) return;

        const activeEl = listEl.children[this.highlightedIndex] as HTMLElement;
        if (activeEl) {
            const top = activeEl.offsetTop;
            const bottom = top + activeEl.offsetHeight;

            if (top < listEl.scrollTop) {
                listEl.scrollTop = top;
            } else if (bottom > listEl.scrollTop + listEl.clientHeight) {
                listEl.scrollTop = bottom - listEl.clientHeight;
            }
        }
    }

    highlightMatch(text: string): string {
        if (!this.searchTerm) return text;
        const re = new RegExp(`(${this.escapeRegex(this.searchTerm)})`, 'gi');
        return text.replace(re, `<mark>$1</mark>`);
    }

    private escapeRegex(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
