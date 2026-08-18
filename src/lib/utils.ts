export function cn(...inputs: any[]): string {
  return inputs
    .flat()
    .filter(Boolean)
    .map((x) => {
      if (typeof x === 'string') return x;
      if (typeof x === 'object' && x !== null) {
        return Object.entries(x)
          .filter(([_, v]) => Boolean(v))
          .map(([k]) => k)
          .join(' ');
      }
      return '';
    })
    .join(' ');
}

export function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export function formatEventDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function generateICS(event: {
  title: string;
  description: string;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  const cleanTitle = event.title.replace(/[,;]/g, ' ');
  const cleanDesc = event.description.replace(/[,;\n]/g, ' ');
  const cleanVenue = event.venue.replace(/[,;]/g, ' ');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CampusPulse BMU//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:${cleanTitle}`,
    `DESCRIPTION:${cleanDesc}`,
    `LOCATION:${cleanVenue} (BML Munjal University)`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${cleanTitle.toLowerCase().replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
