import type { ComponentProps } from "react";
import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { parseSizedImageUrl } from "@/shared/lib/markdownImage";
import "katex/dist/katex.min.css";
import styles from "./page.module.css";

const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeKatex];

function isOptimizableImage(src: string) {
  return (
    src.startsWith("/") ||
    src.startsWith("https://stxfjbtmbbnvadfusidi.supabase.co/storage/v1/object/public/")
  );
}

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
  code: ({ inline, ...props }: ComponentProps<"code"> & { inline?: boolean }) =>
    inline ? <code className={styles.inlineCode} {...props} /> : <code {...props} />,
  pre: (props) => <pre className={styles.pre} {...props} />,
  hr: (props) => <hr className={styles.hr} {...props} />,
  img: ({ src, alt = "", title }: ComponentProps<"img">) => {
    const rawSrc = typeof src === "string" ? src : "";
    const { src: finalSrc, widthPct } = parseSizedImageUrl(rawSrc);
    const imageStyle = { width: `${widthPct}%`, height: "auto" };

    if (isOptimizableImage(finalSrc)) {
      return (
        <Image
          src={finalSrc}
          alt={alt}
          title={title}
          className={styles.img}
          width={1200}
          height={675}
          sizes={`(max-width: 768px) ${widthPct}vw, ${Math.round(736 * widthPct / 100)}px`}
          style={imageStyle}
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={finalSrc}
        alt={alt}
        title={title}
        className={styles.img}
        style={imageStyle}
      />
    );
  },
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
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
