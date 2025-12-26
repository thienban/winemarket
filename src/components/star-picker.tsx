"use client"

import { StarIcon } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"

interface Props {
    rating?: number,
    onChange?: (rating: number) => void,
    disabled?: boolean,
    className?: string,
}

export const StarPicker = ({
    rating = 0,
    onChange,
    disabled = false,
    className,
}: Props) => {

    const [hoverRating, setHoverRating] = useState(0)

    const handleChange = (value: number) => {
        onChange?.(value)
    }

    return (
        <div className={
            cn("flex items-center",
                disabled && "opacity-50 cursor-not-allowed",
                className)}
        >
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    disabled={disabled}
                    className={cn(
                        "p-0.5 hover:scale-110 transition",
                        !disabled && "cursor-pointer"
                    )}
                    onClick={() => handleChange(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                >
                    <StarIcon
                        className={cn(
                            "size-5",
                            (hoverRating || rating) >= star
                                ? "fill-yellow-400 stroke-yellow-400"
                                : "stroke-yellow-400"
                        )}
                    />
                </button>
            ))}

        </div>
    )
}
