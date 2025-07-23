import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import {
    VerifyMutation,
    VerifyMutationVariables,
} from "../../../common/generated-types";
import { DataService } from "../../../core/providers/data/data.service";
import { StateService } from "../../../core/providers/state/state.service";

import { VERIFY } from "./verify.graphql";
import { CenteredCardComponent } from "src/app/shared/components/centered-card/centered-card.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "vsf-verify",
    templateUrl: "./verify.component.html",
    // styleUrls: ['./verify.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [CommonModule, FormsModule, CenteredCardComponent],
})
export class VerifyComponent {
    password = "";

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataService: DataService,
        private stateService: StateService
    ) {}

    verify() {
        const password = this.password;
        const token = this.route.snapshot.queryParamMap.get("token");

        if (password && token) {
            this.dataService
                .mutate<VerifyMutation, VerifyMutationVariables>(VERIFY, {
                    password,
                    token,
                })
                .subscribe(() => {
                    this.stateService.setState("signedIn", true);
                    this.router.navigate(["/account"]);
                });
        }
    }
}
