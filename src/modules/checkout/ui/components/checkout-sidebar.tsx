import { CircleXIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
    total?: number;
    currency?: string;
    onPurchase: () => void;
    isCanceled?: boolean;
    isDisabled?: boolean;
}

export const CheckoutSidebar = ({
    total,
    currency,
    onPurchase,
    isCanceled,
    isDisabled
}: Props) => {

    return (
        <div className="border rounded-md overflow-hidden bg-white flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-medium text-lg">
                    Total
                </h4>
                <p className="font-medium text-lg">
                    {formatCurrency(
                        total,
                        currency
                    )}
                </p>
            </div>
            <div className="p-4 flex items-center justify-center">
                <Button
                    variant="elevated"
                    onClick={onPurchase}
                    disabled={isCanceled || isDisabled}
                    size="lg"
                    className="text-base w-full text-white bg-primary hover:bg-pink-400 hover:text-primary"
                >
                    Checkout
                </Button>
            </div>
            {isCanceled && (
                <div className="p-4 flex items-center justify-center border-t">
                    <div className="bg-red-100 border border-red-400 font-medium px-4 py-3 rounded
                    flex items-center">
                        <div className="flex items-center">
                            <CircleXIcon className="size-6 mr-2 fill-red-500 text-red-100" />
                            <span>Check out failed</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )


}

