import { InputHTMLAttributes } from "react"

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({ ...props }) => {
    return (
        <input {...props} />
    )
}