import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';

import { IDisciplineGroup, IDisciplineGroupStudent } from '../../models/group-students.model';
import { DisciplinesApiService } from '../../services/disciplines-api.service';

/**
 * Node for item
 */
export class DisciplineGroupNode {
  public id: number;
  public groupNumber: number;
  public students: DisciplineGroupNode[];
  public firstName: string;
  public lastName: string;
  public groupId: number;
  public isInDiscipline: boolean;
}

/** Flat item node with expandable and level information */
export class DisciplineGroupFlatNode {
  public item: string;
  public level: number;
  public expandable: boolean;
  public id: number;
  public parentId: number;
}

@Component({
  selector: 'app-discipline-dialog',
  templateUrl: './discipline-dialog.component.html',
  styleUrls: ['./discipline-dialog.component.scss'],
})
export class DisciplineDialogComponent implements OnInit {
  public treeControl: FlatTreeControl<DisciplineGroupFlatNode>;

  public dataSource: MatTreeFlatDataSource<DisciplineGroupNode, DisciplineGroupFlatNode>;

  /** The selection for checklist */
  public checklistSelection: SelectionModel<DisciplineGroupFlatNode> = new SelectionModel<DisciplineGroupFlatNode>(
    true /* multiple */
  );
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  private nestedNodeMap: Map<DisciplineGroupNode, DisciplineGroupFlatNode> = new Map<
    DisciplineGroupNode,
    DisciplineGroupFlatNode
  >();

  private treeFlattener: MatTreeFlattener<DisciplineGroupNode, DisciplineGroupFlatNode>;

  private mainData: IDisciplineGroup[];

  constructor(
    public dialogRef: MatDialogRef<DisciplineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { disciplineId: number },
    private api: DisciplinesApiService
  ) {}

  public ngOnInit(): void {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<DisciplineGroupFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.api.getGroupsAndStudents(this.data.disciplineId).subscribe((data: IDisciplineGroup[]) => {
      this.mainData = data;
      this.dataSource.data = data as DisciplineGroupNode[];
    });
  }

  public hasChild = (_: number, _nodeData: DisciplineGroupFlatNode) => _nodeData.expandable;

  /** Whether all the descendants of the node are selected. */
  public descendantsAllSelected(node: DisciplineGroupFlatNode): boolean {
    const descendants: DisciplineGroupFlatNode[] = this.treeControl.getDescendants(node);
    const descAllSelected: boolean =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  public descendantsPartiallySelected(node: DisciplineGroupFlatNode): boolean {
    const descendants: DisciplineGroupFlatNode[] = this.treeControl.getDescendants(node);
    const result: boolean = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the item selection. Select/deselect all the descendants node */
  public disciplineGroupSelectionToggle(node: DisciplineGroupFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants: DisciplineGroupFlatNode[] = this.treeControl.getDescendants(node);

    const isSelected: boolean = this.checklistSelection.isSelected(node);
    isSelected ? this.checklistSelection.select(...descendants) : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);

    this.mainData.forEach((group: IDisciplineGroup) => {
      if (group.id === node.id) {
        group.students.forEach((student: IDisciplineGroupStudent) => {
          student.isInDiscipline = isSelected;
        });
      }
    });
  }

  /** Toggle a leaf item selection. Check all the parents to see if they changed */
  public disciplineGroupLeafItemSelectionToggle(node: DisciplineGroupFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);

    const isSelected: boolean = this.checklistSelection.isSelected(node);
    this.mainData.forEach((group: IDisciplineGroup) => {
      if (group.id === node.parentId) {
        group.students.forEach((student: IDisciplineGroupStudent) => {
          if (student.id === node.id) {
            student.isInDiscipline = isSelected;
          }
        });
      }
    });
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public onSaveClick(): void {
    this.api.updateGroupsAndStudents(this.data.disciplineId, this.mainData).subscribe(res => {
      this.dialogRef.close();
    });
  }

  private getLevel = (node: DisciplineGroupFlatNode) => node.level;

  private isExpandable = (node: DisciplineGroupFlatNode) => node.expandable;

  private getChildren = (node: DisciplineGroupNode): DisciplineGroupNode[] => node.students;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  private transformer = (node: DisciplineGroupNode, level: number) => {
    const existingNode: DisciplineGroupFlatNode = this.nestedNodeMap.get(node);
    const flatNode: DisciplineGroupFlatNode =
      existingNode && existingNode.item === `${node.groupNumber}` ? existingNode : new DisciplineGroupFlatNode();
    flatNode.item = node.groupNumber ? `${node.groupNumber}` : `${node.firstName} ${node.lastName}`;
    flatNode.level = level;
    flatNode.expandable = !!node.students?.length;
    flatNode.id = node.id;
    flatNode.parentId = node.groupId ? node.groupId : null;

    this.nestedNodeMap.set(node, flatNode);
    if (node.isInDiscipline) {
      this.checklistSelection.select(flatNode);
    }
    return flatNode;
  };

  /* Checks all the parents when a leaf node is selected/unselected */
  private checkAllParentsSelection(node: DisciplineGroupFlatNode): void {
    let parent: DisciplineGroupFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  private checkRootNodeSelection(node: DisciplineGroupFlatNode): void {
    const nodeSelected: boolean = this.checklistSelection.isSelected(node);
    const descendants: DisciplineGroupFlatNode[] = this.treeControl.getDescendants(node);
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
  private getParentNode(node: DisciplineGroupFlatNode): DisciplineGroupFlatNode | null {
    const currentLevel: number = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex: number = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i: number = startIndex; i >= 0; i--) {
      const currentNode: DisciplineGroupFlatNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
