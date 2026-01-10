import { useTRPC } from "@/trpc/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { StarPicker } from "@/components/star-picker"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { ReviewsGetOneOutput } from "../../type/type"

interface Props {
    productId: string
    initialData?: ReviewsGetOneOutput
}

const formSchema = z.object({
    rating: z.number().min(1, "Rating is required").max(5),
    description: z.string().min(1, "Description is required"),
})

export const ReviewForm = ({ productId, initialData }: Props) => {

    const [isPreview, setIsPreview] = useState(!!initialData)

    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const createReview = useMutation(trpc.reviews.create.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({
                productId,
            }))
            setIsPreview(true)
        },
        onError: (error) => {
            toast.error(error.message)
        },
    }))

    const updateReview = useMutation(trpc.reviews.update.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({
                productId,
            }))
            setIsPreview(true)
        },
        onError: (error) => {
            toast.error(error.message)
        },
    }))

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rating: initialData?.rating ?? 0,
            description: initialData?.description ?? "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (initialData) {
            updateReview.mutate({
                reviewId: initialData.id,
                rating: values.rating,
                description: values.description,
            })
        } else {
            createReview.mutate({
                productId,
                rating: values.rating,
                description: values.description,
            })
        }
    }

    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <p className="font-medium">
                    {isPreview ? "Your rating" : "Like it ? Give it a rating"} Review
                </p>
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <StarPicker
                                    rating={field.value}
                                    onChange={field.onChange}
                                    disabled={isPreview}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Want to leave a review ?"
                                    disabled={isPreview}
                                    {...field}
                                    className="w-full resize-none p-2 border border-gray-300 rounded-md"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!isPreview && (
                    <Button
                        variant="elevated"
                        disabled={createReview.isPending || updateReview.isPending}
                        type="submit"
                        className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
                    >
                        {initialData ? "Update Review" : "Post Review"}
                    </Button>
                )}
            </form>
            {isPreview && (
                <Button
                    variant="elevated"
                    disabled={false}
                    type="button"
                    size="lg"
                    className="w-fit mt-4"
                    onClick={() => setIsPreview(false)}
                >
                    Edit
                </Button>
            )}
        </Form>
    )
}

export const ReviewFormSkeleton = () => {
    return (
        <div className="flex flex-col gap-y-4">
            <p className="font-medium">
                Your rating : Like it ? Give it a rating
            </p>
            <StarPicker
                disabled
            />
            <Textarea
                placeholder="Want to leave a review ?"
                className="w-full resize-none p-2 border border-gray-300 rounded-md"
            />
            <Button
                variant="elevated"
                disabled
                type="submit"
                className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
            >
                Post Review
            </Button>
        </div>
    )
}
