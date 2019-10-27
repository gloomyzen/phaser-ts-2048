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

    public static getElement(needle:string, haystack: Phaser.GameObjects.GameObject[]) {
        if (typeof haystack == 'undefined') return -1;
        let length: number = haystack.length;
        for(let i: number = 0; i < length; i++) {
            if(haystack[i].type == needle) return i;
        }
        return -1;
    }
}