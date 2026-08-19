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

export function formatGoogleCalendarDateTime(dateStr: string, timeStr?: string, isNextDay = false): string {
  try {
    let year = 2026, month = 8, day = 22;
    if (dateStr && dateStr.includes('-')) {
      const parts = dateStr.split('-').map(Number);
      if (parts.length === 3) {
        year = parts[0];
        month = parts[1];
        day = parts[2];
      }
    } else if (dateStr && !isNaN(Date.parse(dateStr))) {
      const d = new Date(dateStr);
      year = d.getFullYear();
      month = d.getMonth() + 1;
      day = d.getDate();
    }

    if (isNextDay) {
      const d = new Date(year, month - 1, day + 1);
      year = d.getFullYear();
      month = d.getMonth() + 1;
      day = d.getDate();
    }

    let hours = 9, minutes = 0;
    if (timeStr) {
      const cleanTime = timeStr.replace(/Tonight|Today|Tomorrow|\(\+1 Day\)/gi, '').trim();
      const match = cleanTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const ampm = match[3]?.toUpperCase();
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        hours = h;
        minutes = m;
      }
    }

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}00`;
  } catch {
    return `20260822T090000`;
  }
}

export function createGoogleCalendarUrl(event: {
  title: string;
  description?: string;
  venue?: string;
  date: string;
  startTime?: string;
  endTime?: string;
}): string {
  const isNextDayEnd = (event.endTime || '').includes('+1 Day');
  const startGCal = formatGoogleCalendarDateTime(event.date, event.startTime || '09:00 AM');
  
  let endGCal: string;
  if (event.endTime) {
    endGCal = formatGoogleCalendarDateTime(event.date, event.endTime, isNextDayEnd);
  } else {
    // Default 1.5 hours duration
    const startHourMatch = (event.startTime || '09:00 AM').match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    let defaultEnd = '11:00 AM';
    if (startHourMatch) {
      let h = parseInt(startHourMatch[1], 10);
      const m = parseInt(startHourMatch[2], 10);
      const ampm = startHourMatch[3]?.toUpperCase() || 'AM';
      let totalMins = (ampm === 'PM' && h < 12 ? h + 12 : (ampm === 'AM' && h === 12 ? 0 : h)) * 60 + m + 90;
      let endH = Math.floor(totalMins / 60) % 24;
      let endM = totalMins % 60;
      let endAmpm = endH >= 12 ? 'PM' : 'AM';
      let displayH = endH % 12 || 12;
      defaultEnd = `${displayH}:${String(endM).padStart(2, '0')} ${endAmpm}`;
    }
    endGCal = formatGoogleCalendarDateTime(event.date, defaultEnd);
  }

  const fullVenue = event.venue 
    ? (event.venue.includes('BML Munjal') ? event.venue : `${event.venue}, BML Munjal University, NH-48, Sidhrawali, Gurugram, Haryana 122413`)
    : 'BML Munjal University, NH-48, Sidhrawali, Gurugram, Haryana 122413';

  const fullDetails = [
    event.description || '',
    '',
    '----------------------------------------',
    'CampusPulse BMU Operating System',
    'BML Munjal University (https://www.bmu.edu.in)',
  ].filter(Boolean).join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startGCal}/${endGCal}`,
    details: fullDetails,
    location: fullVenue,
    ctz: 'Asia/Kolkata',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function openGoogleCalendar(event: {
  title: string;
  description?: string;
  venue?: string;
  date: string;
  startTime?: string;
  endTime?: string;
}) {
  const url = createGoogleCalendarUrl(event);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function generateICS(event: {
  title: string;
  description?: string;
  venue?: string;
  date: string;
  startTime?: string;
  endTime?: string;
}) {
  const cleanTitle = event.title.replace(/[,;]/g, ' ');
  const cleanDesc = (event.description || '').replace(/[,;\n]/g, ' ');
  const cleanVenue = (event.venue || 'BML Munjal University').replace(/[,;]/g, ' ');

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

export function generateBatchICS(events: {
  title: string;
  description?: string;
  venue?: string;
  date: string;
  startTime?: string;
  endTime?: string;
}[], filename = 'bmu_campus_schedule.ics') {
  const vevents = events.map((event) => {
    const cleanTitle = event.title.replace(/[,;]/g, ' ');
    const cleanDesc = (event.description || '').replace(/[,;\n]/g, ' ');
    const cleanVenue = (event.venue || 'BML Munjal University').replace(/[,;]/g, ' ');
    return [
      'BEGIN:VEVENT',
      `SUMMARY:${cleanTitle}`,
      `DESCRIPTION:${cleanDesc}`,
      `LOCATION:${cleanVenue} (BML Munjal University)`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
    ].join('\r\n');
  }).join('\r\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CampusPulse BMU//Full Schedule Calendar//EN',
    'CALSCALE:GREGORIAN',
    vevents,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
