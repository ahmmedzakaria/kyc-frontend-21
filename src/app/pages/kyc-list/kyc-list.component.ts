import { Component, OnInit } from '@angular/core';
import { Kyc, KycService } from '../../core/services/kyc.service';
import {NgIf} from "@angular/common";
import {KycTableComponent} from '@nexacore/shared';
import {KycFormComponent} from '@nexacore/shared';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-kyc-list',
    imports: [
        NgIf,
        KycTableComponent,
        KycFormComponent,
        RouterLink
    ],
    templateUrl: './kyc-list.component.html'
})
export class KycListComponent implements OnInit {
  kycList: Kyc[] = [];
  editingKyc?: Kyc;

  constructor(private kycService: KycService) {}

  ngOnInit() { this.loadKyc(); }

  loadKyc() {
    this.kycService.searchKyc().subscribe(res => {
      this.kycList = res.content ? res.content.map((it: any) => ({ id: it.id, name: it.firstName, email: it.email, phone: it.phone, photoString:it.photoString })) : res;
    });
  }

  onEdit(kyc: Kyc) { this.editingKyc = kyc; }

  onDelete(kyc: Kyc) {
    if (!confirm('Delete?')) return;
    this.kycService.deleteKyc(kyc.id!).subscribe(() => this.loadKyc());
  }

  onSaved(kyc: Kyc) {
    this.editingKyc = undefined;
    this.loadKyc();
  }
}
