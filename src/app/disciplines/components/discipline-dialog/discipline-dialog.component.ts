import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  public children: TodoItemNode[];
  public item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  public item: string;
  public level: number;
  public expandable: boolean;
}

const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null,
    },
  },
  Reminders: ['Cook dinner', 'Read the Material Design spec', 'Upgrade Application to Angular'],
};

@Component({
  selector: 'app-discipline-dialog',
  templateUrl: './discipline-dialog.component.html',
  styleUrls: ['./discipline-dialog.component.scss'],
})
export class DisciplineDialogComponent {
  public flatNodeMap: Map<TodoItemFlatNode, TodoItemNode> = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  public nestedNodeMap: Map<TodoItemNode, TodoItemFlatNode> = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  public selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  public newItemName: string = '';

  public treeControl: FlatTreeControl<TodoItemFlatNode>;

  public treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  public dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  public checklistSelection: SelectionModel<TodoItemFlatNode> = new SelectionModel<TodoItemFlatNode>(
    true /* multiple */
  );

  constructor(
    public dialogRef: MatDialogRef<DisciplineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public disciplineId: number
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = this.buildFileTree(TREE_DATA, 0);
  }

  // tslint:disable-next-line: no-any
  public buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      // tslint:disable-next-line: no-any
      const value: any = obj[key];
      const node: TodoItemNode = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public getLevel = (node: TodoItemFlatNode) => node.level;

  public isExpandable = (node: TodoItemFlatNode) => node.expandable;

  public getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  public hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  public hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  public transformer = (node: TodoItemNode, level: number) => {
    const existingNode: TodoItemFlatNode = this.nestedNodeMap.get(node);
    const flatNode: TodoItemFlatNode =
      existingNode && existingNode.item === node.item ? existingNode : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  public descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants: TodoItemFlatNode[] = this.treeControl.getDescendants(node);
    const descAllSelected: boolean =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  public descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants: TodoItemFlatNode[] = this.treeControl.getDescendants(node);
    const result: boolean = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  public todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants: TodoItemFlatNode[] = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  public todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  public checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  public checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected: boolean = this.checklistSelection.isSelected(node);
    const descendants: TodoItemFlatNode[] = this.treeControl.getDescendants(node);
    const descAllSelected: boolean =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  public getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel: number = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex: number = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i: number = startIndex; i >= 0; i--) {
      const currentNode: TodoItemFlatNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
