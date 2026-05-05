import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: true, // This is the default, ensuring high performance
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date | number | null | undefined): string {
    if (!value) return 'N/A';

    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const key in intervals) {
      const counter = Math.floor(seconds / intervals[key]);
      if (counter > 0) {
        return `Joined ${counter} ${key}${counter === 1 ? '' : 's'} ago`;
      }
    }

    return 'Just now';
  }
}
