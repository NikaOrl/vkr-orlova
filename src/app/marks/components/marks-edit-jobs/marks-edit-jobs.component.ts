import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IMarksModule } from '../../models/module-jobs.model';
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
  constructor(
    public item: string,
    public level: number,
    public expandable: boolean,
    public id: string,
    public parentId: string
  ) {}
}

@Component({
  selector: 'app-marks-edit-jobs',
  templateUrl: './marks-edit-jobs.component.html',
  styleUrls: ['./marks-edit-jobs.component.scss'],
})
export class MarksEditJobsComponent implements OnInit {
  @Input() public selectedGroupId: string;
  @Input() public selectedDisciplineId: string;

  public treeControl: FlatTreeControl<ModuleFlatNode>;
  public treeFlattener: MatTreeFlattener<ModuleNode, ModuleFlatNode>;
  public dataSource: MatTreeFlatDataSource<ModuleNode, ModuleFlatNode>;
  // expansion model tracks expansion state
  public expansionModel: SelectionModel<string> = new SelectionModel<string>(true);
  public dragging: boolean = false;
  // tslint:disable-next-line: no-any
  public expandTimeout: any;
  public expandDelay: number = 1000;
  public validateDrop: boolean = false;

  constructor(private api: MarksApiService) {}

  public ngOnInit(): void {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel, this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<ModuleFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.api.getModulesAndGroups(this.selectedDisciplineId, this.selectedGroupId).subscribe((data: IMarksModule[]) => {
      this.dataSource.data = data.map((module: IMarksModule) => ({
        ...module,
        id: `module-${module.id}`,
      })) as ModuleNode[];
    });
  }

  public transformer = (node: ModuleNode, level: number) => {
    return new ModuleFlatNode(
      node.jobs ? node.moduleName : node.jobValue,
      level,
      !!node.jobs,
      node.id,
      node.moduleId ? `module-${node.moduleId}` : null
    );
  };
  public hasChild = (_: number, _nodeData: ModuleFlatNode) => _nodeData.expandable;

  // DRAG AND DROP METHODS

  public shouldValidate(event: MatCheckboxChange): void {
    this.validateDrop = event.checked;
  }

  /**
   * This constructs an array of nodes that matches the DOM
   */
  public visibleNodes(): ModuleNode[] {
    const result: ModuleNode[] = [];

    function addExpandedChildren(node: ModuleNode, expanded: string[]): void {
      result.push(node);
      if (expanded.includes(node.id)) {
        node.jobs.map(child => addExpandedChildren(child, expanded));
      }
    }
    this.dataSource.data.forEach(node => {
      addExpandedChildren(node, this.expansionModel.selected);
    });
    return result;
  }

  /**
   * Handle the drop - here we rearrange the data based on the drop event,
   * then rebuild the tree.
   * */
  public drop(event: CdkDragDrop<string[]>): void {
    // ignore drops outside of the tree
    if (!event.isPointerOverContainer) return;

    // construct a list of visible nodes, this will match the DOM.
    // the cdkDragDrop event.currentIndex jives with visible nodes.
    // it calls rememberExpandedTreeNodes to persist expand state
    const visibleNodes: ModuleNode[] = this.visibleNodes();

    // deep clone the data source so we can mutate it
    const changedData: ModuleNode[] = JSON.parse(JSON.stringify(this.dataSource.data));

    // recursive find function to find siblings of node
    function findNodeSiblings(arr: ModuleNode[], id: string): ModuleNode[] {
      let result: ModuleNode[];
      let subResult: ModuleNode[];
      arr.forEach((item, i) => {
        if (item.id === id) {
          result = arr;
        } else if (item.jobs) {
          subResult = findNodeSiblings(item.jobs, id);
          if (subResult) result = subResult;
        }
      });
      return result;
    }

    // determine where to insert the node

    let nodeAtDest: ModuleNode =
      visibleNodes[event.previousIndex > event.currentIndex ? event.currentIndex : event.currentIndex + 1];
    let nodeAtDestFlatNode: ModuleFlatNode = this.treeControl.dataNodes.find(n => nodeAtDest.id === n.id);

    const node: ModuleFlatNode = event.item.data;

    if (node.parentId === nodeAtDestFlatNode.parentId) {
      nodeAtDest = visibleNodes[event.currentIndex];
      nodeAtDestFlatNode = this.treeControl.dataNodes.find(n => nodeAtDest.id === n.id);
    }
    const newSiblings: ModuleNode[] = findNodeSiblings(changedData, nodeAtDest.id);
    // console.log(visibleNodes, nodeAtDest.id, event.currentIndex);

    // console.log(findNodeSiblings(changedData, nodeAtDest.id));
    if (!newSiblings) return;
    const insertIndex: number = newSiblings.findIndex(s => s.id === nodeAtDest.id);

    // remove the node from its old place
    console.log('origin/destination', node, event.previousIndex, event.currentIndex, nodeAtDestFlatNode);

    const siblings: ModuleNode[] = findNodeSiblings(changedData, node.id);
    const siblingIndex: number = siblings.findIndex(n => n.id === node.id);
    const nodeToInsert: ModuleNode = siblings.splice(siblingIndex, 1)[0];
    if (nodeAtDest.id === nodeToInsert.id) return;

    // ensure validity of drop - must be same level

    // if (this.validateDrop && nodeAtDestFlatNode.level !== node.level) {
    if (node.id.match('module') && nodeAtDestFlatNode.level !== 0) {
      alert('You cannot add module into another module');
      return;
    }

    // insert node
    newSiblings.splice(insertIndex, 0, nodeToInsert);

    // rebuild tree with mutated data
    this.rebuildTreeForData(changedData);
  }

  /**
   * Experimental - opening tree nodes as you drag over them
   */
  public dragStart(): void {
    this.dragging = true;
  }
  public dragEnd(): void {
    this.dragging = false;
  }
  public dragHover(node: ModuleFlatNode): void {
    if (this.dragging) {
      clearTimeout(this.expandTimeout);
      this.expandTimeout = setTimeout(() => {
        this.treeControl.expand(node);
      }, this.expandDelay);
    }
  }
  public dragHoverEnd(): void {
    if (this.dragging) {
      clearTimeout(this.expandTimeout);
    }
  }

  /**
   * The following methods are for persisting the tree expand state
   * after being rebuilt
   */

  public rebuildTreeForData(data: ModuleNode[]): void {
    this.dataSource.data = data;
    this.expansionModel.selected.forEach(id => {
      const node: ModuleFlatNode = this.treeControl.dataNodes.find(n => n.id === id);
      this.treeControl.expand(node);
    });
  }
  private _getLevel = (node: ModuleFlatNode) => node.level;
  private _isExpandable = (node: ModuleFlatNode) => node.expandable;
  private _getChildren = (node: ModuleNode): Observable<ModuleNode[]> => of(node.jobs);

  /**
   * Not used but you might need this to programmatically expand nodes
   * to reveal a particular node
   */
  ///////// !!! TODO remove or use
  private expandNodesById(flatNodes: ModuleFlatNode[], ids: string[]): void {
    if (!flatNodes || flatNodes.length === 0) return;
    const idSet: Set<string> = new Set(ids);
    return flatNodes.forEach(node => {
      if (idSet.has(node.id)) {
        this.treeControl.expand(node);
        let parent: ModuleFlatNode = this.getParentNode(node);
        while (parent) {
          this.treeControl.expand(parent);
          parent = this.getParentNode(parent);
        }
      }
    });
  }

  private getParentNode(node: ModuleFlatNode): ModuleFlatNode | null {
    const currentLevel: number = node.level;
    if (currentLevel < 1) {
      return null;
    }
    const startIndex: number = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i: number = startIndex; i >= 0; i--) {
      const currentNode: ModuleFlatNode = this.treeControl.dataNodes[i];
      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
