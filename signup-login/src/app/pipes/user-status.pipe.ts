import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userStatus'
})
export class UserStatusPipe implements PipeTransform {
    transform(value: boolean, type: 'class' | 'label'): string {
        if (type === 'class') {
            return value ? 'status-active' : 'status-inactive';
        } else if (type === 'label') {
            return value ? 'Active' : 'Inactive';
        }
        return 'Unknown'; // Default case if value is not true/false
    }
}
