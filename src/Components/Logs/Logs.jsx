// Logs.jsx
import React, { useEffect, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './logs.css';

/**
 * Convert Obsidian image embeds to standard Markdown image syntax, with optional size.
 * Supports:
 *  - ![[cover.png]]
 *  - ![[cover.png|My caption]]
 *  - ![[cover.png|My caption|300]]
 *  - ![[cover.png|300]]  (size only)
 *  - ![[Pasted image 20251014164249.jpg|Backyard flame test, rev A|300]]
 *
 * IMPORTANT: We wrap the URL in <...> so filenames with spaces work in Markdown.
 */
function normalizeObsidianEmbeds(md) {
  if (!md) return md;

  // file | (caption or size) | (size)
  const obsidianImg = /!\[\[([^|\]]+)(?:\|([^\]|]*))?(?:\|(\d+))?\]\]/g;

  return md.replace(obsidianImg, (_, file, captionOrSize, size3) => {
    let caption = '';
    let size = '';

    if (captionOrSize) {
      if (/^\d+$/.test(captionOrSize.trim())) {
        size = captionOrSize.trim();
      } else {
        caption = captionOrSize.trim();
      }
    }
    if (size3) size = size3.trim();

    const alt = caption; // accessibility default
    const titleParts = [];
    if (caption) titleParts.push(caption);
    if (size) titleParts.push(`w=${size}`);
    const title = titleParts.length ? ` "${titleParts.join('|')}"` : '';

    // ✅ Wrap path with <...> so spaces are valid in markdown destination
    return `![${alt}](<${file}>${title})`;
  });
}

const Logs = ({ projectId }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/data/projects.json')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data[projectId]?.logs || []);
      });
  }, [projectId]);

  const normalizedLogs = useMemo(() => {
    return (logs || []).map((log) => ({
      ...log,
      normalizedContent: normalizeObsidianEmbeds(log.content || ''),
    }));
  }, [logs]);

  if (!normalizedLogs.length) return <p>No logs yet.</p>;

  return (
    <div className="logs-container">
      {normalizedLogs.map((log, i) => (
        <div key={i} className="log-entry">
          <h3>
            {log.filename} | {log.date ? new Date(log.date).toLocaleDateString() : '—'}
          </h3>

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img({ node, ...props }) {
                const rawSrc = (props.src || '').trim();
                const alt = props.alt || '';

                // title may look like: "My caption|w=300" or just "My caption" or "|w=300"
                let rawTitle =
                  (node && node.properties && node.properties.title) ||
                  props.title ||
                  '';

                let caption = '';
                let widthPx;

                if (rawTitle) {
                  const sizeMatch = rawTitle.match(/\|w=(\d+)/);
                  if (sizeMatch) {
                    widthPx = parseInt(sizeMatch[1], 10);
                    caption = rawTitle.replace(/\|w=\d+/, '').trim();
                  } else {
                    caption = rawTitle.trim();
                  }
                }

                // Resolve relative paths to project folder
                const isAbsolute = /^https?:\/\//i.test(rawSrc) || rawSrc.startsWith('/');
                const resolved = isAbsolute ? rawSrc : `/content/${projectId}/${rawSrc}`;

                // ✅ URL-encode so spaces become %20 for the browser
                const finalSrc = encodeURI(resolved);

                const imgEl = (
                  <img
                    src={finalSrc}
                    alt={alt}
                    loading="lazy"
                    style={
                      widthPx
                        ? { width: `${widthPx}px`, height: 'auto', maxWidth: '100%' }
                        : { maxWidth: '100%', height: 'auto' }
                    }
                  />
                );

                if (caption) {
                  return (
                    <figure className="md-figure">
                      {imgEl}
                      <figcaption>{caption}</figcaption>
                    </figure>
                  );
                }
                return imgEl;
              },
            }}
          >
            {log.normalizedContent}
          </ReactMarkdown>

          {Array.isArray(log.images) &&
            log.images.map((img, idx) => (
              <img
                key={idx}
                src={encodeURI(`/content/${projectId}/${img}`)}
                alt={`log-${i}-img-${idx}`}
                style={{ maxWidth: '100%', marginTop: '0.5rem' }}
                loading="lazy"
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default Logs;
