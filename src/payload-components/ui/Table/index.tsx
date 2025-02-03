import type { HTMLAttributes } from "react";
import type {
	TableProps as AriaTableProps,
	TableHeaderProps as AriaTableHeaderProps,
	ColumnProps as AriaColumnProps,
	TableBodyProps as AriaTableBodyProps,
	RowProps as AriaRowProps,
	CellProps as AriaCellProps,
} from "react-aria-components";
import {
	composeRenderProps,
	Table as AriaTable,
	TableHeader as AriaTableHeader,
	Column as AriaColumn,
	TableBody as AriaTableBody,
	Row as AriaRow,
	Cell as AriaCell,
	Group as AriaGroup,
} from "react-aria-components";
import { ArrowDownUp } from "lucide-react";
import { cn } from "@/lib/cn";

function TableContainer({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("relative w-full overflow-auto", className)} {...props}>
			{children}
		</div>
	);
}

function Table({ className, ...props }: AriaTableProps) {
	return (
		<AriaTable
			className={composeRenderProps(className, (className) =>
				cn("w-full table-auto border-spacing-0 whitespace-normal text-left text-2xl", className),
			)}
			{...props}
		/>
	);
}

function TableHeader<T extends object>({ className, ...props }: AriaTableHeaderProps<T>) {
	return (
		<AriaTableHeader
			className={composeRenderProps(className, (className) =>
				cn("text-p-elevation-400 col-span-1 text-lg [&_th]:p-4", className),
			)}
			{...props}
		/>
	);
}

function Column({ className, children, ...props }: AriaColumnProps) {
	return (
		<AriaColumn className={composeRenderProps(className, (className) => cn(className))} {...props}>
			{composeRenderProps(children, (children, { allowsSorting }) => (
				<AriaGroup
					role="presentation"
					tabIndex={-1}
					className={cn("flex items-center gap-2", allowsSorting && "hover:text-p-elevation-700")}
				>
					{children}
					{allowsSorting && <ArrowDownUp />}
				</AriaGroup>
			))}
		</AriaColumn>
	);
}

function TableBody<T extends object>({ className, ...props }: AriaTableBodyProps<T>) {
	return (
		<AriaTableBody
			className={composeRenderProps(className, (className) =>
				cn("[&>*:nth-child(odd)]:bg-p-elevation-50", className),
			)}
			{...props}
		/>
	);
}

function Row<T extends object>({ className, ...props }: AriaRowProps<T>) {
	return (
		<AriaRow
			className={composeRenderProps(className, (className) => cn("", className))}
			{...props}
		/>
	);
}

function Cell({ className, ...props }: AriaCellProps) {
	return (
		<AriaCell
			className={composeRenderProps(className, (className) => cn("p-4", className))}
			{...props}
		/>
	);
}

export { TableContainer, Table, TableHeader, Column, TableBody, Row, Cell };
