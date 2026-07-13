import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Kyc } from '../../core/services/kyc.service';
import {KycFormComponent} from '@nexacore/shared';

@Component({
    selector: 'app-kyc-create',
    imports: [
        KycFormComponent
    ],
    templateUrl: './kyc-create.component.html'
})
export class KycCreateComponent {
  editingKyc?: Kyc;

  constructor(private router: Router, private route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // load existing KYC if needed
    }
  }

  onSaved(kyc: Kyc) {
    this.router.navigate(['/kyc']);
  }
}
