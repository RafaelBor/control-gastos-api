
export class Formatter {
    static currency(value: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0, // Sin decimales
            maximumFractionDigits: 0  // Sin decimales
        }).format(value);
    }
}