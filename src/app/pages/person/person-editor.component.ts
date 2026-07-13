import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PersonFormComponent } from './person-form.component';
import { Person } from './person.model';

@Component({
    selector: 'app-person-editor',
    standalone: true,
    imports: [CommonModule, RouterLink, PersonFormComponent],
    templateUrl: './person-editor.component.html',
})
export class PersonEditorComponent implements OnInit {
    personData?: Person;
    isEditMode = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        const routeId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!routeId;

        if (!this.isEditMode) {
            return;
        }

        const person = history.state?.person as Person | undefined;
        if (!person?.id || person.id.toString() !== routeId) {
            this.router.navigate(['/person']);
            return;
        }

        this.personData = person;
    }

    onSaved(): void {
        this.router.navigate(['/person']);
    }
}
