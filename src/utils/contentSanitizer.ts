import DOMPurify from 'isomorphic-dompurify';
import React from 'react';

// Secure HTML sanitization configuration
const sanitizeConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody', 
    'tr', 'td', 'th', 'div', 'span', 'pre', 'code'
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style'
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORBID_SCRIPT: true,
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  ADD_ATTR: ['target'],
  ADD_TAGS: [],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false,
  SANITIZE_DOM: true,
  WHOLE_DOCUMENT: false,
  FORCE_BODY: false
};

export const sanitizeHTML = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  // First pass: DOMPurify sanitization
  let sanitized = DOMPurify.sanitize(html, sanitizeConfig);
  
  // Second pass: Additional security measures
  // Remove any remaining javascript: protocols
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: URIs except for images
  sanitized = sanitized.replace(/data:(?!image\/)/gi, '');
  
  // Ensure external links have proper security attributes
  sanitized = sanitized.replace(
    /<a\s+([^>]*href=["'][^"']*["'][^>]*)>/gi,
    (match, attrs) => {
      if (attrs.includes('http') && !attrs.includes('rel=')) {
        return match.replace('>', ' rel="noopener noreferrer">');
      }
      return match;
    }
  );
  
  return sanitized;
};

export const stripHTML = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
};

export const validateInput = (input: string, maxLength: number = 10000): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Trim and limit length
  const trimmed = input.trim().substring(0, maxLength);
  
  // Basic XSS prevention for plain text inputs
  return trimmed
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript protocols
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Component for safely rendering HTML content
export const SafeHTMLRenderer = ({ content, className = "" }: { content: string; className?: string }) => {
  const sanitizedContent = sanitizeHTML(content);
  
  return React.createElement('div', {
    className,
    dangerouslySetInnerHTML: { __html: sanitizedContent }
  });
};