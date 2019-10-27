export class ArrayHelper {
    public static inArray(needle, haystack): boolean {
        if (typeof haystack == 'undefined') return false;
        let length: number = haystack.length;
        for(let i: number = 0; i < length; i++) {
            if(typeof haystack[i] == 'object') {
                if(this.arrayCompare(haystack[i], needle)) return true;
            } else {
                if(haystack[i] == needle) return true;
            }
        }
        return false;
    }

    public static arrayCompare(a1, a2): boolean {
        if (a1.length != a2.length) return false;
        let length: number = a2.length;
        for (let i: number = 0; i < length; i++) {
            if (a1[i] !== a2[i]) return false;
        }
        return true;
    }

    public static getElementIndex(needle:string, haystack: Phaser.GameObjects.GameObject[]): number|boolean {
        if (typeof haystack == 'undefined') return false;
        let length: number = haystack.length;
        for(let i: number = 0; i < length; i++) {
            if(haystack[i].type == needle) return i;
        }
        return false;
    }

    public static getElementByType(needle:string, haystack: Phaser.GameObjects.GameObject[]): Phaser.GameObjects.GameObject|object {
        if (typeof haystack == 'undefined') return {};
        let length: number = haystack.length;
        for(let i: number = 0; i < length; i++) {
            if(haystack[i].type == needle) return haystack[i];
        }
        return {};
    }
}