import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

const components = {
	p: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement>>) => (
    	<p className="mb-3 leading-relaxed" {...props}>{props.children}</p>
  	),
  	strong: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) => (
    	<strong className="font-semibold text-[var(--color-gold)]" {...props}>{props.children}</strong>
  	),
  	em: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) => (
    	<em className="italic" {...props}>{props.children}</em>
  	),
  	a: (props: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
    	<a className="underline hover:opacity-90" target="_blank" rel="noopener noreferrer" {...props}>{props.children}</a>
  	),
  	ul: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLUListElement>>) => (
  	  <ul className="list-disc list-inside my-3 space-y-1" {...props}>{props.children}</ul>
  	),
  	ol: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLOListElement>>) => (
  	  <ol className="list-decimal list-inside my-3 space-y-1" {...props}>{props.children}</ol>
  	),
  	li: (props: React.PropsWithChildren<React.LiHTMLAttributes<HTMLLIElement>>) => (
  	  <li className="leading-relaxed" {...props}>{props.children}</li>
  	),
  	h1: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) => (
  	  <h1 className="text-2xl font-bold mt-4 mb-2" {...props}>{props.children}</h1>
  	),
  	h2: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) => (
  	  <h2 className="text-xl font-bold mt-4 mb-2" {...props}>{props.children}</h2>
  	),
  	h3: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>) => (
  	  <h3 className="text-lg font-bold mt-3 mb-1.5" {...props}>{props.children}</h3>
  	),
  	blockquote: (props: React.PropsWithChildren<React.BlockquoteHTMLAttributes<HTMLElement>>) => (
  	  <blockquote className="border-l-4 pl-3 my-3 opacity-90" {...props}>{props.children}</blockquote>
  	),
  	code: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) => (
  	  <code className={`px-1.5 py-0.5 rounded bg-black/30 ${props.className ?? ""}`}>{props.children}</code>
  	),
  	hr: () => <hr className="my-4 border-white/10" />,
};

type Props = {
  	readonly text: string;
  	readonly className?: string;
};

export function MarkdownText({ text, className }: Props): React.ReactElement {
	const normalizedText = (text ?? "")
    	.replace(/\r\n/g, "\n")
    	.replace(/\\n/g, "\n");

  return (
	<div className={className}>
		<ReactMarkdown
			remarkPlugins={[remarkGfm, remarkBreaks]}
			// No rehypeRaw to avoid rendering raw HTML; safe by default
			components={components as any}
		>
		{normalizedText}
		</ReactMarkdown>
	</div>
  );
}
