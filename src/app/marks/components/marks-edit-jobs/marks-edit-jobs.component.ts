import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, ElementRef, ViewChild, Input } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { IMarksModule, IMarksTreeValues } from '../../models/module-jobs.model';
import { MarksApiService } from '../../services/marks-api.service';

export class ModuleNode {
  public id: string;
  public moduleName: string;
  public jobs: ModuleNode[];
  public jobValue: string;
  public moduleId: string;
}

/** Flat item node with expandable and level information */
export class ModuleFlatNode {
  public item: string;
  public level: number;
  public expandable: boolean;
  public id: string;
  public parentId: string;
}

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has jobs items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  public dataChange = new BehaviorSubject<ModuleNode[]>([]);

  get data(): ModuleNode[] {
    return this.dataChange.value;
  }

  constructor(private api: MarksApiService) {
    this.initialize();
  }

  public initialize() {
    // Build the tree nodes from Json object. The result is a list of `ModuleNode` with nested
    //     file node as jobs.
    this.api.getModulesAndGroups('1', '2').subscribe((data: IMarksTreeValues[]) => {
      // this.mainData = data;
      this.dataChange.next((data as unknown) as ModuleNode[]);
    });
  }

  /** Add an item to to-do list */
  public insertItem(parent: ModuleNode, nodeFrom: ModuleNode): ModuleNode {
    console.log(parent, nodeFrom);
    const newItem = { ...nodeFrom } as ModuleNode;

    if ((nodeFrom.jobs && parent) || !parent.jobs) {
      return;
    }
    parent.jobs.push(newItem);
    this.dataChange.next(this.data);
    return newItem;
  }

  public insertItemAbove(nodeTo: ModuleNode, nodeFrom: ModuleNode): ModuleNode {
    const parentNode = this.getParentFromNodes(nodeTo);

    const newItem = { ...nodeFrom } as ModuleNode;
    if (nodeFrom.jobs && parentNode) {
      return;
    }
    if (parentNode != null) {
      parentNode.jobs.splice(parentNode.jobs.indexOf(nodeTo), 0, newItem);
    } else {
      this.data.splice(this.data.indexOf(nodeTo), 0, newItem);
    }
    this.dataChange.next(this.data);
    return newItem;
  }

  public insertItemBelow(nodeTo: ModuleNode, nodeFrom: ModuleNode): ModuleNode {
    const parentNode = this.getParentFromNodes(nodeTo);

    const newItem = { ...nodeFrom } as ModuleNode;
    if (nodeFrom.jobs && parentNode) {
      return;
    }
    if (parentNode != null) {
      parentNode.jobs.splice(parentNode.jobs.indexOf(nodeTo) + 1, 0, newItem);
    } else {
      this.data.splice(this.data.indexOf(nodeTo) + 1, 0, newItem);
    }
    this.dataChange.next(this.data);
    return newItem;
  }

  public getParentFromNodes(node: ModuleNode): ModuleNode {
    for (let i = 0; i < this.data.length; ++i) {
      const currentRoot = this.data[i];
      const parent = this.getParent(currentRoot, node);
      if (parent != null) {
        return parent;
      }
    }
    return null;
  }

  public getParent(currentRoot: ModuleNode, node: ModuleNode): ModuleNode {
    if (currentRoot.jobs && currentRoot.jobs.length > 0) {
      for (let i = 0; i < currentRoot.jobs.length; ++i) {
        const child = currentRoot.jobs[i];
        if (child === node) {
          return currentRoot;
        } else if (child.jobs && child.jobs.length > 0) {
          const parent = this.getParent(child, node);
          if (parent != null) {
            return parent;
          }
        }
      }
    }
    return null;
  }

  public updateItem(node: ModuleNode, name: string) {
    // node.item = name;
    this.dataChange.next(this.data);
  }

  public deleteItem(node: ModuleNode) {
    this.deleteNode(this.data, node);
    this.dataChange.next(this.data);
  }

  public copyPasteItem(from: ModuleNode, to: ModuleNode): ModuleNode {
    const newItem = this.insertItem(to, from);
    // if (from.jobs) {
    //   from.jobs.forEach(child => {
    //     this.copyPasteItem(child, newItem);
    //   });
    // }
    return newItem;
  }

  public copyPasteItemAbove(from: ModuleNode, to: ModuleNode): ModuleNode {
    const newItem = this.insertItemAbove(to, from);
    // if (newItem && from.jobs) {
    //   from.jobs.forEach(child => {
    //     this.copyPasteItem(child, newItem);
    //   });
    // }
    return newItem;
  }

  public copyPasteItemBelow(from: ModuleNode, to: ModuleNode): ModuleNode {
    const newItem = this.insertItemBelow(to, from);
    // if (newItem && from.jobs) {
    //   from.jobs.forEach(child => {
    //     this.copyPasteItem(child, newItem);
    //   });
    // }
    return newItem;
  }

  public deleteNode(nodes: ModuleNode[], nodeToDelete: ModuleNode) {
    const index = nodes.indexOf(nodeToDelete, 0);
    if (index > -1) {
      nodes.splice(index, 1);
    } else {
      nodes.forEach(node => {
        if (node.jobs && node.jobs.length > 0) {
          this.deleteNode(node.jobs, nodeToDelete);
        }
      });
    }
  }
}

@Component({
  selector: 'app-marks-edit-jobs',
  templateUrl: './marks-edit-jobs.component.html',
  styleUrls: ['./marks-edit-jobs.component.scss'],
  providers: [ChecklistDatabase],
})
export class MarksEditJobsComponent {
  @Input() public selectedGroupId: string;
  @Input() public selectedDisciplineId: string;
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  public flatNodeMap = new Map<ModuleFlatNode, ModuleNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  public nestedNodeMap = new Map<ModuleNode, ModuleFlatNode>();

  /** A selected parent node to be inserted */
  public selectedParent: ModuleFlatNode | null = null;

  /** The new item's name */
  public newItemName = '';

  public treeControl: FlatTreeControl<ModuleFlatNode>;

  public treeFlattener: MatTreeFlattener<ModuleNode, ModuleFlatNode>;

  public dataSource: MatTreeFlatDataSource<ModuleNode, ModuleFlatNode>;

  /** The selection for checklist */
  public checklistSelection = new SelectionModel<ModuleFlatNode>(true /* multiple */);

  /* Drag and drop */
  public dragNode: any;
  public dragNodeExpandOverWaitTimeMs = 500;
  public dragNodeExpandOverNode: any;
  public dragNodeExpandOverTime: number = 0;
  public dragNodeExpandOverArea: string;
  @ViewChild('emptyItem') public emptyItem: ElementRef;

  constructor(private database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<ModuleFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      // this.dataSource.data = [];
      this.dataSource.data = data;
    });
  }

  public getLevel = (node: ModuleFlatNode) => node.level;

  public isExpandable = (node: ModuleFlatNode) => node.expandable;

  public getChildren = (node: ModuleNode): ModuleNode[] => node.jobs;

  public hasChild = (_: number, _nodeData: ModuleFlatNode) => _nodeData.expandable;

  public hasNoContent = (_: number, _nodeData: ModuleFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  public transformer = (node: ModuleNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.id === node.id ? existingNode : new ModuleFlatNode();
    flatNode.item = node.jobs ? node.moduleName : node.jobValue;
    flatNode.level = level;
    flatNode.expandable = node.jobs && node.jobs.length > 0;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected */
  public descendantsAllSelected(node: ModuleFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  public descendantsPartiallySelected(node: ModuleFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  public todoItemSelectionToggle(node: ModuleFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  /** Select the category so we can insert the new item. */
  public addNewItem(node: ModuleFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    // this.database.insertItem(parentNode, );
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  public saveNode(node: ModuleFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode, itemValue);
  }

  public handleDragStart(event, node) {
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
    event.dataTransfer.setData('foo', 'bar');
    event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
    this.dragNode = node;
    this.treeControl.collapse(node);
  }

  public handleDragOver(event, node) {
    event.preventDefault();

    const y = event.offsetY;

    if (this.dragNodeExpandOverTime !== y) {
      // console.log(111);
      this.dragNodeExpandOverTime = y;

      // Handle node expand
      if (node !== this.dragNodeExpandOverNode) {
        //   if (this.dragNode !== node && !this.treeControl.isExpanded(node)) {
        //     if (new Date().getTime() - this.dragNodeExpandOverTime > this.dragNodeExpandOverWaitTimeMs) {
        //       this.treeControl.expand(node);
        //     }
        //   }
        // } else {
        this.dragNodeExpandOverNode = node;
        // this.dragNodeExpandOverTime = new Date().getTime();
      }

      // Handle drag area
      // const percentageX = event.offsetX / event.target.clientWidth;
      const percentageY = y / event.target.clientHeight;
      if (percentageY < 0.25) {
        this.dragNodeExpandOverArea = 'above';
      } else if (percentageY > 0.75) {
        this.dragNodeExpandOverArea = 'below';
      } else {
        this.dragNodeExpandOverArea = 'center';
      }
    }
  }

  public handleDrop(event, node) {
    event.preventDefault();
    if (node !== this.dragNode) {
      let newItem: ModuleNode;
      if (this.dragNodeExpandOverArea === 'above') {
        newItem = this.database.copyPasteItemAbove(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
      } else if (this.dragNodeExpandOverArea === 'below') {
        newItem = this.database.copyPasteItemBelow(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
      } else {
        newItem = this.database.copyPasteItem(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
      }
      if (newItem) {
        this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
        this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem));
      } else {
        alert('You cannot add module into another module');
      }
    }
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

  public handleDragEnd(event) {
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }
}
