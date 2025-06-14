
import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'li', 'ul', 'ol', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'class'],
    ALLOW_DATA_ATTR: false
  });
};

export const formatContent = (content: string): string => {
  const formatted = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-3 text-gray-800 dark:text-gray-100">$1</h3>')
    .replace(/^- (.*$)/gm, '<li class="ml-6 mb-2">• $1</li>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>')
    .replace(/\n/g, '<br>');
  
  return sanitizeHtml(formatted);
};
