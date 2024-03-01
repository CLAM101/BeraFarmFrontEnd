import { Component, Directive, Input, ViewChild } from '@angular/core';
import { MintPanelComponent } from '../mint-panel/mint-panel.component';

@Component({
  selector: 'app-buy-page',
  standalone: true,
  imports: [MintPanelComponent],
  templateUrl: './buy-page.component.html',
  styleUrl: './buy-page.component.css',
})
export class BuyPageComponent {
  @ViewChild(MintPanelComponent) mintPanel: MintPanelComponent;
  constructor() {}
  ngOnInit(): void {}
  // onMintPanelClick() {
  //   this.mintPanel.open();
  // }
}
