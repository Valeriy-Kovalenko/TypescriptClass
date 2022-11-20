interface ITreeItem {
  id: number | string;
  parent: number | string;
  type?: string | null;
}

class TreeStore {
  private readonly itemsMap: Map<ITreeItem['id'], [ITreeItem, ITreeItem[]]> = new Map();

  constructor(private readonly items: ITreeItem[]) {
    const parentsMap = new Map();
    items.forEach(item => {
      if (parentsMap.has(item.parent)) {
        const value = parentsMap.get(item.parent);
        parentsMap.set(item.parent, [...value, item]);
        return;
      }
      parentsMap.set(item.parent, [item]);
    });

    items.forEach(item => {
      const itemChildren = parentsMap.get(item.id);
      this.itemsMap.set(item.id, [item, itemChildren]);
    });
  }

  public getAll(): ITreeItem[] {
    return this.items;
  }

  public getItem(id: ITreeItem['id']): ITreeItem {
    return this.itemsMap.get(id)[0];
  }

  public getChildren(id: ITreeItem['id']): ITreeItem[] {
    const children = this.itemsMap.get(id)[1];
    return children ? children : [];
  }

  public getAllChildren(id: ITreeItem['id']): ITreeItem[] {
    const itemChildren = this.getChildren(id);

    if (!itemChildren) {
      return [];
    }

    const result: ITreeItem[] = [...itemChildren];

    for (const child of itemChildren) {
      result.push(...this.getAllChildren(child.id));
    }

    return result;
  }

  public getAllParents(id: ITreeItem['id']): ITreeItem[] {
    const allParents: ITreeItem[] = [];
    let curParentNum = this.getItem(id).parent;

    while (curParentNum !== 'root') {
      const curParentItem = this.getItem(curParentNum);
      allParents.push(curParentItem);
      curParentNum = curParentItem.parent;
    }

    return allParents;
  }
}

const items: ITreeItem[] = [
  { id: 1, parent: 'root' },
  { id: 2, parent: 1, type: 'test' },
  { id: 3, parent: 1, type: 'test' },

  { id: 4, parent: 2, type: 'test' },
  { id: 5, parent: 2, type: 'test' },
  { id: 6, parent: 2, type: 'test' },

  { id: 7, parent: 4, type: null },
  { id: 8, parent: 4, type: null },
];

const ts = new TreeStore(items);

// console.log(ts.getAll());
// console.log(ts.getItem(5));
// console.log(ts.getChildren(4));
// console.log(ts.getAllChildren(1));
// console.log(ts.getAllParents(7));
