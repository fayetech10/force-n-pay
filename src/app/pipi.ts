import { Pipe, PipeTransform } from "@angular/core";

// phone.format.pipe.ts
@Pipe({ name: 'phoneFormat' })
export class PhoneFormatPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return '';
        return value.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
    }
}

// iban.format.pipe.ts
@Pipe({ name: 'ibanFormat' })
export class IbanFormatPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return '';
        return value.replace(/(.{4})/g, '$1 ').trim();
    }
}