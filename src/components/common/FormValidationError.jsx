export function FormValidationError({message}) {
    return (
        <span className="text-destructive text-sm">*{message}</span>
    )
}