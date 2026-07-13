import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, isDevMode, provideZonelessChangeDetection } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { jwtInterceptor, languageInterceptor } from '@nexacore/api-common';
import {apiResponseInterceptor} from "@nexacore/api-common";
import { I18nService } from '@nexacore/shared/i18n/i18n.service';
import { TranslocoHttpLoader } from '@nexacore/layout';

function initializeI18n(i18nService: I18nService): () => Promise<void> {
    return () => i18nService.initialize();
}


bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([languageInterceptor, jwtInterceptor, apiResponseInterceptor])
        ),
        provideTransloco({
            config: {
                availableLangs: ['en', 'bn', 'ar'],
                defaultLang: 'en',
                fallbackLang: 'en',
                reRenderOnLangChange: true,
                prodMode: !isDevMode()
            },
            loader: TranslocoHttpLoader
        }),
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [I18nService],
            useFactory: initializeI18n
        }
    ]
}).catch(err => console.error(err));
