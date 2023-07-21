/*
GS1 Parser
A very simple GS1 parser that can interpret basic barcode scanned GS1 Data Matricies.
Designed around idenitfying dental implants and using the YDHAA M800D Barcode scanner

This has not been verified to the full GS1 spec and does not support many AIs.
This also does not support chaining or other starting phrases.
Also, finally, does not properly support variable length strings (Although i cant test this, i have a suspicion the barcode scanner is preprocessing the matrix so i cannot see this detail)


John Sakoutis (johnpsakoutis@gmail.com)
Github: RoundsToThree

Available as Open Source Software (With attribution please if you use it)
July 20th, 2023
*/

export interface GS1 {
    GTIN: string | null,
    BatchNumber: string | null,
    ProductionDate: Date | null,
    ExpirationDate: Date | null,
    BestBeforeDate: Date | null,
    SerialNumber: string | null,
}

/**
 * Converts a scanned GS1 string into a GS1 element
 * 
 * @param {string} gs1 The string to decode 
 * @returns {GS1} A GS1 element with the scanned data present.
 */
export function parseGS1(gs1: string): GS1 {
    const output: GS1 = {
        GTIN: null,
        BatchNumber: null,
        ProductionDate: null,
        ExpirationDate: null,
        BestBeforeDate: null,
        SerialNumber: null,
    };


    // Process the input string
    let index = 0;

    // Filter out a possible starting string
    // ]d2
    if (gs1.substring(0, 3) == ']d2')
        index += 3;

    while (index <= gs1.length) {
        // Read first two bytes
        const init: number = parseInt(gs1.substring(index, index + 2));
        switch (init) {
            case 1: // 01 -> GTIN

                // GTIN is 14 digits
                output.GTIN = gs1.substring(index + 2, index + 16);
                index += 16;

                break;
            case 10: // 10 -> Batch Number
                // Read up to 20 bytes ahead.
                output.BatchNumber = gs1.substring(index + 2, Math.min(gs1.length, index + 22));
                index += Math.min(gs1.length, index + 22);
                break;
            case 11: // 11 -> Production Date

                let y: number = 2000 + parseInt(gs1.substring(index + 2, index + 4));
                let m: number = parseInt(gs1.substring(index + 4, index + 6));
                let d: number = parseInt(gs1.substring(index + 6, index + 8));

                // YYMMDD
                output.ProductionDate = new Date(y, m - 1, d);
                index += 8;
                break;
            case 15: // 15 -> Best Before Date

                y = 2000 + parseInt(gs1.substring(index + 2, index + 4));
                m = parseInt(gs1.substring(index + 4, index + 6));
                d = parseInt(gs1.substring(index + 6, index + 8));

                // YYMMDD
                output.BestBeforeDate = new Date(y, m - 1, d);
                index += 8;

                break;
            case 17: // 17 -> Expiry Date
                y = 2000 + parseInt(gs1.substring(index + 2, index + 4));
                m = parseInt(gs1.substring(index + 4, index + 6));
                d = parseInt(gs1.substring(index + 6, index + 8));

                // YYMMDD
                output.ExpirationDate = new Date(y, m - 1, d);
                index += 8;

                break;
            case 21: // 21 -> Serial Number
                // Read up to 20 bytes ahead.
                output.SerialNumber = gs1.substring(index + 2, Math.min(gs1.length, index + 22));
                index += Math.min(gs1.length, index + 22);
                break;
            default:
                index += 2;
        }
    }

    return output;
}