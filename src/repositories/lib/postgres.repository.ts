
/** 
 * UNFINISHED
 * UNFINISHED
 * UNFINISHED
 * UNFINISHED
 * UNFINISHED
 * UNFINISHED
 * UNFINISHED
 */

interface Entity {
    id: number
}

export abstract class AbstactPostgresRepository {

    public constructor(private readonly entity: Entity) {}

    public async find() {
        /* Fetch all records */
    }
    public async findOne(arg: any) {
        /* select record from table */
    }

    public async deleteOne(arg: any) {
        /* delete record from table */
    }
}