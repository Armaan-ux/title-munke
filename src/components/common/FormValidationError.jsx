export function FormValidationError({message, color}) {
    return (
        <span className={`${color ? color : "text-destructive"} text-sm`}>*{message}</span>
    )
}