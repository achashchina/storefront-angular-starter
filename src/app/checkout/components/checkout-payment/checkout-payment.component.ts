import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import {
    AddPaymentMutation,
    AddPaymentMutationVariables,
    GetEligiblePaymentMethodsQuery,
} from "../../../common/generated-types";
import { DataService } from "../../../core/providers/data/data.service";
import { StateService } from "../../../core/providers/state/state.service";
import { FaIconComponent, FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import {
    ADD_PAYMENT,
    GET_ELIGIBLE_PAYMENT_METHODS,
} from "./checkout-payment.graphql";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "vsf-checkout-payment",
    templateUrl: "./checkout-payment.component.html",
    // styleUrls: ['./checkout-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, FontAwesomeModule, FaIconComponent],
})
export class CheckoutPaymentComponent implements OnInit {
    cardNumber: string;
    expMonth: number;
    expYear: number;
    paymentMethods$: Observable<
        GetEligiblePaymentMethodsQuery["eligiblePaymentMethods"]
    >;
    paymentErrorMessage: string | undefined;

    constructor(
        private dataService: DataService,
        private stateService: StateService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.paymentMethods$ = this.dataService
            .query<GetEligiblePaymentMethodsQuery>(GET_ELIGIBLE_PAYMENT_METHODS)
            .pipe(map((res) => res.eligiblePaymentMethods));
    }

    getMonths(): number[] {
        return Array.from({ length: 12 }).map((_, i) => i + 1);
    }

    getYears(): number[] {
        const year = new Date().getFullYear();
        return Array.from({ length: 10 }).map((_, i) => year + i);
    }

    completeOrder(paymentMethodCode: string) {
        this.dataService
            .mutate<AddPaymentMutation, AddPaymentMutationVariables>(
                ADD_PAYMENT,
                {
                    input: {
                        method: paymentMethodCode,
                        metadata: {},
                    },
                }
            )
            .subscribe(async ({ addPaymentToOrder }) => {
                switch (addPaymentToOrder?.__typename) {
                    case "Order":
                        const order = addPaymentToOrder;
                        if (
                            order &&
                            (order.state === "PaymentSettled" ||
                                order.state === "PaymentAuthorized")
                        ) {
                            await new Promise<void>((resolve) =>
                                setTimeout(() => {
                                    this.stateService.setState(
                                        "activeOrderId",
                                        null
                                    );
                                    resolve();
                                }, 500)
                            );
                            this.router.navigate(
                                ["../confirmation", order.code],
                                { relativeTo: this.route }
                            );
                        }
                        break;
                    case "OrderPaymentStateError":
                    case "PaymentDeclinedError":
                    case "PaymentFailedError":
                    case "OrderStateTransitionError":
                        this.paymentErrorMessage = addPaymentToOrder.message;
                        break;
                }
            });
    }
}
