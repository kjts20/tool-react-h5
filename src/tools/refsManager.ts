/**
 * react引用管理器
 */
import { createRef } from 'react';

export class RefsManager {
    // ref仓库
    private refInsStore;

    constructor() {
        this.refInsStore = {};
    }

    // 获取引用
    get(refName) {
        this.clearNullRefs();
        if (this.refInsStore[refName] && this.refInsStore[refName].length > 0) {
            return this.refInsStore[refName][0].current;
        }
        return null;
    }

    // 获取所有
    getAll(refName) {
        this.clearNullRefs();
        if (this.refInsStore[refName] && this.refInsStore[refName].length > 0) {
            return this.refInsStore[refName].map(i => i.current);
        }
        return [];
    }

    // 创建引用
    linkRef(refName) {
        const refIns = createRef();
        this.refInsStore[refName] = this.refInsStore[refName] || [];
        this.refInsStore[refName].push(refIns);
        return refIns;
    }

    // 删除引用
    removeRef(refName) {
        delete this.refInsStore[refName];
        return true;
    }

    // 清空引用
    clearNullRefs() {
        Object.keys(this.refInsStore).forEach(refName => {
            const filteredInsList = this.refInsStore[refName].filter(insRef => !!insRef.current);
            if (filteredInsList.length > 0) {
                this.refInsStore[refName] = filteredInsList;
            } else {
                delete this.refInsStore[refName];
            }
        });
    }
}
