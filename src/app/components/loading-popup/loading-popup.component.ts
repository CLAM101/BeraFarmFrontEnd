import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-loading-popup',

  templateUrl: './loading-popup.component.html',
  styleUrl: './loading-popup.component.css',
})
export class LoadingPopupComponent {
  @Output() closePopupClick = new EventEmitter<any>();
  loadingText: string;
  loadingStart = true;
  response: { message: string; success: boolean };
  visible = false;

  constructor() {}

  ngOnInit(): void {}

  closePopUpClick(e) {
    this.closePopupClick.emit(e);
  }

  startLoading(text: string) {
    this.loadingText = text;
    this.visible = true;
    this.loadingStart = true;
  }

  finishLoading(message: string, success: boolean) {
    this.loadingStart = false;
    this.response = {
      message,
      success,
    };
  }
}
