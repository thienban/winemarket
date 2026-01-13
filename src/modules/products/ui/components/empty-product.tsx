import { InboxIcon, LoaderIcon, TriangleAlertIcon } from "lucide-react"


export const EmptyProduct = () => {
    return (
        <div className="border border-black border-dashed flex items-center justify-center p-8
        flex-col gap-y-4 bg-white w-full rounded-lg">
            <InboxIcon />
            <p className="text-base font-medium">No products found</p>
        </div>
    )
}

export const LoadingProduct = () => {
    return (
        <div className="border border-black border-dashed flex items-center justify-center p-8
        flex-col gap-y-4 bg-white w-full rounded-lg">
            <LoaderIcon className="text-muted-foreground animate-spin" />
        </div>
    )
}

export const ErrorProduct = () => {
    return (
        <div className="border border-black border-dashed flex items-center justify-center p-8
        flex-col gap-y-4 bg-white w-full rounded-lg">
            <TriangleAlertIcon />
            <p className="text-base font-medium">Something went wrong</p>
        </div>
    )
}
