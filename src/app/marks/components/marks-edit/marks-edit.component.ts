import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-marks-edit',
  templateUrl: './marks-edit.component.html',
  styleUrls: ['./marks-edit.component.scss'],
})
export class MarksEditComponent implements OnInit {
  public selectedGroupId: string;
  public selectedDisciplineId: string;

  constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.selectedDisciplineId = this.route.snapshot.paramMap.get('disciplineId');
    this.selectedGroupId = this.route.snapshot.paramMap.get('groupId');
  }
}
