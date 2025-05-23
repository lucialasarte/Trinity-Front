import { NgModule } from "@angular/core";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzCollapseModule } from "ng-zorro-antd/collapse";
import { NzStepsModule } from "ng-zorro-antd/steps";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzAutocompleteModule } from "ng-zorro-antd/auto-complete";
import { NzAlertModule } from "ng-zorro-antd/alert";
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzPaginationModule } from "ng-zorro-antd/pagination";
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  declarations: [],
  imports: [
    NzIconModule,
    NzCollapseModule,
    NzStepsModule,
    NzTableModule,
    NzSelectModule,
    NzInputModule,
    NzFormModule,
    NzDatePickerModule,
    NzDropDownModule,
    NzCheckboxModule,
    NzModalModule,
    NzAutocompleteModule,
    NzAlertModule,
    NzPopoverModule,
    NzSwitchModule,
    NzSpinModule,
    NzPaginationModule,
    NzDividerModule
  ],
  exports: [
    NzIconModule,
    NzCollapseModule,
    NzStepsModule,
    NzTableModule,
    NzSelectModule,
    NzInputModule,
    NzFormModule,
    NzDatePickerModule,
    NzDropDownModule,
    NzCheckboxModule,
    NzModalModule,
    NzAutocompleteModule,
    NzAlertModule,
    NzPopoverModule,
    NzSwitchModule,
    NzSpinModule,
    NzPaginationModule,
    NzDividerModule
  ]
})
export class NzZorroModule {}
