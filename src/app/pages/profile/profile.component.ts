import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {ApiService} from "@nexacore/api-common";
import {ApiEndpoints} from "../../core/api/api-endpoints";

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    form!: FormGroup;
    userPhotoPreview: string | ArrayBuffer | null = null;
    isEditing = false;
    userData: any = {};

    constructor(
        private fb: FormBuilder,
        private apiService: ApiService
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            mobile: ['', [Validators.required]],
            password: [''],
            photo: [null]
        });

        this.loadUserProfile();
    }

    loadUserProfile(): void {
        this.apiService.post(ApiEndpoints.KYC_GET, {'id':14}).subscribe({
            next: res => {
                this.userData = res;
                this.form.patchValue({
                    name: this.userData.name,
                    email: this.userData.email,
                    mobile: this.userData.mobile
                });
                if (this.userData.picture_url) {
                    this.userPhotoPreview = this.userData.picture_url;
                }
            }
        });
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.form.patchValue({ photo: file });
            const reader = new FileReader();
            reader.onload = e => (this.userPhotoPreview = (e.target as FileReader).result);
            reader.readAsDataURL(file);
        }
    }

    toggleEdit(): void {
        this.isEditing = !this.isEditing;
    }

    saveProfile(): void {
        const formData = new FormData();
        Object.keys(this.form.controls).forEach(key => {
            const value = this.form.get(key)?.value;
            if (value) formData.append(key, value);
        });

        this.apiService.post(ApiEndpoints.USER_UPDATE, formData).subscribe({
            next: res => {
                this.isEditing = false;
                this.loadUserProfile();
            }
        });
    }
}
