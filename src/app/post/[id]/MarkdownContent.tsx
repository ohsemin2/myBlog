"use client";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import styles from "./page.module.css";

const remarkPlugins = [remarkGfm, remarkMath] as const;
const rehypePlugins = [rehypeKatex] as const;

const components: Components = {
  h1: (props) => <h1 className={styles.h1} {...props} />,
  h2: (props) => <h2 className={styles.h2} {...props} />,
  h3: (props) => <h3 className={styles.h3} {...props} />,
  h4: (props) => <h4 className={styles.h4} {...props} />,
  h5: (props) => <h5 className={styles.h5} {...props} />,
  h6: (props) => <h6 className={styles.h6} {...props} />,
  p: (props) => <p className={styles.p} {...props} />,
  a: (props) => <a className={styles.a} {...props} />,
  ul: (props) => <ul className={styles.ul} {...props} />,
  ol: (props) => <ol className={styles.ol} {...props} />,
  li: (props) => <li className={styles.li} {...props} />,
  blockquote: (props) => <blockquote className={styles.blockquote} {...props} />,
  code: ({ inline, ...props }: any) =>
    inline ? <code className={styles.inlineCode} {...props} /> : <code {...props} />,
  pre: (props) => <pre className={styles.pre} {...props} />,
  hr: (props) => <hr className={styles.hr} {...props} />,
  img: (props) => <img className={styles.img} {...props} />,
  table: (props) => <table className={styles.table} {...props} />,
  th: (props) => <th className={styles.th} {...props} />,
  td: (props) => <td className={styles.td} {...props} />,
};

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className={styles.content}>
      <ReactMarkdown
        remarkPlugins={[...remarkPlugins]}
        rehypePlugins={[...rehypePlugins]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
