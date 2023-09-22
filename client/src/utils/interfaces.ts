export type ClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

// Generic API handlers
export type ResponseHandler = (data: any) => void;
export type ErrorHandler = (error: any) => void;
export type AuthKey = string | null | undefined;
