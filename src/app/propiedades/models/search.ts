export class Search {
    id: number;
    checkin: Date;
    checkout: Date;
    huespedes: number;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.checkin = obj && obj.checkin || null;
        this.checkout = obj && obj.checkout || null;
        this.huespedes = obj && obj.huespedes || null;
    }

}