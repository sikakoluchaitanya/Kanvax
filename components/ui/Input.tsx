import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, icon, ...props }, ref) => {
        return (
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm',
                        'text-foreground placeholder:text-muted-foreground',
                        'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'transition-all duration-200',
                        icon && 'pl-10',
                        error && 'border-destructive focus:ring-destructive/30 focus:border-destructive',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-xs text-destructive">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };

// Textarea
export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div>
                <textarea
                    className={cn(
                        'flex min-h-[100px] w-full rounded-lg border border-input bg-card px-3 py-2 text-sm',
                        'text-foreground placeholder:text-muted-foreground',
                        'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'transition-all duration-200 resize-none',
                        error && 'border-destructive focus:ring-destructive/30 focus:border-destructive',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-xs text-destructive">{error}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export { Textarea };

// Label
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, required, children, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    'text-sm font-medium text-foreground leading-none',
                    'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                    className
                )}
                {...props}
            >
                {children}
                {required && <span className="text-destructive ml-1">*</span>}
            </label>
        );
    }
);

Label.displayName = 'Label';

export { Label };
