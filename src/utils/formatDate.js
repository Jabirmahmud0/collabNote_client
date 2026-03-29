import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

export const formatDate = (dateString, type = 'relative') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (type === 'relative') {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  
  if (type === 'short') {
    if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`;
    if (isYesterday(date)) return `Yesterday at ${format(date, 'h:mm a')}`;
    return format(date, 'MMM d, yyyy');
  }
  
  if (type === 'full') {
    return format(date, 'MMMM d, yyyy h:mm a');
  }
  
  return format(date, 'MMM d, yyyy');
};
