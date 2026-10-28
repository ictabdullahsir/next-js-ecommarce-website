import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

const components: Components = {
  h1: ({ node: _node, ...props }) => <h2 className="mt-12 font-serif text-3xl md:text-4xl" {...props} />,
  h2: ({ node: _node, ...props }) => <h2 className="mt-12 font-serif text-3xl" {...props} />,
  h3: ({ node: _node, ...props }) => <h3 className="mt-10 text-xl font-semibold" {...props} />,
  h4: ({ node: _node, ...props }) => <h4 className="mt-8 font-semibold" {...props} />,
  p: ({ node: _node, ...props }) => <p className="mt-6 leading-relaxed" {...props} />,
  ul: ({ node: _node, ...props }) => <ul className="mt-6 flex list-disc flex-col gap-2 pl-6" {...props} />,
  ol: ({ node: _node, ...props }) => <ol className="mt-6 flex list-decimal flex-col gap-2 pl-6" {...props} />,
  li: ({ node: _node, ...props }) => <li className="pl-1 leading-relaxed" {...props} />,
  blockquote: ({ node: _node, ...props }) => (
    <blockquote
      className="mt-8 border-l-2 border-primary pl-5 font-serif text-xl italic text-foreground"
      {...props}
    />
  ),
  a: ({ node: _node, href = '', ...props }) => {
    const external = /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        className="font-medium text-primary underline underline-offset-4 hover:text-foreground"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      />
    )
  },
  img: ({ node: _node, src, alt = '' }) =>
    typeof src === 'string' ? (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary author-supplied images with unknown dimensions
      <img src={src} alt={alt} loading="lazy" className="mt-8 w-full rounded-xl bg-secondary" />
    ) : null,
  hr: () => <hr className="my-12 border-border" />,
  code: ({ node: _node, ...props }) => (
    <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm" {...props} />
  ),
  pre: ({ node: _node, ...props }) => (
    <pre className="mt-6 overflow-x-auto rounded-lg bg-secondary p-4 text-sm" {...props} />
  ),
  table: ({ node: _node, ...props }) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: ({ node: _node, ...props }) => <th className="border-b border-border p-2 text-left font-semibold" {...props} />,
  td: ({ node: _node, ...props }) => <td className="border-b border-border p-2" {...props} />,
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="text-pretty text-foreground/90 [&>*:first-child]:mt-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
