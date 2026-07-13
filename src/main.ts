import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { jwtInterceptor, languageInterceptor } from '@nexacore/api-common';
import {importProvidersFrom} from "@angular/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {apiResponseInterceptor} from "@nexacore/api-common";
import { APP_INITIALIZER } from '@angular/core';
import { I18nService } from '@nexacore/shared/i18n/i18n.service';

function initializeI18n(i18nService: I18nService): () => Promise<void> {
    return () => i18nService.initialize();
}


bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([languageInterceptor, jwtInterceptor, apiResponseInterceptor])
        ),
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [I18nService],
            useFactory: initializeI18n
        },
        importProvidersFrom(
            BrowserAnimationsModule,
            MatSnackBarModule
        )
    ]
}).catch(err => console.error(err));
