import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { Priority, Status } from '@/lib/types';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-secondary text-secondary-foreground',
                priority: '',
                status: '',
                tag: '',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> { }

export function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

// Priority Badge
interface PriorityBadgeProps {
    priority: Priority;
    size?: 'sm' | 'md';
}

const priorityConfig = {
    high: {
        label: 'High',
        className: 'priority-high',
    },
    medium: {
        label: 'Medium',
        className: 'priority-medium',
    },
    low: {
        label: 'Low',
        className: 'priority-low',
    },
};

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
    const config = priorityConfig[priority];

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full font-medium',
                config.className,
                size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'
            )}
        >
            {config.label}
        </span>
    );
}

// Status Badge
interface StatusBadgeProps {
    status: Status;
    showDot?: boolean;
}

const statusConfig = {
    todo: {
        label: 'To Do',
        dotColor: 'bg-status-todo',
        bgColor: 'bg-status-todo/10 text-status-todo',
    },
    'in-progress': {
        label: 'In Progress',
        dotColor: 'bg-status-progress',
        bgColor: 'bg-status-progress/10 text-status-progress',
    },
    done: {
        label: 'Done',
        dotColor: 'bg-status-done',
        bgColor: 'bg-status-done/10 text-status-done',
    },
};

export function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                config.bgColor
            )}
        >
            {showDot && (
                <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
            )}
            {config.label}
        </span>
    );
}

// Tag Badge
interface TagBadgeProps {
    name: string;
    color: string;
    onRemove?: () => void;
}

export function TagBadge({ name, color, onRemove }: TagBadgeProps) {
    return (
        <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{
                backgroundColor: `${color}15`,
                color: color,
            }}
        >
            <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: color }}
            />
            {name}
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="ml-0.5 hover:opacity-70"
                >
                    ×
                </button>
            )}
        </span>
    );
}
